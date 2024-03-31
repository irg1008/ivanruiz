import { xata } from '@/lib/db'

export const searchMe = async (query: string) => {
  const a = await xata.db.Snapshot.search(query, {
    target: ['name', 'document'],
    highlight: {
      enabled: true,
      encodeHTML: false,
    },
    fuzziness: 2,
  })

  console.log(a, a.records[0]?.xata)
}
