export const searchMe = async (query: string) => {
  const response = await fetch(`/api/search/${query}`)
  if (response.ok) {
    return response.json()
  }
}
