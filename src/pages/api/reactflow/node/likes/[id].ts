import {
	decrementNodeLike,
	getLikesCount,
	incrementNodeLike,
} from '@/pages/api/_services/reactflow.service'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ params }) => {
	if (!params.id) return new Response(null, { status: 400, statusText: 'Bad Request' })

	const likesCount = await getLikesCount(params.id)
	if (!likesCount) return new Response(null, { status: 404, statusText: 'Not Found' })

	return new Response(JSON.stringify(likesCount), {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
		},
	})
}

export const PATCH: APIRoute = async ({ params }) => {
	if (!params.id) return new Response(null, { status: 400, statusText: 'Bad Request' })

	const updatedNodeLike = await incrementNodeLike(params.id)

	return new Response(JSON.stringify(updatedNodeLike), {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
		},
	})
}

export const DELETE: APIRoute = async ({ params }) => {
	if (!params.id) return new Response(null, { status: 400, statusText: 'Bad Request' })

	const updatedNodeLike = await decrementNodeLike(params.id)

	return new Response(JSON.stringify(updatedNodeLike), {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
		},
	})
}
