import { Image, Tooltip } from '@nextui-org/react'
import { l, t } from 'astro-i18n'
import { motion } from 'framer-motion'
import { useState } from 'react'

export function TitleName() {
  const [stopImg, dragImg] = ['/imgs/me/me.webp', '/imgs/me/me-handsome.webp']
  const [meImg, setMeImg] = useState(stopImg)
  const [showTooltip, setShowTooltip] = useState(true)

  return (
    <aside className='relative ml-auto w-max p-12'>
      <a href={l('/')}>
        <h2 className='font-mogi text-4xl selection:bg-foreground selection:text-background md:text-6xl lg:text-8xl'>
          {t('name_dotted')}
        </h2>
      </a>
      <div className='absolute left-1/2 top-4 w-10 -translate-x-1/2 md:w-14 lg:w-20'>
        <Tooltip content={t('title_name.drag_me')} isDisabled={!showTooltip} showArrow offset={10}>
          <motion.div
            className='cursor-grab'
            drag
            dragConstraints={{ bottom: 800 }}
            dragTransition={{ bounceStiffness: 300, bounceDamping: 15 }}
            dragSnapToOrigin
            whileHover={{
              scale: 1.1,
            }}
            whileDrag={{
              cursor: 'grabbing',
              scale: 1.4,
            }}
            onDragStart={() => {
              setMeImg(dragImg)
              setShowTooltip(false)
            }}
            onDragEnd={() => {
              setMeImg(stopImg)
            }}
            onDragTransitionEnd={() => {
              setShowTooltip(true)
            }}
          >
            <Image
              draggable={false}
              loading='eager'
              isBlurred
              disableSkeleton
              src={meImg}
              alt={t('title_name.img_alt')}
              className='-rotate-3'
            />
          </motion.div>
        </Tooltip>
      </div>
    </aside>
  )
}
