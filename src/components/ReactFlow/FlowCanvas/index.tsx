import type { SnapshotDTO } from '@/lib/db/dto/reactflow.dto'
import { useIsEditing } from '@/lib/hooks/useEditing'
import { useFlowCanvas } from '@/lib/hooks/useFlowCanvas'
import { saveSnapshot } from '@/lib/services/reactflow.service'
import { Button, Tooltip, cn } from '@nextui-org/react'
import { t } from 'astro-i18n'
import { PencilIcon, SaveIcon } from 'lucide-react'
import { type ComponentProps } from 'react'
import ReactFlow, {
  Background,
  BackgroundVariant,
  ConnectionLineType,
  ConnectionMode,
  Controls,
  MarkerType,
  MiniMap,
  Panel,
  SelectionMode,
  useReactFlow,
  type DefaultEdgeOptions,
} from 'reactflow'
import { nodeTypes } from '../Nodes'
import './style.module.css'

export type ReactFlowProps = Omit<ComponentProps<typeof ReactFlow>, 'className'>

export type BaseReactFlowCanvasProps = {
  showBackground?: boolean
  showControls?: boolean
  showMinimap?: boolean
  flowClassName?: string
  flowProps?: ReactFlowProps
  editingFlowProps?: ReactFlowProps
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

export type FlowCanvasProps = BaseReactFlowCanvasProps & ConditionalReactFlowCanvasProps

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

export function FlowCanvas({
  snapshot,
  allowEditing,
  showBackground = true,
  showControls = true,
  flowClassName,
  showMinimap = false,
  flowProps,
  editingFlowProps,
}: FlowCanvasProps) {
  const {
    nodes,
    edges,
    createNodeSelector,
    onConnect,
    onEdgeUpdate,
    unselect,
    onEdgesChange,
    onNodesChange,
  } = useFlowCanvas({
    edges: snapshot.document.edges ?? [],
    nodes: snapshot.document.nodes ?? [],
    snapshotName: snapshot.name,
  })

  const { isEditing, toggleEditing } = useIsEditing()
  const { toObject } = useReactFlow()

  const onSave = async () => {
    if (!allowEditing) return
    toggleEditing()

    const flowObject = toObject()
    unselect({ nodes: flowObject.nodes })

    await saveSnapshot({
      ...snapshot,
      document: flowObject,
    })
  }

  return (
    <>
      <ReactFlow
        // eslint-disable-next-line tailwindcss/no-custom-classname
        className={cn('touchdevice-flow', flowClassName)}
        nodeOrigin={[0.5, 0]}
        fitView
        fitViewOptions={{
          padding: 0.2,
        }}
        minZoom={0.4}
        maxZoom={1.4}
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
        selectionOnDrag={true}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        selectionMode={SelectionMode.Partial}
        selectNodesOnDrag={isEditing}
        panOnDrag={isEditing ? [1] : [0, 1]}
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={baseEdge}
        connectionMode={ConnectionMode.Loose}
        onConnect={onConnect}
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
              <Tooltip content={t('reactflow.save')} placement='left'>
                <Button isIconOnly onClick={onSave}>
                  <SaveIcon className='size-5' />
                </Button>
              </Tooltip>
            ) : (
              <Tooltip content={t('reactflow.edit')} placement='left'>
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
