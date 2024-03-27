import { toggleTheme } from '@/pages/_services/theme.service'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async (ctx) => {
	toggleTheme(ctx.cookies)
	return new Response(null, { status: 200 })
}
