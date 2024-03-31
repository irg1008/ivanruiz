import type { FlatNodeLikeDTO, FlowLikesDTO } from '@/lib/db/dto/reactflow.dto'
import type { Like, Node, NodeLike } from '@/lib/db/xata'
import { persistentMap } from '@nanostores/persistent'
import { useStore } from '@nanostores/react'
import { atom, deepMap } from 'nanostores'
import { useCallback, useMemo } from 'react'

export const $isEditing = atom(false)
export const $flowLikes = deepMap<FlowLikesDTO>()

export const useIsEditing = () => {
  const isEditing = useStore($isEditing)

  const toggleEditing = useCallback(() => {
    $isEditing.set(!isEditing)
  }, [isEditing])

  return { isEditing, toggleEditing }
}

export const useNodeLikes = (nodeId: Node['id']) => {
  const store = useStore($flowLikes)
  const likes = useMemo(() => store[nodeId] ?? [], [store, nodeId])

  const updateLikesCount = (
    likeId: Like['id'],
    newValue: (like: FlatNodeLikeDTO) => NonNullable<Like['likeCount']>
  ) => {
    const like = likes.find((like) => like.likeId === likeId)
    const index = likes.indexOf(like!)

    const newCount = newValue(like!)
    $flowLikes.setKey(`${nodeId}[${index}].likeCount`, newCount)
  }

  const setLikes = (newLikes: FlatNodeLikeDTO[]) => {
    $flowLikes.setKey(nodeId, newLikes)
  }

  const setLikesCount = (likeId: Like['id'], n: NonNullable<Like['likeCount']>) => {
    updateLikesCount(likeId, () => n)
  }

  const incrementLikesCount = (likeId: Like['id'], n = 1) => {
    updateLikesCount(likeId, (like) => like.likeCount ?? 0 + n)
  }

  const decrementLikesCount = (likeId: Like['id'], n = 1) => {
    incrementLikesCount(likeId, -n)
  }

  return {
    likes,
    updateLikesCount,
    incrementLikesCount,
    decrementLikesCount,
    setLikesCount,
    setLikes,
  }
}

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
