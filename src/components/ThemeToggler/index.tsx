import { type Theme } from '@/pages/_services/theme.service'
import { toggleThemeCookie } from '@/services/theme.service'
import { observeDocTheme, toggleDocTheme } from '@/utils/theme.utils'
import { Switch } from '@nextui-org/react'
import { MoonIcon, SunIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'

type ThemeTogglerProps = {
	initialTheme: Theme
}

export function ThemeToggler({ initialTheme }: ThemeTogglerProps) {
	const [theme, setTheme] = useState<Theme>(initialTheme)
	const isDark = theme === 'dark'

	const toggleTheme = () => {
		toggleDocTheme()
		toggleThemeCookie()
	}

	useEffect(() => {
		const off = observeDocTheme({
			currentTheme: theme,
			onDocChange: (newTheme) => {
				flushSync(() => {
					setTheme(newTheme)
				})
			},
			applyTransition: true,
		})

		return () => {
			off()
		}
	}, [theme])

	return (
		<Switch
			isSelected={isDark}
			size='lg'
			color='secondary'
			startContent={<MoonIcon className='size-3' />}
			endContent={<SunIcon className='size-3' />}
			onChange={toggleTheme}
		/>
	)
}
