import type { APIRoute } from 'astro'
import { downloadSnapshot } from '../../../_services/reactflow.service'

export const GET: APIRoute = async ({ params }) => {
	const snapshot = await downloadSnapshot()
	const node = snapshot?.nodes.find((node) => node.id === params.id)
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
