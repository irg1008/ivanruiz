import { getNodeInfo } from '@/pages/_services/reactflow.service'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ params }) => {
	if (!params.id)
		return new Response(null, {
			status: 400,
			statusText: 'Bad Request',
		})

	const node = await getNodeInfo(params.id)

	if (!node)
		return new Response(null, {
			status: 404,
			statusText: 'Not Found',
		})

	return new Response(JSON.stringify(node), {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
		},
	})
}
