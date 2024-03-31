import type { AstroCookies } from 'astro'

const themeCookieName = 'theme'

export type Theme = 'light' | 'dark'

export const getTheme = (cookies: AstroCookies): Theme => {
	return (cookies.get(themeCookieName)?.value as Theme) ?? 'light'
}

export const setTheme = (cookies: AstroCookies, theme: Theme) => {
	cookies.set(themeCookieName, theme, {
		path: '/',
		expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
	})
}

export const toggleTheme = (cookies: AstroCookies) => {
	const theme = getTheme(cookies)
	setTheme(cookies, theme === 'light' ? 'dark' : 'light')
}
