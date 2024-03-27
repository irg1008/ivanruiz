import type { Theme } from '@/pages/_services/theme.service'
import { supportsViewTransitions } from 'astro:transitions/client'

const root = document.documentElement

export const docIsDark = () => {
	return root.classList.contains('dark')
}

export const toggleDocTheme = () => {
	root.classList.toggle('dark')
	root.classList.toggle('light')
}

export const prefersReducedMotion = () => {
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

type DocumentWithViewTransitions = Document & {
	startViewTransition: (cb: () => void) => { ready: Promise<void> }
}

export type ObserveDocThemeOptions = {
	currentTheme: Theme
	applyTransition?: boolean
	onDocChange: (theme: Theme) => void
}

const applyThemeTransition = async (cb: () => void) => {
	await (document as DocumentWithViewTransitions).startViewTransition(() => {
		cb()
	}).ready

	const { innerWidth: right, innerHeight: bottom } = window
	const maxRadius = Math.hypot(right, bottom)

	const easing = 'cubic-bezier(0.64, 0.57, 0.67, 1.53)'

	root.animate(
		{
			clipPath: [`circle(0px at 0px 0px)`, `circle(${maxRadius}px at 0px 0px)`],
			mixBlendMode: 'normal',
		},
		{
			duration: 500,
			easing: easing,
			pseudoElement: `::view-transition-new(root)`,
		}
	)
}
export const observeDocTheme = ({
	applyTransition,
	onDocChange,
	currentTheme,
}: ObserveDocThemeOptions) => {
	const observer = new MutationObserver(async () => {
		const isDark = docIsDark()
		const newTheme: Theme = isDark ? 'dark' : 'light'

		if (newTheme === currentTheme) return

		const action = () => onDocChange(newTheme)
		!applyTransition || !supportsViewTransitions || prefersReducedMotion()
			? action()
			: applyThemeTransition(action)
	})

	observer.observe(root, { attributes: true, attributeFilter: ['class'] })

	return () => {
		observer.disconnect()
	}
}
