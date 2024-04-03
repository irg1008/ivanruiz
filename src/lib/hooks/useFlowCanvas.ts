import { NodeType } from '@/components/ReactFlow/Nodes/types'
import { useCallback, useEffect, type MouseEventHandler } from 'react'
import {
  addEdge,
  updateEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
  useStore,
  type Edge,
  type Node,
  type OnConnect,
  type OnEdgeUpdateFunc,
} from 'reactflow'
import type { SnapshotDTO } from '../db/dto/reactflow.dto'
import { getNodeId } from '../services/reactflow.service'
import { getLayoutedElements, type Direction } from '../utils/layout.utils'
import { useIsEditing } from './useEditing'

type UseFlowCanvasProps = {
  snapshotName: SnapshotDTO['name']
  nodes: Node[]
  edges: Edge[]
}

export const useFlowCanvas = ({
  snapshotName,
  nodes: initialNodes,
  edges: initialEdges,
}: UseFlowCanvasProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const { screenToFlowPosition, fitView, getEdges, getNodes } = useReactFlow()
  const { isEditing } = useIsEditing()

  const unselect = useStore((s) => s.unselectNodesAndEdges)
  const reactFlowWidth = useStore((s) => s.width)

  const isMobile = reactFlowWidth < 768
  const padding = isMobile ? 0.3 : 0.8

  const setLayout = useCallback(
    (direction: Direction) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        getNodes(),
        getEdges(),
        {
          direction,
          distanceScale: {
            x: 0.8,
            y: 1.6,
          },
        }
      )
      setNodes(layoutedNodes)
      setEdges(layoutedEdges)
    },
    [setNodes, setEdges, getNodes, getEdges]
  )

  useEffect(() => {
    if (!reactFlowWidth || isEditing) return

    fitView({ padding })
    if (isMobile) setLayout('TB')
  }, [reactFlowWidth, isEditing, setLayout, fitView, isMobile, padding])

  const onConnect: OnConnect = useCallback(
    (params) => {
      if (!isEditing) return

      setEdges((eds) => addEdge(params, eds))
    },
    [isEditing, setEdges]
  )

  const onEdgeUpdate: OnEdgeUpdateFunc = useCallback(
    (oldEdge, newConnection) => {
      setEdges((els) => updateEdge(oldEdge, newConnection, els))
    },
    [setEdges]
  )

  const createNodeSelector: MouseEventHandler = useCallback(
    async (event) => {
      if (!isEditing) return
      const nodeId = await getNodeId()

      setNodes((nds) => {
        const newNode: Node = {
          id: nodeId,
          position: screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
          }),
          type: NodeType.Selector,
          data: { snapshotName },
        }

        return nds.concat(newNode)
      })
    },
    [screenToFlowPosition, isEditing, setNodes, snapshotName]
  )

  return {
    padding,
    isMobile,
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onEdgeUpdate,
    createNodeSelector,
    unselect,
  }
}
