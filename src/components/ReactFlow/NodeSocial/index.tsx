import type { FlatNodeLikeDTO } from '@/lib/db/dto/reactflow.dto'
import { likeNodeContent, toggleLikeNode } from '@/lib/services/reactflow.service'
import { useIsEditing, useNodeLikes } from '@/lib/stores/reactflow.store'
import { Button, ButtonGroup, Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react'
import { SmileIcon } from 'lucide-react'
import { memo, useState } from 'react'
import { useNodeId } from 'reactflow'
import { Emoji } from './Emoji'

const allowedEmojies = ['👍', '👎', '❤️', '😂', '😮', '😢', '😡']

export const NodeSocial = memo(() => {
  const [isOpen, setIsOpen] = useState(false)

  const nodeId = useNodeId()
  const { likes, setLikes, setLikesCount } = useNodeLikes(nodeId!)
  const { isEditing } = useIsEditing()

  if (nodeId === null) throw new Error('NodeSocial must be inside a node')
  if (isEditing) return null

  const onEmojiClick = async (nodeLike: FlatNodeLikeDTO) => {
    const like = await toggleLikeNode(nodeLike.nodeLikeId)
    if (like) setLikesCount(nodeLike.likeId, like.likeCount!)
  }

  const onNewEmojiClick = async (emoji: string) => {
    if (!nodeId) return
    setIsOpen(false)

    const alreadyLikedEmoji = likes.find((like) => like.content === emoji)
    if (alreadyLikedEmoji) return onEmojiClick(alreadyLikedEmoji)

    const newFlatLikes = await likeNodeContent({
      node: nodeId,
      content: emoji,
    })

    if (newFlatLikes) setLikes(newFlatLikes)
  }

  return (
    <div className='absolute bottom-0 left-0 flex w-full translate-y-2/3 items-center gap-2 px-4'>
      <Popover
        placement='right'
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        className='p-0'
        backdrop='opaque'
        classNames={{
          content: 'p-0',
        }}
      >
        <PopoverTrigger>
          <Button isIconOnly variant='solid' size='sm' radius='full'>
            <SmileIcon className='size-3' />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <ButtonGroup size='md' variant='light' color='secondary'>
            {allowedEmojies.map((emoji) => (
              <Button key={emoji} isIconOnly onClick={() => onNewEmojiClick(emoji)}>
                {emoji}
              </Button>
            ))}
          </ButtonGroup>
        </PopoverContent>
      </Popover>
      {likes.map((like) => (
        <Emoji key={like.likeId} like={like} onEmojiClick={onEmojiClick} />
      ))}
    </div>
  )
})

NodeSocial.displayName = 'NodeSocial'
