import { nodeWrapper } from './NodeWrapper'

export const TimelineNode = nodeWrapper(() => {
	return (
		<article className='-skew-x-12 border-2 border-stone-400 px-4 py-2 shadow-md'>
			<div className='skew-x-12'></div>
		</article>
	)
}, 'TimelineNode')
