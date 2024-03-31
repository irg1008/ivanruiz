import type { Theme } from '@/pages/_services/theme.service'

export const setThemeCookie = async (theme: Theme) => {
  await fetch(`/api/theme/set`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ theme }),
  })
}
