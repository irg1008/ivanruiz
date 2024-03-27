import type { Identifiable } from '@xata.io/client'
import type { Like, Node, NodeLike } from '../xata'

export type CreateNodeLikeDTO = {
	node: Identifiable | Node['id']
	content: string
}

export type FlatNodeLikeDTO = {
	nodeId: Node['id']
	nodeLikeId: NodeLike['id']
	content: NodeLike['content']
	likeId: Like['id']
	likeCount: NonNullable<Like['likeCount']>
}

export type FlowLikesDTO = Record<Node['id'], FlatNodeLikeDTO[]>
