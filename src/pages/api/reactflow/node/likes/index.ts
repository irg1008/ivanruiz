import type { CreateNodeLikeDTO } from '@/lib/db/dto/reactflow.dto'
import { createLike } from '@/pages/_services/reactflow.service'
import type { APIRoute } from 'astro'

export const POST: APIRoute = async (ctx) => {
  const body: CreateNodeLikeDTO = await ctx.request.json()

  const nodeLike = await createLike(body)
  if (!nodeLike) return new Response(null, { status: 409, statusText: 'Conflict' })

  return new Response(JSON.stringify(nodeLike), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
