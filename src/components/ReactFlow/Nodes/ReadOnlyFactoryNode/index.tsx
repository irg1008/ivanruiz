import { nodeWrapper } from '@/components/ReactFlow/NodeWrapper'
import type { NodeType } from '@/components/ReactFlow/Nodes/types'
import { useMemo } from 'react'
import { ComponentPicker } from './ComponentPicker'
import { ComponentWrapper } from './ComponentWrapper'
import { getComponentData } from './imports'

export const ReadOnlyFactoryNode = nodeWrapper<NodeType.ReadOnlyFactory>(({ data }) => {
  const { componentToLoad } = data

  const importData = useMemo(() => {
    return getComponentData(componentToLoad)
  }, [componentToLoad])

  const LazyComponent = useMemo(() => {
    return importData?.import()
  }, [importData])

  if (!LazyComponent || !importData) return <ComponentPicker />

  return (
    <ComponentWrapper importData={importData}>
      <LazyComponent />
    </ComponentWrapper>
  )
})
