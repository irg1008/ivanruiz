import { getAllLikesCount } from '@/pages/_services/reactflow.service'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ params }) => {
  if (!params.snapshot) return new Response(null, { status: 400 })
  const likesCount = await getAllLikesCount(params.snapshot)
  return new Response(JSON.stringify(likesCount), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
