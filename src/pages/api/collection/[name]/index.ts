import type { APIRoute } from 'astro'
import { astroI18n } from 'astro-i18n'
import { getCollection, type ContentCollectionKey } from 'astro:content'

export const GET: APIRoute = async (ctx) => {
  const collection = ctx.params.name
  if (!collection) {
    return new Response(null, {
      status: 400,
      statusText: 'Bad Request',
    })
  }

  const locale = ctx.url.searchParams.get('locale') ?? astroI18n.primaryLocale
  const jobs = await getCollection(collection as ContentCollectionKey, (j) =>
    j.id.startsWith(`${locale}/`)
  )

  return new Response(JSON.stringify(jobs), {
    headers: {
      'content-type': 'application/json',
    },
  })
}
