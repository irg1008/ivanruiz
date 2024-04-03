import { useStore } from '@nanostores/react'
import { useContext, useMemo } from 'react'
import type { Node } from 'reactflow'
import { FlowCanvasContext } from '../contexts/FlowCanvas.context'
import type { FlatNodeLikeDTO } from '../db/dto/reactflow.dto'
import type { Like } from '../db/xata'

export const useNodeLikes = (nodeId: Node['id']) => {
  const { $flowLikes } = useContext(FlowCanvasContext)
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
