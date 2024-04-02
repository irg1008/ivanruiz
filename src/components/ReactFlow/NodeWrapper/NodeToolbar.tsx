import { Button, Tooltip } from '@nextui-org/react'
import {
  ChevronsDownUpIcon,
  ChevronsLeftRightIcon,
  ChevronsRightLeftIcon,
  ChevronsUpDownIcon,
  TrashIcon,
} from 'lucide-react'
import { useCallback } from 'react'
import { useNodeId, useReactFlow } from 'reactflow'
import { ElementFit, NodeType, type BaseNodeData, type NodeProps } from '../Nodes/types'

export function NodeToolbar<T extends NodeType>(props: NodeProps<T>) {
  const { data } = props
  const { horiontalFit, verticalFit } = data

  const nodeId = useNodeId()
  const reactflow = useReactFlow()

  const removeNode = useCallback(() => {
    reactflow.setNodes((nodes) => {
      return nodes.filter((node) => node.id !== nodeId)
    })
  }, [nodeId, reactflow])

  const updateNodeData = useCallback(
    (updateDataCb: (data: BaseNodeData) => Partial<BaseNodeData>) => {
      if (!nodeId) return

      reactflow.setNodes((nodes) => {
        const node = reactflow.getNode(nodeId)

        if (!node) return nodes
        node.data = { ...node.data, ...updateDataCb(node.data) }
        nodes.splice(nodes.indexOf(node), 1, node)

        return nodes
      })
    },
    [nodeId, reactflow]
  )

  const toggleFit = useCallback((fit?: ElementFit) => {
    return fit === ElementFit.Fit ? ElementFit.Expand : ElementFit.Fit
  }, [])

  const toggleHorizontalFit = useCallback(() => {
    updateNodeData((data) => ({ horiontalFit: toggleFit(data.horiontalFit) }))
  }, [updateNodeData, toggleFit])

  const toggleVerticalFit = useCallback(() => {
    updateNodeData((data) => ({
      verticalFit: data.verticalFit === ElementFit.Fit ? ElementFit.Expand : ElementFit.Fit,
    }))
  }, [updateNodeData])

  return (
    <div className='absolute right-0 mt-2 flex w-full justify-end gap-2'>
      <Tooltip content='Toggle horizontal fit' placement='top'>
        <Button
          variant='flat'
          isIconOnly
          color='secondary'
          size='sm'
          aria-label='Horizontal fit'
          onClick={toggleHorizontalFit}
        >
          {horiontalFit === ElementFit.Fit ? (
            <ChevronsLeftRightIcon className='size-4' />
          ) : (
            <ChevronsRightLeftIcon className='size-4' />
          )}
        </Button>
      </Tooltip>

      <Tooltip content='Toggle vertical fit' placement='top'>
        <Button
          variant='flat'
          isIconOnly
          color='secondary'
          size='sm'
          aria-label='Vertical fit'
          onClick={toggleVerticalFit}
        >
          {verticalFit === ElementFit.Fit ? (
            <ChevronsUpDownIcon className='size-4' />
          ) : (
            <ChevronsDownUpIcon className='size-4' />
          )}
        </Button>
      </Tooltip>

      <Tooltip content='Remove node' placement='top'>
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
      </Tooltip>
    </div>
  )
}
