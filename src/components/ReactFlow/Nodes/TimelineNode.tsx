import { nodeWrapper } from './NodeWrapper'

export const TimelineNode = nodeWrapper(() => {
	return (
		<article className='-skew-x-12 border-2 border-stone-400 bg-gray-50 px-4 py-2 text-gray-800 shadow-md'>
			<div className='skew-x-12'></div>
		</article>
	)
}, 'TimelineNode')
