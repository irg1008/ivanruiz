import { nodeWrapper } from '../../NodeWrapper'
import type { NodeType } from '../types'

export const TimelineNode = nodeWrapper<NodeType.Timeline>(() => {
  return (
    <article className='-skew-x-12 border-2 border-stone-400 px-4 py-2 shadow-md'>
      <div className='skew-x-12'></div>
    </article>
  )
})
