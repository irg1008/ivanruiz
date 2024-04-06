import { cn } from '@/lib/utils/cn'
import { memo, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { ElementFit, type NodeProps, type NodeType, type WrapperCB } from '../Nodes/types'
import { Handles } from './NodeHandles'
import { NodeResizer } from './NodeResizer'
import { NodeRotator } from './NodeRotator'
import { NodeToolbar } from './NodeToolbar'

export function nodeWrapper<T extends NodeType>(cb: WrapperCB<T>) {
  const component = memo<NodeProps<T>>((props) => {
    const { selected, isConnectable, data } = props
    const { horiontalFit, verticalFit, rotation: initialRotation } = data
    const [rotation, setRotation] = useState(initialRotation)

    return (
      <article
        className={cn(
          'group/node-wrapper',
          horiontalFit === ElementFit.Fit ? 'w-fit' : 'w-full',
          verticalFit === ElementFit.Fit ? 'h-fit' : 'h-full'
        )}
        style={{ transform: `rotate(${rotation}deg)` }}
        onDoubleClick={(e) => e.stopPropagation()}
      >
        {cb(props)}

        {selected && (
          <>
            <NodeToolbar {...props} iconRotation={rotation ? -rotation : 0} />
            <NodeResizer isVisible={selected} />
            <NodeRotator onRotation={setRotation} />
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
