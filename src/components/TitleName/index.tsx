import { Tooltip } from '@nextui-org/react'
import { motion } from 'framer-motion'
import { useState } from 'react'

export function TitleName() {
	const [stopImg, dragImg] = ['/imgs/me.webp', '/imgs/me_handsome.webp']
	const [meImg, setMeImg] = useState(stopImg)
	const [showTooltip, setShowTooltip] = useState(true)

	return (
		<aside className='relative ml-auto w-max p-12'>
			<h2 className='font-phospene text-4xl text-gray-50 selection:bg-gray-50 selection:text-gray-800 md:text-6xl lg:text-8xl'>
				Iván Ruiz
			</h2>
			<div className='absolute left-1/2 top-4 w-10 -translate-x-1/2 md:w-14 lg:w-20'>
				<Tooltip content='Hi 😸, drag me around!' isDisabled={!showTooltip} showArrow offset={10}>
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
						<img
							draggable={false}
							src={meImg}
							alt='Supposed to be a handsome dev here'
							className='-rotate-6'
						/>
					</motion.div>
				</Tooltip>
			</div>
		</aside>
	)
}