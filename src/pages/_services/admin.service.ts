import type { AstroCookies } from 'astro'

const apiKeyCookieName = 'apiKey'

export const setApiKey = (cookies: AstroCookies, value: string) => {
	cookies.set(apiKeyCookieName, value, {
		path: '/',
		expires: new Date(Date.now() + 1000 * 60 * 30), // 30 minutes,
		secure: true,
		httpOnly: true,
		sameSite: 'strict',
	})
}

export const getApiKey = (cookies: AstroCookies) => {
	return cookies.get(apiKeyCookieName)
}

export const clearApiKey = (cookies: AstroCookies) => {
	cookies.delete(apiKeyCookieName)
}

export const isValidApiKey = (cookies: AstroCookies) => {
	return getApiKey(cookies)?.value === import.meta.env.API_KEY
}
