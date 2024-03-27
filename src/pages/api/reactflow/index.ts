import type { APIRoute } from 'astro'
import { downloadSnapshot, saveSnapshot } from '../_services/reactflow.service'

export const GET: APIRoute = async () => {
	const snapshot = await downloadSnapshot()
	if (!snapshot)
		return new Response(null, {
			status: 404,
			statusText: 'Not Found',
		})

	return new Response(JSON.stringify(snapshot), {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
		},
	})
}

export const POST: APIRoute = async (ctx) => {
	const body = await ctx.request.json()
	if (body?.length === 0)
		return new Response(null, {
			status: 400,
			statusText: 'Bad Request',
		})

	await saveSnapshot(body)

	return new Response(null, { status: 200 })
}
