import type { SnapshotDTO } from '@/lib/db/dto/reactflow.dto'
import { isValidApiKey } from '@/pages/_services/admin.service'
import { saveSnapshot } from '@/pages/_services/reactflow.service'
import type { APIRoute } from 'astro'

export const POST: APIRoute = async (ctx) => {
  const body: SnapshotDTO = await ctx.request.json()
  if (!body)
    return new Response(null, {
      status: 400,
      statusText: 'Bad Request',
    })

  if (!isValidApiKey(ctx.cookies))
    return new Response(null, {
      status: 401,
      statusText: 'Unauthorized',
    })

  await saveSnapshot(body)

  return new Response(null, { status: 200 })
}
