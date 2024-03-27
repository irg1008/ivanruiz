import { isValidApiKey } from '@/pages/_services/admin.service'
import { downloadSnapshot, saveSnapshot } from '@/pages/_services/reactflow.service'
import type { APIRoute } from 'astro'

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

	if (!isValidApiKey(ctx.cookies))
		return new Response(null, {
			status: 401,
			statusText: 'Unauthorized',
		})

	try {
		await saveSnapshot(body)
	} catch (error) {
		return new Response(JSON.stringify(error), {
			status: 500,
			headers: {
				'Content-Type': 'application/json',
			},
		})
	}

	return new Response(null, { status: 200 })
}
