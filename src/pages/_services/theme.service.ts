import type { AstroCookies } from 'astro'

const themeCookieName = 'theme'

export type Theme = 'light' | 'dark'

export const DEFAULT_THEME: Theme = 'light'

export const getTheme = (cookies: AstroCookies): Theme => {
	return (cookies.get(themeCookieName)?.value as Theme) ?? DEFAULT_THEME
}

export const setTheme = (cookies: AstroCookies, theme: Theme) => {
	cookies.set(themeCookieName, theme, {
		path: '/',
	})
}

export const toggleTheme = (cookies: AstroCookies) => {
	const theme = getTheme(cookies)
	setTheme(cookies, theme === 'light' ? 'dark' : 'light')
}
