import { Card, CardBody, Listbox, ListboxItem } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { useReactFlow, type Node } from 'reactflow'
import { NodeSocial } from '../../NodeSocial'
import { nodeWrapper } from '../../NodeWrapper'
import type { NodeType } from '../types'

type ImportFn = () => Promise<JSX.Element | (() => JSX.Element)>

type AvailableComponent = 'nodeSocial'

type ImportData = { import: ImportFn; label: string }

const availableComponents: Record<AvailableComponent, ImportData> = {
  nodeSocial: {
    import: () => import('@/components/SocialLinks').then((module) => module.SocialLinks),
    label: 'Social Links',
  },
}

const isValidComponentToLoad = (key: string): key is AvailableComponent => {
  return Object.keys(availableComponents).includes(key)
}

export const ReadOnlyNodeFactory = nodeWrapper<NodeType.ReadOnlyFactory>((props) => {
  const { id, data } = props
  const { componentToLoad } = data

  const [importedComponent, setImportedComponent] = useState<JSX.Element>()
  const reactFlow = useReactFlow()

  useEffect(() => {
    if (!isValidComponentToLoad(componentToLoad)) return
    setDynamicElement(componentToLoad)
  }, [componentToLoad])

  const setDynamicElement = async (key: AvailableComponent) => {
    const componentData = availableComponents[key as AvailableComponent]
    const component = await componentData.import()
    setImportedComponent(component)
  }

  const updateNodeComponentToLoad = (key: string) => {
    reactFlow.setNodes((nodes) => {
      const node = nodes.find((node) => node.id === id)
      if (!node) return nodes

      const newNode: Node = {
        ...node,
        data: {
          ...node.data,
          componentToLoad: key,
        },
      }

      nodes.splice(nodes.indexOf(node), 1, newNode)
      return nodes
    })
  }

  return (
    <>
      <Card className='size-full'>
        <CardBody>
          {importedComponent ?? (
            <Listbox
              aria-label='Choose Node'
              onAction={(key) => updateNodeComponentToLoad(key as AvailableComponent)}
            >
              {Object.entries(availableComponents).map(([key, data]) => (
                <ListboxItem key={key}>{data.label}</ListboxItem>
              ))}
            </Listbox>
          )}
        </CardBody>
      </Card>

      <NodeSocial />
    </>
  )
})
