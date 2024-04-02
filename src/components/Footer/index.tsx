import { useTheme } from '@/lib/stores/theme.store'
import { motion } from 'framer-motion'
import type { PropsWithChildren } from 'react'

export type FooterProps = PropsWithChildren

export function Footer({ children }: FooterProps) {
  const { isDark } = useTheme()

  return (
    <footer className='relative z-10 h-[70dvh] w-full'>
      <motion.div
        initial={{
          opacity: 0,
          clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
        }}
        animate={{
          opacity: 1,
          clipPath: isDark
            ? 'polygon(0 30%, 100% 0, 100% 100%, 0% 100%)'
            : 'polygon(0 50%, 100% 0, 100% 100%, 0% 100%)',
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20,
        }}
        className='absolute bottom-0 left-0 size-full bg-secondary-100/50 transition-colors'
      ></motion.div>

      {children}
    </footer>
  )
}
