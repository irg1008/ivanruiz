import type { CreateNodeLikeDTO, FlatNodeLikeDTO, SnapshotDTO } from '@/lib/db/dto/reactflow.dto'
import type { Like, NodeLike } from '@/lib/db/xata'
import { addToLocalLikes, hasUserLike, removeFromLocalLikes } from '@/lib/stores/reactflow.store'

export const saveSnapshot = async (snapshot: SnapshotDTO) => {
  return await fetch('/api/reactflow', {
    method: 'POST',
    body: JSON.stringify(snapshot),
    headers: { 'Content-Type': 'application/json' },
  })
}

export const getNodeId = async () => {
  const res = await fetch('/api/reactflow/genId')
  return res.text()
}

export const likeNodeContent = async (
  data: CreateNodeLikeDTO
): Promise<FlatNodeLikeDTO[] | null> => {
  const res = await fetch('/api/reactflow/node/likes', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) return null
  const flatLikes: FlatNodeLikeDTO[] = await res.json()
  const newLike = flatLikes.find((like) => like.content === data.content)
  if (newLike) addToLocalLikes(newLike.nodeLikeId)
  return flatLikes
}

export const toggleLikeNode = async (likeNodeId: NodeLike['id']): Promise<Like> => {
  const isLiked = hasUserLike(likeNodeId)
  const action = isLiked ? dislikeNode : likeNode
  return action(likeNodeId)
}

export const likeNode = async (likeNodeId: NodeLike['id']): Promise<Like> => {
  const res = await fetch(`/api/reactflow/node/likes/${likeNodeId}`, {
    method: 'PATCH',
  })
  if (res.ok) addToLocalLikes(likeNodeId)
  return res.json()
}

export const dislikeNode = async (likeNodeId: NodeLike['id']): Promise<Like> => {
  const res = await fetch(`/api/reactflow/node/likes/${likeNodeId}`, {
    method: 'DELETE',
  })
  if (res.ok) removeFromLocalLikes(likeNodeId)
  return res.json()
}
