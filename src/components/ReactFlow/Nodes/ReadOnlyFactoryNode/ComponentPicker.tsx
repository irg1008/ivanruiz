import { Card, CardBody, CardHeader, Divider, Listbox, ListboxItem } from '@nextui-org/react'
import { t } from 'astro-i18n'
import { useNodeId, useReactFlow } from 'reactflow'
import { availableComponents } from './imports'
import type { AvailableComponent } from './types'

export const ComponentPicker = () => {
  const reactFlow = useReactFlow()
  const nodeId = useNodeId()

  const updateNodeComponentToLoad = (key: string) => {
    reactFlow.setNodes((nodes) => {
      const node = reactFlow.getNode(nodeId!)
      if (!node) return nodes
      node.data = { componentToLoad: key }
      nodes.splice(nodes.indexOf(node), 1, node)
      return nodes
    })
  }

  return (
    <Card className='size-full'>
      <CardHeader>{t('reactflow.nodes.read_only_factory.choose_component')}</CardHeader>
      <Divider />
      <CardBody>
        <Listbox
          aria-label={t('reactflow.nodes.read_only_factory.choose_component')}
          onAction={(key) => updateNodeComponentToLoad(key as AvailableComponent)}
        >
          {Object.entries(availableComponents).map(([key, data]) => (
            <ListboxItem key={key}>{data.label}</ListboxItem>
          ))}
        </Listbox>
      </CardBody>
    </Card>
  )
}
