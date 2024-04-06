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
import { getDagreLayoutedElements } from '../utils/layout.utils'
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
  const unselect = useStore((s) => s.unselectNodesAndEdges)
  const { screenToFlowPosition, viewportInitialized, fitView } = useReactFlow()
  const { isEditing } = useIsEditing()

  const reactFlowWidth = useStore((s) => s.width)

  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  const reset = useCallback(() => {
    setNodes(initialNodes)
    setEdges(initialEdges)
  }, [setNodes, setEdges, initialNodes, initialEdges])

  const setLayout = useCallback(async () => {
    const layout = getDagreLayoutedElements(initialNodes, initialEdges, {
      width: reactFlowWidth,
      direction: 'TB',
    })

    setNodes(layout.nodes)
    setEdges(layout.edges)
  }, [initialNodes, initialEdges, setNodes, setEdges, reactFlowWidth])

  const init = useCallback(() => {
    if (!viewportInitialized) return
    reactFlowWidth > 900 ? reset() : setLayout()
  }, [viewportInitialized, reactFlowWidth, reset, setLayout])

  useEffect(() => {
    init()
  }, [init])

  useEffect(() => {
    if (!reactFlowWidth) return
    window.requestAnimationFrame(() => {
      fitView({ padding: 0.2 })
    })
  }, [reactFlowWidth, fitView])

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
    nodes,
    edges,
    reset,
    init,
    setLayout,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onEdgeUpdate,
    createNodeSelector,
    unselect,
  }
}
