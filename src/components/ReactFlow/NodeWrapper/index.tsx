import { cn } from '@/lib/utils/cn'
import { memo } from 'react'
import { twMerge } from 'tailwind-merge'
import { ElementFit, type NodeProps, type NodeType, type WrapperCB } from '../Nodes/types'
import { Handles } from './NodeHandles'
import { NodeResizer } from './NodeResizer'
import { NodeToolbar } from './NodeToolbar'

export function nodeWrapper<T extends NodeType>(cb: WrapperCB<T>) {
  const component = memo<NodeProps<T>>((props) => {
    const { selected, isConnectable, data } = props
    const { horiontalFit, verticalFit } = data

    return (
      <article
        className={cn(
          'group/node-wrapper',
          horiontalFit === ElementFit.Fit ? 'w-fit' : 'w-full',
          verticalFit === ElementFit.Fit ? 'h-fit' : 'h-full'
        )}
        onDoubleClick={(e) => e.stopPropagation()}
      >
        {cb(props)}

        {selected && (
          <>
            <NodeToolbar {...props} />
            <NodeResizer isVisible={selected} />
          </>
        )}

        <div
          className={twMerge(
            'opacity-0 group-hover/node-wrapper:opacity-100',
            !isConnectable && '!opacity-0',
            selected && 'opacity-100'
          )}
        >
          <Handles />
        </div>
      </article>
    )
  })

  component.displayName = 'NodeWrapper'
  return component
}
