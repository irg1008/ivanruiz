import { xata } from '@/lib/db'
import type {
  CreateNodeLikeDTO,
  FlatNodeLikeDTO,
  FlowLikesDTO,
  SnapshotDTO,
} from '@/lib/db/dto/reactflow.dto'
import type { Node, NodeLike, Snapshot } from '@/lib/db/xata'
import { groupBy } from '@/lib/utils/list.utils'
import type { ReactFlowJsonObject, Node as ReactFlowNode } from 'reactflow'

export const getSnapshot = async (name: SnapshotDTO['name']): Promise<SnapshotDTO | null> => {
  const snapshot = await xata.db.Snapshot.filter({ name }).getFirst()
  if (!snapshot) return null
  return snapshot
}

export const getNodeInfo = async (nodeId: Node['id']) => {
  const node = await xata.db.Node.filter({ id: nodeId }).select(['snapshot.id']).getFirst()
  if (!node) return null

  const snapshot = await xata.db.Snapshot.filter({
    id: node.snapshot!.id,
  }).getFirst()
  if (!snapshot) return null

  const doc: ReactFlowJsonObject = snapshot.document
  return doc.nodes.find((n) => n.id === nodeId)
}

const insertNodes = async (snapshot: Snapshot['id'], nodes: ReactFlowNode[]) => {
  if (nodes.length === 0) return
  await xata.db.Node.create(nodes.map((node) => ({ id: node.id, snapshot })))
}

const deleteNodes = async (nodeIds: Node['id'][]) => {
  if (nodeIds.length === 0) return

  const nodeLikes = await xata.db.NodeLike.filter({
    'node.id': { $any: nodeIds },
  })
    .select(['id', 'entity.id', 'entity.like.id'])
    .getMany()

  xata.transactions.run(
    nodeLikes.flatMap((nl) => [
      { delete: { table: 'NodeLike', id: nl.id } },
      { delete: { table: 'Entity', id: nl!.entity!.id } },
      { delete: { table: 'Like', id: nl.entity!.like!.id } },
    ])
  )

  xata.db.Node.delete(nodeIds)
}

const updateDBNodes = async ({ id, document }: SnapshotDTO) => {
  const currentSnapshotNodes = await xata.db.Node.filter({ snapshot: id }).getMany()

  const addedNodes = document.nodes.filter(
    (node) => !currentSnapshotNodes.some((n) => n.id === node.id)
  )

  const deletedNodes = currentSnapshotNodes.filter(
    (node) => !document.nodes.some((n) => n.id === node.id)
  )

  await insertNodes(id, addedNodes)
  await deleteNodes(deletedNodes.map((node) => node.id))
}

export const saveSnapshot = async (data: SnapshotDTO): Promise<SnapshotDTO> => {
  const snapshot = await xata.db.Snapshot.createOrReplace(data)
  await updateDBNodes(snapshot)
  return snapshot
}

const createNodeLikeRelationship = async (data: CreateNodeLikeDTO) => {
  const {
    results: [entity, like],
  } = await xata.transactions.run([
    { insert: { table: 'Entity', record: {} } },
    { insert: { table: 'Like', record: { likeCount: 1 } } },
  ])

  const {
    results: [nodeLike],
  } = await xata.transactions.run([
    { insert: { table: 'NodeLike', record: { ...data, entity: entity.id } } },
    { update: { table: 'Entity', id: entity.id, fields: { like: like.id } } },
    { update: { table: 'Like', id: like.id, fields: { likedEntity: entity.id } } },
  ])

  return xata.db.NodeLike.filter({ id: nodeLike.id }).getFirst()
}

export const createLike = async (data: CreateNodeLikeDTO) => {
  let nodeLike = await xata.db.NodeLike.filter(data).select(['node.id']).getFirst()
  if (nodeLike) return null
  nodeLike = await createNodeLikeRelationship(data)
  return await getLikesCount(nodeLike!.node!.id)
}

const getLike = (nodeLikeId: NodeLike['id']) => {
  return xata.db.NodeLike.filter({ id: nodeLikeId }).select(['entity.like']).getFirst()
}

export const incrementNodeLike = async (nodeLikeId: NodeLike['id'], n = 1) => {
  const nodeLike = await getLike(nodeLikeId)
  return await nodeLike?.entity?.like?.update({ likeCount: { $increment: n } })
}

export const decrementNodeLike = async (nodeLikeId: NodeLike['id'], n = 1) => {
  const nodeLike = await getLike(nodeLikeId)
  return await nodeLike?.entity?.like?.update({ likeCount: { $decrement: n } })
}

const getLikeCountQuery = () => {
  return xata.db.NodeLike.select([
    'id',
    'content',
    'node.id',
    'node.snapshot.id',
    'entity.like.id',
    'entity.like.likeCount',
  ]).sort('content')
}

type GetFirstFn = ReturnType<typeof getLikeCountQuery>['getFirst']
type ResolvedValue = Awaited<ReturnType<GetFirstFn>>
type DBLikeCount = NonNullable<ResolvedValue>

const mapLikeCountResult = (lc: DBLikeCount): FlatNodeLikeDTO => ({
  nodeId: lc.node?.id ?? '',
  nodeLikeId: lc.id,
  content: lc.content,
  likeId: lc.entity?.like?.id ?? '',
  likeCount: lc.entity?.like?.likeCount ?? 0,
})

export const getLikesCount = async (nodeId: Node['id']): Promise<FlatNodeLikeDTO[] | null> => {
  const likeCount = await getLikeCountQuery().filter({ node: nodeId }).getMany()
  if (!likeCount) return null
  return likeCount.map(mapLikeCountResult)
}

const groupByNodeId = async (likesQuery: ReturnType<typeof getLikeCountQuery>) => {
  const likes = await likesQuery.getAll()
  const flatLikeCount = likes.map(mapLikeCountResult)
  return groupBy(flatLikeCount, (lc) => lc.nodeId)
}

export const getAllLikesCount = (snapshot: Snapshot['name']): Promise<FlowLikesDTO> => {
  const query = getLikeCountQuery().filter({ 'node.snapshot.name': snapshot })
  return groupByNodeId(query)
}

export const getLikesCountForIds = (nodeIds: Node['id'][]): Promise<FlowLikesDTO> => {
  const query = getLikeCountQuery().filter({ 'node.id': { $any: nodeIds } })
  return groupByNodeId(query)
}
