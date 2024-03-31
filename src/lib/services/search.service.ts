import type { FlowDTO } from '@/lib/db/dto/reactflow.dto'

export const searchMe = async (query: string): Promise<FlowDTO | null> => {
  if (!query) return null
  const response = await fetch(`/api/search/${query}`)
  if (!response.ok) return null
  return response.json()
}
