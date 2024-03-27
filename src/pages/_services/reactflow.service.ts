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
	await xata.db.Node.create(nodes.map((node) => ({ id: node.id })))
}

const deleteNodes = async (nodeIds: Node['id'][]) => {
	await xata.db.Node.delete(nodeIds)
}

const getNodes = async () => {
	return await xata.db.Node.getMany()
}

const updateDBNodes = async (snapshot: ReactFlowJsonObject) => {
	const currentSnapshotNodes = await getNodes()

	const addedNodes = snapshot.nodes.filter(
		(node) => !currentSnapshotNodes.some((n) => n.id === node.id)
	)
	await insertNodes(addedNodes)

	const deletedNodes = currentSnapshotNodes.filter(
		(node) => !snapshot.nodes.some((n) => n.id === node.id)
	)
	await deleteNodes(deletedNodes.map((node) => node.id))
}

export const saveSnapshot = (snapshot: ReactFlowJsonObject) => {
	const bodyBuffer = Buffer.from(JSON.stringify(snapshot))
	updateDBNodes(snapshot)
	return saveFile(SNAPSHOT_FILENAME, bodyBuffer)
}

const createNodeLikeRelationship = async (data: CreateNodeLikeDTO) => {
	const like = await xata.db.Like.create({ likeCount: 1 })
	const entity = await xata.db.Entity.create({ like })
	like.update({ likedEntity: entity })
	return await xata.db.NodeLike.create({ ...data, entity })
}

export const createLike = async (data: CreateNodeLikeDTO) => {
	let nodeLike = await xata.db.NodeLike.filter(data).getFirst()
	if (nodeLike) return null
	nodeLike = await createNodeLikeRelationship(data)
	return await getLikesCount(nodeLike!.node!.id)
}

const getLike = async (nodeLikeId: NodeLike['id']) => {
	const nodeLike = await xata.db.NodeLike.filter({ id: nodeLikeId }).getFirst()
	if (!nodeLike) return null
	return await xata.db.Like.filter({ likedEntity: nodeLike.entity }).getFirst()
}

export const incrementNodeLike = async (nodeLikeId: NodeLike['id'], n = 1) => {
	const like = await getLike(nodeLikeId)
	if (!like) return null
	return await like.update({ likeCount: { $increment: n } })
}

export const decrementNodeLike = async (nodeLikeId: NodeLike['id'], n = 1) => {
	const like = await getLike(nodeLikeId)
	if (!like) return null
	return await like.update({ likeCount: { $decrement: n } })
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
