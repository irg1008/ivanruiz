import { projectName, projectOwner } from '@/lib/consts/github.consts'

export type StarsInfo = {
  stargazersUrl: string
  starCount: number
  projectUrl: string
}

export const getGithubStars = async (owner: string, repo: string): Promise<StarsInfo | null> => {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`)

  if (!res.ok) return null
  const data = await res.json()
  return {
    stargazersUrl: data.stargazers_url,
    starCount: data.stargazers_count,
    projectUrl: data.html_url,
  }
}

export const getMyGithubStars = async () => {
  return getGithubStars(projectOwner, projectName)
}
