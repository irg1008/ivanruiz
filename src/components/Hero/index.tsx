import FlowSearch from '@/components/Search'
import { useTheme } from '@/lib/stores/theme.store'
import { Button, Image } from '@nextui-org/react'
import { l, t } from 'astro-i18n'
import { navigate } from 'astro:transitions/client'
import { motion } from 'framer-motion'
import { BriefcaseIcon, GraduationCapIcon, SpeechIcon, type LucideIcon } from 'lucide-react'
import { useRef, type PropsWithChildren } from 'react'
import { CircleItems } from '../CircleItems'

export type HeroProps = PropsWithChildren<{
  initQuery?: string
}>

export function Hero({ initQuery = '', children }: HeroProps) {
  const { isDark } = useTheme()
  const items: CircleItemProps[] = [
    { icon: BriefcaseIcon, children: t('hero.links.jobs'), link: '/jobs' },
    { icon: GraduationCapIcon, children: t('hero.links.education'), link: '/education' },
    { icon: SpeechIcon, children: t('hero.links.events'), link: '/events' },
  ]

  const asideRef = useRef<HTMLElement>(null)
  const asideWidth = asideRef.current?.offsetWidth

  return (
    <>
      <section className='z-10 flex max-w-screen-lg flex-col items-center gap-20 px-10 lg:flex-row lg:items-start lg:justify-between lg:gap-14'>
        <header className='lg:basis-1/2'>
          <motion.h1
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className='font-mogi text-7xl md:text-8xl lg:text-9xl'
          >
            {t('name')}
          </motion.h1>
          <motion.p
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className='text-pretty border-l-2 border-secondary pl-6 text-large'
          >
            {children}
          </motion.p>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            className='mt-8'
          >
            <FlowSearch initQuery={initQuery} autoFocus />
          </motion.div>
        </header>

        <aside
          className='flex shrink items-center justify-end lg:max-w-[600px] lg:basis-1/2 2xl:max-w-[650px]'
          ref={asideRef}
        >
          <CircleItems
            archStart={[-50, -40]}
            maxArch={[100, 120]}
            breakpoints={[0, 650]}
            winWidthPercent={0.7}
            pointSize={50}
            maxWidth={asideWidth ?? 640}
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
  link: keyof RouteParameters
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
        onClick={async () => await navigate(l(link))}
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
      className='absolute left-1/2 top-1/2 size-full origin-center -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full'
    >
      <div className='mx-auto w-[65%]'>
        <Image
          draggable={false}
          loading='eager'
          isBlurred
          disableSkeleton
          src='/imgs/me/me-borderless.webp'
          alt='Supposed to be a handsome dev here'
          className='-rotate-3'
        />
      </div>
    </motion.div>
  )
}
