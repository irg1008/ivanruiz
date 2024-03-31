import { useTheme } from '@/lib/stores/theme.store'
import { cn } from '@/lib/utils/cn'
import { type Theme } from '@/pages/_services/theme.service'
import { Switch } from '@nextui-org/react'
import { motion } from 'framer-motion'
import { MoonIcon, SunIcon } from 'lucide-react'
import { useCounter } from 'usehooks-ts'

type ThemeToggleProps = {
  initialTheme: Theme
}

export function ThemeToggle({ initialTheme }: ThemeToggleProps) {
  const { toggle, isDark } = useTheme(initialTheme)
  return <RotationSwitch isSelected={isDark} onChange={toggle} />
}

type ThemeSwitchProps = {
  onChange: () => void
  isSelected?: boolean
}

export const RotationSwitch = ({ onChange, isSelected }: ThemeSwitchProps) => {
  const { count: rotations, increment } = useCounter(Number(isSelected))
  return (
    <div className='relative translate-y-[calc(-50%-2.5rem)]'>
      <motion.div
        animate={{ rotate: rotations * 180 }}
        initial={false}
        transition={{ type: 'tween', duration: 0.5, ease: [0.85, 0, 0.15, 1] }}
        className='flex cursor-pointer flex-col gap-20'
        onClick={() => {
          onChange()
          increment()
        }}
      >
        <SunIcon
          className={cn(
            'size-6 rotate-180 transition-opacity duration-500',
            !isSelected && 'opacity-0'
          )}
        />
        <MoonIcon
          className={cn('size-6 transition-opacity duration-500', isSelected && 'opacity-0')}
        />
      </motion.div>
    </div>
  )
}

export const NormalSwitch = ({ onChange, isSelected: isDark = false }: ThemeSwitchProps) => {
  return (
    <Switch
      isSelected={isDark}
      size='lg'
      color='secondary'
      startContent={<MoonIcon className='size-3' />}
      endContent={<SunIcon className='size-3' />}
      onChange={onChange}
    />
  )
}
