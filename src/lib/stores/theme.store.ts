import { setThemeCookie } from '@/lib/services/theme.service'
import type { Theme } from '@/pages/_services/theme.service'
import { useStore } from '@nanostores/react'
import { supportsViewTransitions } from 'astro:transitions/client'
import { atom } from 'nanostores'
import { useEffect } from 'react'

type DocumentWithViewTransitions = Document & {
  startViewTransition: (cb: () => void) => { ready: Promise<void> }
}

export const $theme = atom<Theme | undefined>()

export const useTheme = (initialTheme?: Theme) => {
  const theme = useStore($theme) ?? initialTheme
  const isDark = theme === 'dark'

  useEffect(() => {
    if (initialTheme) $theme.set(initialTheme)
  }, [initialTheme])

  const toggle = () => {
    const action = () => {
      const newTheme = isDark ? 'light' : 'dark'
      $theme.set(newTheme)
      setThemeCookie(newTheme)
      setDocTheme(newTheme)
    }

    if (!supportsViewTransitions || prefersReducedMotion()) action()
    else applyThemeTransition(action)
  }
  return { theme, isDark, toggle }
}

const root = document.documentElement

const setDocTheme = (theme: Theme) => {
  root.classList.remove('dark', 'light')
  root.classList.add(theme)
}

const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

const applyThemeTransition = async (cb: () => void) => {
  const transition = (document as DocumentWithViewTransitions).startViewTransition(cb)
  await transition.ready

  const { innerWidth: right, innerHeight: bottom } = window
  const maxRadius = Math.hypot(right, bottom)

  root.animate(
    {
      clipPath: [`circle(0px at 0px 0px)`, `circle(${maxRadius}px at 0px 0px)`],
      mixBlendMode: 'normal',
    },
    {
      duration: 500,
      easing: 'cubic-bezier(0.64, 0.57, 0.67, 1.53)',
      pseudoElement: `::view-transition-new(root)`,
    }
  )
}
