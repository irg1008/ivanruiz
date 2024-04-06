import { cn } from '@/lib/utils/cn'
import { drag, select } from 'd3'
import { useEffect, useRef } from 'react'
import { useNodeId, useReactFlow, useUpdateNodeInternals } from 'reactflow'

type NodeResizerProps = {
  onRotation?: (deg: number) => void
}

export function NodeRotator({ onRotation }: NodeResizerProps) {
  const rotateControlRef = useRef<HTMLDivElement>(null)
  const updateNodeInternals = useUpdateNodeInternals()
  const nodeId = useNodeId()
  const reactflow = useReactFlow()

  useEffect(() => {
    if (!rotateControlRef.current || !nodeId) return

    const selection = select(rotateControlRef.current)

    const dragHandler = drag<HTMLDivElement, unknown>().on('drag', (evt) => {
      const dx = evt.x - 100
      const dy = evt.y - 100
      const rad = Math.atan2(dx, dy)
      const deg = rad * (180 / Math.PI)
      const newDeg = 180 - deg

      reactflow.setNodes((nodes) => {
        const node = reactflow.getNode(nodeId)
        if (!node) return nodes

        onRotation?.(newDeg)
        node.data = { ...node.data, rotation: newDeg }
        nodes.splice(nodes.indexOf(node), 1, node)

        return nodes
      })

      updateNodeInternals(nodeId)
    })

    selection.call(dragHandler)
  }, [nodeId, updateNodeInternals, onRotation, reactflow])

  return (
    <div
      ref={rotateControlRef}
      className={cn(
        'absolute -top-7 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 cursor-alias rounded-full bg-yellow-400',
        'after:absolute after:left-1 after:top-2 after:h-7 after:w-px after:-translate-x-1/2 after:bg-yellow-500'
      )}
    />
  )
}
