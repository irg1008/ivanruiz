import { searchMe } from '@/lib/services/search.service'
import { useTheme } from '@/lib/stores/theme.store'
import { Button, Input } from '@nextui-org/react'
import { navigate } from 'astro:transitions/client'
import { motion } from 'framer-motion'
import {
  BriefcaseIcon,
  GraduationCapIcon,
  SearchIcon,
  SpeechIcon,
  type LucideIcon,
} from 'lucide-react'
import type { PropsWithChildren } from 'react'
import { useDebounceCallback } from 'usehooks-ts'
import { CircleItems } from '../CircleItems'

export function Hero() {
  const { isDark } = useTheme()

  const items: CircleItemProps[] = [
    { icon: BriefcaseIcon, children: 'Jobs', link: '/jobs' },
    { icon: GraduationCapIcon, children: 'Education', link: '/education' },
    { icon: SpeechIcon, children: 'Events', link: '/events' },
  ]

  const searchMeDebounced = useDebounceCallback(searchMe, 500)

  return (
    <>
      <section className='z-10 flex max-w-screen-lg flex-col items-center gap-20 px-10 lg:flex-row lg:items-start lg:justify-between'>
        <header className='lg:basis-1/2'>
          <motion.h1
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className='font-mogi text-7xl md:text-8xl lg:text-9xl'
          >
            Iván Ruiz
          </motion.h1>
          <motion.p
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className='text-pretty border-l-2 border-secondary pl-6 text-large'
          >
            Hi, if you are here you probably now that I am a <mark>software engineer</mark> and you
            are probably looking for something, be that a new recruit, or just checking this site
            out. So I {"won't"}
            make you lose your time. <mark>Click the links</mark> to get to know me better or{' '}
            <mark>search below</mark> for an easy lookup.
          </motion.p>
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <Input
              type='search'
              variant='faded'
              autoFocus
              classNames={{ mainWrapper: 'mt-10' }}
              placeholder='Search my skills, jobs, etc'
              startContent={<SearchIcon size={18} />}
              onChange={(e) => searchMeDebounced(e.target.value)}
            />
          </motion.div>
        </header>

        <aside className='flex items-center justify-end lg:basis-1/2'>
          <CircleItems
            archStart={[-50, -40]}
            maxArch={[100, 120]}
            breakpoints={[0, 650]}
            winWidthPercent={0.7}
            pointSize={50}
            maxWidth={640}
            circleWidthPercent={0.85}
            circleClassName='bg-secondary-200 shadow-secondary-200 border-8 border-secondary-100/40'
            circleComponent={<InnerCircleItem />}
          >
            {items.map((item, i) => (
              <CircleItem key={i} icon={item.icon} link={item.link}>
                {item.children}
              </CircleItem>
            ))}
          </CircleItems>
        </aside>
      </section>

      <motion.div
        initial={{
          opacity: 0,
          clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
        }}
        animate={{
          opacity: 1,
          clipPath: isDark
            ? 'polygon(0 0, 100% 0, 100% 60%, 0% 10%)'
            : 'polygon(0 0, 100% 0, 100% 30%, 0% 10%)',
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20,
        }}
        className='absolute left-0 top-0 size-full bg-secondary-100/50 transition-colors'
      ></motion.div>
    </>
  )
}

type CircleItemProps = PropsWithChildren<{
  icon: LucideIcon
  link: string
}>

const CircleItem = ({ icon: Icon, children, link }: CircleItemProps) => {
  return (
    <div className='relative size-min'>
      <Icon className='absolute left-1/3 top-1/3 size-20 -translate-x-1/2 -translate-y-1/2 text-secondary-900 opacity-5 md:size-32 lg:size-36' />
      <Button
        variant='shadow'
        color='secondary'
        size='lg'
        startContent={<Icon className='text-secondary-100' />}
        onClick={async () => await navigate(link)}
      >
        {children}
      </Button>
    </div>
  )
}

const InnerCircleItem = () => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        top: '40%',
      }}
      animate={{
        opacity: 1,
        top: '50%',
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
      className='absolute left-1/2 top-1/2 h-full w-[65%] origin-center -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full'
    >
      <img
        draggable={false}
        src='/imgs/me-borderless.webp'
        alt='Supposed to be a handsome dev here'
        className='w-full -rotate-3'
      />
    </motion.div>
  )
}
