export const toggleThemeCookie = async () => {
	await fetch('/api/theme/toggle', {
		method: 'GET',
	})
}
