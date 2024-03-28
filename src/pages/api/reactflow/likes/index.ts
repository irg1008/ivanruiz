import type { CreateNodeLikeDTO } from '@/db/dto/reactflow.dto'
import { createLike, getAllLikesCount } from '@/pages/_services/reactflow.service'
import type { APIRoute } from 'astro'

export const PUT: APIRoute = async (ctx) => {
	const body: CreateNodeLikeDTO = await ctx.request.json()

	const nodeLike = await createLike(body)
	if (!nodeLike) return new Response(null, { status: 409, statusText: 'Conflict' })

	return new Response(JSON.stringify(nodeLike), {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
		},
	})
}

export const GET: APIRoute = async () => {
	const likesCount = await getAllLikesCount()
	return new Response(JSON.stringify(likesCount), {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
		},
	})
}
