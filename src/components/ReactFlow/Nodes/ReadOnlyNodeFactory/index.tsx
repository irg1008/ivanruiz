import { Card, CardBody, Listbox, ListboxItem } from '@nextui-org/react'
import {
  Suspense,
  lazy,
  useEffect,
  useMemo,
  useState,
  type ComponentType,
  type LazyExoticComponent,
} from 'react'
import { useReactFlow } from 'reactflow'
import { NodeSocial } from '../../NodeSocial'
import { nodeWrapper } from '../../NodeWrapper'
import type { NodeType } from '../types'

type ImportFn = () => LazyExoticComponent<ComponentType>

type AvailableComponent = 'nodeSocial' | 'search' | 'starProject'

type ImportData = {
  import: ImportFn
  label: string
  isSocialComponent?: boolean
}

const availableComponents: Record<AvailableComponent, ImportData> = {
  nodeSocial: {
    import: () => lazy(() => import('@/components/SocialLinks')),
    label: 'Social Links',
  },
  search: {
    import: () => lazy(() => import('@/components/Hero/Search')),
    label: 'Search',
  },
  starProject: {
    import: () => lazy(() => import('@/components/StarProject')),
    label: 'Github Stars',
  },
}

const isValidComponentToLoad = (key: string): key is AvailableComponent => {
  return Object.keys(availableComponents).includes(key)
}

export const ReadOnlyNodeFactory = nodeWrapper<NodeType.ReadOnlyFactory>((props) => {
  const { id, data } = props
  const { componentToLoad } = data

  const [LazyComponent, setLazyComponent] = useState<LazyExoticComponent<ComponentType>>()
  const reactFlow = useReactFlow()

  useEffect(() => {
    if (!isValidComponentToLoad(componentToLoad)) return
    setDynamicElement(componentToLoad)
  }, [componentToLoad])

  const setDynamicElement = async (key: AvailableComponent) => {
    const componentData = availableComponents[key]
    const component = componentData.import()
    setLazyComponent(component)
  }

  const updateNodeComponentToLoad = (key: string) => {
    reactFlow.setNodes((nodes) => {
      const node = reactFlow.getNode(id)
      if (!node) return nodes
      node.data = { componentToLoad: key }
      nodes.splice(nodes.indexOf(node), 1, node)
      return nodes
    })
  }

  const componentData = useMemo(() => {
    if (!isValidComponentToLoad(componentToLoad)) return
    return availableComponents[componentToLoad]
  }, [componentToLoad])

  return (
    <>
      <Card className='size-full'>
        <CardBody>
          {LazyComponent ? (
            <Suspense>
              <LazyComponent />
            </Suspense>
          ) : (
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

      {componentData?.isSocialComponent && <NodeSocial />}
    </>
  )
})
