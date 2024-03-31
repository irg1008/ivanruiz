import { setTheme } from '@/pages/_services/theme.service'
import type { APIRoute } from 'astro'

export const POST: APIRoute = async (ctx) => {
	const body = await ctx.request.json()
	if (!body.theme) return new Response(null, { status: 400, statusText: 'Bad Request' })
	setTheme(ctx.cookies, body.theme)
	return new Response(null, { status: 200, statusText: 'OK' })
}
