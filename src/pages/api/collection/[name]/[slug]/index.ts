import type { APIRoute } from 'astro'
import { astroI18n } from 'astro-i18n'
import { getEntry, type ContentCollectionKey } from 'astro:content'

export const GET: APIRoute = async (ctx) => {
  const collection = ctx.params.name
  const slug = ctx.params.slug
  if (!slug || !collection) {
    return new Response(null, {
      status: 400,
      statusText: 'Bad Request',
    })
  }

  const locale = ctx.url.searchParams.get('locale') ?? astroI18n.primaryLocale
  const job = await getEntry(collection as ContentCollectionKey, `${locale}/${slug}`)

  if (!job) {
    return new Response(null, {
      status: 404,
      statusText: 'Not Found',
    })
  }

  return new Response(JSON.stringify(job), {
    headers: {
      'content-type': 'application/json',
    },
  })
}
