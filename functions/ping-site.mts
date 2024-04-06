import type { Config } from '@netlify/functions'

export default async () => {
  const siteUrl = Netlify.env.get('URL')
  if (!siteUrl) return

  const res = await fetch(siteUrl)
  // eslint-disable-next-line no-console
  if (!res.ok) console.log(`Failed to ping ${siteUrl}`)
}

export const config: Config = {
  schedule: '*/5 * * * *',
}
