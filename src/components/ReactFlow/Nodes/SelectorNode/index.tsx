import { nodeWrapper } from '@/components/ReactFlow/NodeWrapper'
import { NodeType } from '@/components/ReactFlow/Nodes/types'
import { Card, CardBody, CardHeader, Divider, Listbox, ListboxItem } from '@nextui-org/react'
import { t } from 'astro-i18n'
import { useReactFlow } from 'reactflow'

const nodeTypeLabels: Partial<Record<NodeType, string>> = {
  [NodeType.Job]: t('reactflow.nodes.job.label'),
  [NodeType.Project]: t('reactflow.nodes.project.label'),
  [NodeType.ReadOnlyFactory]: t('reactflow.nodes.read_only_factory.label'),
}

export const SelectorNode = nodeWrapper<NodeType.Selector>(({ id, data }) => {
  const reactFlow = useReactFlow()

  const updateNodeType = (newType: NodeType) => {
    reactFlow.setNodes((nodes) => {
      const node = reactFlow.getNode(id)
      if (!node) return nodes
      node.data = data
      node.type = newType
      nodes.splice(nodes.indexOf(node), 1, node)
      return nodes
    })
  }

  return (
    <Card className='size-full'>
      <CardHeader>{t('reactflow.nodes.selector.choose_node')}</CardHeader>
      <Divider />
      <CardBody>
        <Listbox
          aria-label={t('reactflow.nodes.selector.choose_node')}
          onAction={(key) => updateNodeType(key as NodeType)}
        >
          {Object.entries(nodeTypeLabels).map(([key, label]) => (
            <ListboxItem key={key}>{label}</ListboxItem>
          ))}
        </Listbox>
      </CardBody>
    </Card>
  )
})
