import { searchMe } from '@/pages/_services/search.service'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ params }) => {
  if (!params.query) {
    return new Response(null, {
      status: 400,
      statusText: 'Bad Request. Provide a valid query.',
    })
  }

  const response = await searchMe(params.query)
  return new Response(JSON.stringify(response), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
