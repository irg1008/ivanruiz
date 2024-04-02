import { Card, CardBody, Listbox, ListboxItem } from '@nextui-org/react'
import { useReactFlow, type Node } from 'reactflow'
import { nodeWrapper } from '../../NodeWrapper'
import { NodeType } from '../types'

const nodeTypeLabels: Partial<Record<NodeType, string>> = {
  [NodeType.Job]: 'Job',
  [NodeType.Timeline]: 'Timeline',
  [NodeType.ReadOnlyFactory]: 'Read Only',
}

export const SelectorNode = nodeWrapper<NodeType.Selector>(({ id, data }) => {
  const reactFlow = useReactFlow()

  const updateNodeType = (newType: NodeType) => {
    reactFlow.setNodes((nodes) => {
      const node = nodes.find((node) => node.id === id)
      if (!node) return nodes

      const newNode: Node = {
        ...node,
        type: newType,
        data,
      }

      nodes.splice(nodes.indexOf(node), 1, newNode)
      return nodes
    })
  }

  return (
    <Card className='size-full'>
      <CardBody>
        <Listbox aria-label='Choose Node' onAction={(key) => updateNodeType(key as NodeType)}>
          {Object.entries(nodeTypeLabels).map(([key, label]) => (
            <ListboxItem key={key}>{label}</ListboxItem>
          ))}
        </Listbox>
      </CardBody>
    </Card>
  )
})
