import { SNAPSHOT_FILENAME } from '@/consts/reactflow'
import { xata } from '@/db'
import type { CreateNodeLikeDTO, FlatNodeLikeDTO, FlowLikesDTO } from '@/db/dto/reactflow.dto'
import type { Node, NodeLike } from '@/db/xata'
import { groupBy } from '@/utils/list.utils'
import { Buffer } from 'node:buffer'
import type { ReactFlowJsonObject, Node as ReactFlowNode } from 'reactflow'
import { downloadFile, saveFile } from './files.service'

export const downloadSnapshot = async (): Promise<ReactFlowJsonObject | null> => {
	const blob = await downloadFile(SNAPSHOT_FILENAME)
	if (!blob) return null
	const snapshot = await blob.text()
	return JSON.parse(snapshot)
}

const insertNodes = async (nodes: ReactFlowNode[]) => {
	if (nodes.length === 0) return
	await xata.db.Node.create(nodes.map((node) => ({ id: node.id })))
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

const updateDBNodes = async (snapshot: ReactFlowJsonObject) => {
	const currentSnapshotNodes = await xata.db.Node.getMany()

	const addedNodes = snapshot.nodes.filter(
		(node) => !currentSnapshotNodes.some((n) => n.id === node.id)
	)

	const deletedNodes = currentSnapshotNodes.filter(
		(node) => !snapshot.nodes.some((n) => n.id === node.id)
	)

	await insertNodes(addedNodes)
	await deleteNodes(deletedNodes.map((node) => node.id))
}

export const saveSnapshot = (snapshot: ReactFlowJsonObject) => {
	const bodyBuffer = Buffer.from(JSON.stringify(snapshot))
	updateDBNodes(snapshot)
	return saveFile(SNAPSHOT_FILENAME, bodyBuffer)
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

export const getAllLikesCount = async (): Promise<FlowLikesDTO> => {
	const likeCount = await getLikeCountQuery().getMany()
	const flatLikeCount = likeCount.map(mapLikeCountResult)
	return groupBy(flatLikeCount, (lc) => lc.nodeId)
}
