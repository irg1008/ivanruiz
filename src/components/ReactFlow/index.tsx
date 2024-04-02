import {
  memo,
  useCallback,
  useEffect,
  useState,
  type ComponentProps,
  type MouseEventHandler,
} from 'react'
import ReactFlow, {
  Background,
  BackgroundVariant,
  ConnectionLineType,
  Controls,
  MarkerType,
  MiniMap,
  Panel,
  ReactFlowProvider,
  addEdge,
  updateEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type DefaultEdgeOptions,
  type Node,
  type OnConnect,
  type OnEdgeUpdateFunc,
  type ReactFlowInstance,
} from 'reactflow'

import type { FlowLikesDTO, SnapshotDTO } from '@/lib/db/dto/reactflow.dto'
import { getNodeId, saveSnapshot } from '@/lib/services/reactflow.service'
import { $flowLikes, useIsEditing } from '@/lib/stores/reactflow.store'
import { transition } from '@/lib/transition'
import { cn } from '@/lib/utils/cn'
import { Button, Tooltip } from '@nextui-org/react'
import { PencilIcon, SaveIcon } from 'lucide-react'
import 'reactflow/dist/style.css'
import { nodeTypes } from './Nodes'
import { NodeType } from './Nodes/types'
import './style.module.css'

export type FlowProps = Omit<ComponentProps<typeof ReactFlow>, 'className'>

export type BaseReactFlowCanvasProps = {
  flowLikes?: FlowLikesDTO
  showBackground?: boolean
  showControls?: boolean
  showMinimap?: boolean
  flowClassName?: string
  flowProps?: FlowProps
  editingFlowProps?: FlowProps
  onCustomSave?: (snapshot: SnapshotDTO) => unknown | Promise<unknown>
}

export type ConditionalReactFlowCanvasProps =
  | {
      snapshot: SnapshotDTO
      allowEditing?: true
    }
  | {
      snapshot: Omit<SnapshotDTO, 'id'>
      allowEditing?: false
    }

export type ReactFlowCanvasProps = BaseReactFlowCanvasProps & ConditionalReactFlowCanvasProps

const isSameCanvas = (prev: ReactFlowCanvasProps, next: ReactFlowCanvasProps) => {
  return prev.snapshot.name === next.snapshot.name
}

export const ReactFlowCanvas = memo(
  ({ className, ...props }: ReactFlowCanvasProps & { className?: string }) => {
    return (
      <ReactFlowProvider>
        <transition.div name='reactflow' className={cn('size-full', className)}>
          <CustomReactFlow {...props} />
        </transition.div>
      </ReactFlowProvider>
    )
  },
  isSameCanvas
)

ReactFlowCanvas.displayName = 'ReactFlowCanvas'

const connectionColor = 'hsl(var(--nextui-foreground))'
const connectionType: ConnectionLineType = ConnectionLineType.SmoothStep

const baseEdge: DefaultEdgeOptions = {
  animated: true,
  type: connectionType,
  style: { stroke: connectionColor },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 20,
    color: connectionColor,
    strokeWidth: 2,
  },
}

function CustomReactFlow({
  snapshot,
  allowEditing,
  flowLikes,
  showBackground = true,
  showControls = true,
  flowClassName,
  showMinimap = false,
  onCustomSave = saveSnapshot,
  flowProps,
  editingFlowProps,
}: ReactFlowCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(snapshot.document.nodes ?? [])
  const [edges, setEdges, onEdgesChange] = useEdgesState(snapshot.document.edges ?? [])
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null)
  const { screenToFlowPosition } = useReactFlow()
  const { isEditing, toggleEditing } = useIsEditing()

  useEffect(() => {
    if (flowLikes) $flowLikes.set(flowLikes)
  }, [flowLikes])

  const deselectNodes = (nodes: Node[]) => {
    return nodes.map((n) => ({ ...n, selected: false }))
  }

  const onSave = async () => {
    if (!rfInstance || !allowEditing) return
    toggleEditing()
    setNodes(deselectNodes(nodes))

    const flowObject = rfInstance.toObject()
    flowObject.nodes = deselectNodes(flowObject.nodes)

    await onCustomSave({
      ...snapshot,
      document: flowObject,
    })
  }

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
          data: { snapshotName: snapshot.name },
        }

        return nds.concat(newNode)
      })
    },
    [screenToFlowPosition, isEditing, setNodes, snapshot.name]
  )

  return (
    <>
      <ReactFlow
        // eslint-disable-next-line tailwindcss/no-custom-classname
        className={cn('touchdevice-flow', flowClassName)}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        nodeOrigin={[0.5, 0]}
        nodes={nodes}
        edges={edges}
        nodesConnectable={isEditing}
        elementsSelectable={isEditing}
        nodesFocusable={isEditing}
        nodesDraggable={true}
        edgesUpdatable={isEditing}
        nodeTypes={nodeTypes}
        connectionLineStyle={baseEdge.style}
        connectionLineType={connectionType}
        zoomOnDoubleClick={false}
        defaultEdgeOptions={baseEdge}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setRfInstance}
        onEdgeUpdate={onEdgeUpdate}
        onDoubleClick={createNodeSelector}
        {...(isEditing ? editingFlowProps : flowProps)}
      >
        {showControls && <Controls showInteractive={false} />}
        {showBackground && <Background variant={BackgroundVariant.Dots} />}
        {showMinimap && <MiniMap pannable />}

        {allowEditing && (
          <Panel position='bottom-right'>
            {isEditing ? (
              <Tooltip content='Save' placement='left'>
                <Button isIconOnly onClick={onSave}>
                  <SaveIcon className='size-5' />
                </Button>
              </Tooltip>
            ) : (
              <Tooltip content='Edit' placement='left'>
                <Button isIconOnly onClick={toggleEditing}>
                  <PencilIcon className='size-5' />
                </Button>
              </Tooltip>
            )}
          </Panel>
        )}
      </ReactFlow>
    </>
  )
}
