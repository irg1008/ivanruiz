import { Button, Tooltip } from '@nextui-org/react'
import { t } from 'astro-i18n'
import {
  ChevronsDownUpIcon,
  ChevronsLeftRightIcon,
  ChevronsRightLeftIcon,
  ChevronsUpDownIcon,
  TrashIcon,
} from 'lucide-react'
import { useCallback } from 'react'
import { useNodeId, useReactFlow, useUpdateNodeInternals } from 'reactflow'
import { ElementFit, NodeType, type BaseNodeData, type NodeProps } from '../Nodes/types'

type NodeToolbarProps<T extends NodeType> = NodeProps<T> & {
  iconRotation?: number
}

export function NodeToolbar<T extends NodeType>({ data, iconRotation }: NodeToolbarProps<T>) {
  const { horiontalFit, verticalFit } = data

  const nodeId = useNodeId()
  const reactflow = useReactFlow()
  const updateNodeInternals = useUpdateNodeInternals()

  const removeNode = useCallback(() => {
    if (!nodeId) return
    const node = reactflow.getNode(nodeId)
    reactflow.deleteElements({ nodes: [node!] })
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

      updateNodeInternals(nodeId)
    },
    [nodeId, reactflow, updateNodeInternals]
  )

  const toggleFit = useCallback((fit?: ElementFit) => {
    return fit === ElementFit.Fit ? ElementFit.Expand : ElementFit.Fit
  }, [])

  const toggleHorizontalFit = useCallback(() => {
    updateNodeData((data) => ({ horiontalFit: toggleFit(data.horiontalFit) }))
  }, [updateNodeData, toggleFit])

  const toggleVerticalFit = useCallback(() => {
    updateNodeData((data) => ({ verticalFit: toggleFit(data.verticalFit) }))
  }, [updateNodeData, toggleFit])

  const iconClassName = 'size-4'
  const iconStyle: React.CSSProperties = { transform: `rotate(${iconRotation}deg)` }
  const iconProps = { className: iconClassName, style: iconStyle }

  return (
    <div className='absolute right-0 mt-2 flex w-full justify-end gap-2'>
      <Tooltip
        content={t('reactflow.toolbar.toggle_horizontal_fit')}
        placement='bottom'
        delay={2000}
      >
        <Button
          variant='flat'
          isIconOnly
          color='secondary'
          size='sm'
          aria-label={t('reactflow.toolbar.toggle_horizontal_fit')}
          onClick={toggleHorizontalFit}
        >
          {horiontalFit === ElementFit.Fit ? (
            <ChevronsLeftRightIcon {...iconProps} />
          ) : (
            <ChevronsRightLeftIcon {...iconProps} />
          )}
        </Button>
      </Tooltip>

      <Tooltip content={t('reactflow.toolbar.toggle_vertical_fit')} placement='bottom' delay={2000}>
        <Button
          variant='flat'
          isIconOnly
          color='secondary'
          size='sm'
          aria-label={t('reactflow.toolbar.toggle_vertical_fit')}
          onClick={toggleVerticalFit}
        >
          {verticalFit === ElementFit.Fit ? (
            <ChevronsUpDownIcon {...iconProps} />
          ) : (
            <ChevronsDownUpIcon {...iconProps} />
          )}
        </Button>
      </Tooltip>

      <Tooltip content={t('reactflow.toolbar.delete_node')} placement='bottom' delay={2000}>
        <Button
          variant='flat'
          isIconOnly
          color='danger'
          size='sm'
          aria-label={t('reactflow.toolbar.delete_node')}
          onClick={removeNode}
        >
          <TrashIcon {...iconProps} />
        </Button>
      </Tooltip>
    </div>
  )
}
