import { areHintsDismissed, saveHintsDismissed } from '@/lib/stores/hints.store'
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react'
import { t } from 'astro-i18n'
import { AnimatePresence, motion, type AnimationProps } from 'framer-motion'
import { HandIcon, MouseIcon } from 'lucide-react'
import { useState } from 'react'
import { useInterval } from 'usehooks-ts'

const waveAnimation: NonNullable<AnimationProps['animate']> = {
  x: [0, -10, 10, 0, -10, 0],
  rotate: [0, -10, 10, 0, -5, 0],
}

const scrollAnimation: NonNullable<AnimationProps['animate']> = {
  y: [0, -10, 0, -10, 10, 0],
}

export function SnapshotHint() {
  const { isOpen, onOpenChange } = useDisclosure({
    defaultOpen: !areHintsDismissed(),
  })

  const [iconToShow, setIconToShow] = useState<'hand' | 'scroll'>('hand')
  const Icon = iconToShow === 'hand' ? HandIcon : MouseIcon

  const iconAnimation: AnimationProps['animate'] =
    iconToShow === 'hand' ? waveAnimation : scrollAnimation

  useInterval(() => {
    setIconToShow((p) => (p === 'hand' ? 'scroll' : 'hand'))
  }, 5000)

  return (
    <Modal isOpen={isOpen} size='sm' backdrop='opaque' onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='flex flex-col gap-1'>{t('reactflow.hint.title')}</ModalHeader>
            <ModalBody className='flex flex-col gap-2'>
              <span className='flex flex-col items-center gap-3 text-balance text-center text-foreground-500'>
                <AnimatePresence mode='wait'>
                  <motion.div
                    className='relative'
                    key={iconToShow}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.span
                      className='flex'
                      animate={iconAnimation}
                      transition={{
                        duration: 4,
                        ease: 'easeInOut',
                        times: [0, 0.2, 0.5, 0.8, 1],
                        repeat: Infinity,
                        repeatDelay: 0.2,
                      }}
                    >
                      <Icon className='size-14' />
                    </motion.span>
                  </motion.div>
                </AnimatePresence>
                {t('reactflow.hint.description')}
              </span>
            </ModalBody>
            <ModalFooter>
              <Button
                color='success'
                onPress={() => {
                  saveHintsDismissed()
                  onClose()
                }}
              >
                {t('reactflow.hint.dismiss_text')}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
