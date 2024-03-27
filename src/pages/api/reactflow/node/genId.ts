import type { APIRoute } from 'astro'
import { randomUUID } from 'node:crypto'

export const GET: APIRoute = async () => {
	const id = randomUUID()
	return new Response(id, { status: 200 })
}
