import { cn } from '@/lib/utils/cn'
import { motion } from 'framer-motion'
import { type CSSProperties, type ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import { useWindowSize } from 'usehooks-ts'
import { Meteors } from '../Meteors'

type CircleItemsProps = {
  circleComponent: ReactNode
  children: ReactNode[]
  archStart: number | number[]
  maxArch: number | number[]
  breakpoints?: number[]
  direction?: number
  minWidth?: number
  maxWidth?: number
  showCircle?: boolean
  circleWidthPercent?: number
  winWidthPercent?: number
  pointSize?: number
  circleClassName?: string
  showMeteors?: boolean
  meteorsClassName?: string
  className?: string
}

export function CircleItems({
  children,
  circleComponent,
  archStart = -30,
  maxArch = 180,
  breakpoints,
  showCircle = true,
  circleWidthPercent = 0.7,
  winWidthPercent = 0.6,
  direction = -1,
  minWidth = 275,
  maxWidth = 1500,
  pointSize = 50,
  circleClassName,
  showMeteors = true,
  meteorsClassName,
  className,
}: CircleItemsProps) {
  const { width: winWidth } = useWindowSize({
    debounceDelay: 500,
  })

  function getArrayValue<T = number>(values: T | T[]): T {
    if (!Array.isArray(values)) return values
    if (breakpoints?.length === 0) return values[0] as T
    const index = breakpoints!.findLastIndex((bp) => bp < winWidth)
    return (values[index] as T) ?? (values[0] as T)
  }

  const getMaxArch = () => {
    return getArrayValue(maxArch)
  }

  const getArchStart = () => {
    return getArrayValue(archStart)
  }

  const numItems = children?.length ?? 0

  const width = Math.max(minWidth, Math.min(winWidth * winWidthPercent, maxWidth))
  const radius = width / 2 - pointSize / 2

  const cssAngleFix = -90
  const angleStart = cssAngleFix + getArchStart()
  const angleStep = getMaxArch() / numItems

  const angle = (i: number) => angleStart + angleStep * i * direction
  const x = (i: number) => radius * Math.cos((angle(i) * Math.PI) / 180)
  const y = (i: number) => radius * Math.sin((angle(i) * Math.PI) / 180)
  const top = (i: number) => y(i) + radius
  const left = (i: number) => x(i) + radius

  const circleStyle: CSSProperties = {
    width: `${width}px`,
    height: `${width}px`,
    position: 'relative',
  }

  return (
    <div style={circleStyle} className={className}>
      {showCircle && (
        <motion.div
          initial={{
            scale: 0,
            opacity: 0,
          }}
          animate={{
            scale: 1,
            opacity: 1,
            width: `${width * circleWidthPercent}px`,
            height: `${width * circleWidthPercent}px`,
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20,
            delay: 0.25,
          }}
          style={{
            width: `${width * 0.7}px`,
            height: `${width * 0.7}px`,
          }}
          className={twMerge(
            'relative m-auto overflow-hidden rounded-full bg-foreground-800 shadow-2xl',
            circleClassName
          )}
        >
          {showMeteors && (
            <Meteors
              number={20}
              className={cn(
                'bg-inherit transition-colors before:from-foreground-50',
                meteorsClassName
              )}
            />
          )}
        </motion.div>
      )}

      {circleComponent}

      {children.map((item, i) => (
        <motion.div
          key={i}
          className='absolute origin-center'
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20,
            delay: 0.5 + i * 0.2,
          }}
          initial={{
            opacity: 0,
            scale: 0,
            width: `${pointSize}px`,
            height: `${pointSize}px`,
            top: `${radius}px`,
            left: `${radius}px`,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            top: `${top(i)}px`,
            left: `${left(i)}px`,
          }}
        >
          {item}
        </motion.div>
      ))}
    </div>
  )
}
