import type { FlatNodeLikeDTO } from '@/db/dto/reactflow.dto'
import { hasUserLike } from '@/stores/reactflow.store'
import { Badge, Button } from '@nextui-org/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

type EmojiProps = {
	like: FlatNodeLikeDTO
	onEmojiClick: (nodeLike: FlatNodeLikeDTO) => void
}

export const Emoji = ({ like, onEmojiClick }: EmojiProps) => {
	const isLiked = hasUserLike(like.nodeLikeId)
	const color = isLiked ? 'success' : 'secondary'
	const [showAnimation, setShowAnimation] = useState(false)

	return (
		<AnimatePresence>
			{like.likeCount > 0 && (
				<motion.div exit={{ scale: 0, opacity: 0 }}>
					<Badge
						content={like.likeCount}
						color={color}
						key={like.likeId}
						size='sm'
						placement='bottom-right'
						variant='faded'
						shape='circle'
					>
						<motion.div
							animate={showAnimation ? { scale: 1.2 } : { scale: 1 }}
							onAnimationComplete={() => setShowAnimation(false)}
						>
							<Button
								radius='full'
								isIconOnly
								color={color}
								variant='shadow'
								size='sm'
								onClick={() => {
									onEmojiClick(like)
									setShowAnimation(!isLiked)
								}}
							>
								{like.content}
							</Button>
						</motion.div>
					</Badge>
				</motion.div>
			)}
		</AnimatePresence>
	)
}