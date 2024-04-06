import type { APIRoute } from 'astro'

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({ message: 'Hello, World!' }), {
    headers: {
      'content-type': 'application/json',
    },
  })
}
