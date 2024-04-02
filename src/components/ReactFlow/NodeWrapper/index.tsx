import { Button } from '@nextui-org/react'
import { TrashIcon } from 'lucide-react'
import { memo, useCallback } from 'react'
import {
  NodeResizer as BaseNodeResizer,
  Handle,
  Position,
  useNodeId,
  useReactFlow,
} from 'reactflow'
import { twMerge } from 'tailwind-merge'
import type { NodeProps, NodeType, WrapperCB } from '../Nodes/types'

export function nodeWrapper<T extends NodeType>(cb: WrapperCB<T>) {
  return memo<NodeProps<T>>((props) => {
    const { selected, isConnectable } = props

    return (
      <article className='group/node-wrapper size-full' onDoubleClick={(e) => e.stopPropagation()}>
        {cb(props)}

        {selected && (
          <>
            <NodeToolbar />
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
}

export function Handles() {
  return (
    <>
      <Handle type='target' id='top' position={Position.Top} className='!bg-teal-500' />
      <Handle type='target' id='left' position={Position.Left} className='!bg-teal-500' />
      <Handle type='source' id='bottom' position={Position.Bottom} className='!bg-teal-500' />
      <Handle type='source' id='right' position={Position.Right} className='!bg-teal-500' />
    </>
  )
}

export function NodeResizer({ isVisible }: { isVisible: boolean }) {
  return <BaseNodeResizer isVisible={isVisible} color='#fff000' minWidth={100} minHeight={30} />
}

export function NodeToolbar() {
  const nodeId = useNodeId()
  const reactflow = useReactFlow()

  const removeNode = useCallback(() => {
    reactflow.setNodes((nodes) => {
      return nodes.filter((node) => node.id !== nodeId)
    })
  }, [nodeId, reactflow])

  return (
    <div className='absolute bottom-full right-0 mb-2 flex w-full justify-end gap-2'>
      <Button
        variant='flat'
        isIconOnly
        color='danger'
        size='sm'
        aria-label='Remove node'
        onClick={removeNode}
      >
        <TrashIcon className='size-4' />
      </Button>
    </div>
  )
}
