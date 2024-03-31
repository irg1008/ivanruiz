import type { Identifiable } from '@xata.io/client'
import type { ReactFlowJsonObject } from 'reactflow'
import type { Like, Node, NodeLike, Snapshot } from '../xata'

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

export type SnapshotDTO = {
  id: Snapshot['id']
  document: ReactFlowJsonObject
  name: string
}

export type FlowDTO = {
  likes: FlowLikesDTO
  flowObject: ReactFlowJsonObject
}
