import { persistentMap } from '@nanostores/persistent'
import type { NodeLike } from '../db/xata'

const $localFlowLikes = persistentMap<Record<NodeLike['id'], string | undefined>>('userLikes')

export const addToLocalLikes = (nodeLikeId: NodeLike['id']) => {
  $localFlowLikes.setKey(nodeLikeId, '👊')
}

export const removeFromLocalLikes = (nodeLikeId: NodeLike['id']) => {
  $localFlowLikes.setKey(nodeLikeId, undefined)
}

export const hasUserLike = (nodeLikeId: NodeLike['id']) => {
  return Boolean($localFlowLikes.get()[nodeLikeId])
}
