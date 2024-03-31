import { getSnapshot } from '@/pages/_services/reactflow.service'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async (ctx) => {
	if (!ctx.params.snapshot) return new Response(null, { status: 400 })

	const snapshot = await getSnapshot(ctx.params.snapshot)
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
