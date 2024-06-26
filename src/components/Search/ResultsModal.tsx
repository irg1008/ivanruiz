import { ReactFlow } from '@/components/ReactFlow'
import type { FlowDTO } from '@/lib/db/dto/reactflow.dto'
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react'
import { t } from 'astro-i18n'

export type ResultsModalProps = {
  query: string
  flow: FlowDTO
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export function ResultsModal({ flow, query, isOpen, onOpenChange }: ResultsModalProps) {
  return (
    <Modal
      size='5xl'
      placement='bottom'
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: 'easeOut',
            },
          },
          exit: {
            y: 100,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: 'easeIn',
            },
          },
        },
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              {t('search.results')} <em>{`"${query}"`}</em>
            </ModalHeader>
            <ModalBody>
              <ReactFlow
                className='h-[80dvh]'
                flowLikes={flow.likes}
                snapshot={{
                  name: 'flow_search_result',
                  document: flow.flowObject,
                }}
              />
            </ModalBody>
            <ModalFooter>
              <Button color='danger' variant='flat' onPress={onClose}>
                {t('search.close_modal')}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
