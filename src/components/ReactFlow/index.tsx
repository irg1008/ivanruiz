import { useCallback, useEffect, useState, type MouseEventHandler } from 'react'
import ReactFlow, {
    Background,
    BackgroundVariant,
    ConnectionLineType,
    Controls,
    MarkerType,
    Panel,
    ReactFlowProvider,
    addEdge,
    updateEdge,
    useEdgesState,
    useNodesState,
    useReactFlow,
    type Edge,
    type Node,
    type OnConnect,
    type OnEdgeUpdateFunc,
    type ReactFlowInstance,
} from 'reactflow'

import type { FlowLikesDTO, SnapshotDTO } from '@/lib/db/dto/reactflow.dto'
import { getNodeId, saveSnapshot } from '@/lib/services/reactflow.service'
import { $flowLikes, useIsEditing } from '@/lib/stores/reactflow.store'
import { transition } from '@/lib/transition'
import { Button, Tooltip } from '@nextui-org/react'
import { PencilIcon, SaveIcon } from 'lucide-react'
import 'reactflow/dist/style.css'
import { nodeTypes } from './Nodes'
import { NodeType } from './Nodes/types'
import './style.module.css'

type ReactFlowCanvasProps = {
	snapshot: SnapshotDTO
	flowLikes?: FlowLikesDTO
	allowEditing?: boolean
}

export function ReactFlowCanvas(props: ReactFlowCanvasProps) {
	return (
		<ReactFlowProvider>
			<transition.div name='reactflow' className='fixed h-dvh w-full'>
				<CustomReactFlow {...props} />
			</transition.div>
		</ReactFlowProvider>
	)
}

const connectionColor = 'hsl(var(--nextui-foreground))'
const connectionType: ConnectionLineType = ConnectionLineType.Step

const baseEdge: Omit<Edge, 'id' | 'source' | 'target'> = {
	animated: false,
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

export function CustomReactFlow({ snapshot, allowEditing, flowLikes }: ReactFlowCanvasProps) {
	const [nodes, setNodes, onNodesChange] = useNodesState(snapshot.document.nodes ?? [])
	const [edges, setEdges, onEdgesChange] = useEdgesState(snapshot.document.edges ?? [])
	const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null)
	const { screenToFlowPosition } = useReactFlow()

	useEffect(() => {
		if (flowLikes) $flowLikes.set(flowLikes)
	}, [flowLikes])

	const { isEditing, toggleEditing } = useIsEditing()

	const deselectNodes = (nodes: Node[]) => {
		return nodes.map((n) => ({ ...n, selected: false }))
	}

	const onSave = useCallback(async () => {
		if (!rfInstance) return
		toggleEditing()
		setNodes(deselectNodes(nodes))

		const flowObject = rfInstance.toObject()
		flowObject.nodes = deselectNodes(flowObject.nodes)

		await saveSnapshot({
			...snapshot,
			document: flowObject,
		})
	}, [rfInstance, toggleEditing, nodes, setNodes, snapshot])

	const onConnect: OnConnect = useCallback(
		(params) => {
			if (!isEditing) return
			setEdges((eds) => addEdge({ ...baseEdge, ...params }, eds))
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
					data: null,
				}

				return nds.concat(newNode)
			})
		},
		[screenToFlowPosition, isEditing, setNodes]
	)

	return (
		<>
			<ReactFlow
				// eslint-disable-next-line tailwindcss/no-custom-classname
				className='touchdevice-flow'
				fitView
				fitViewOptions={{ padding: 0.2 }}
				nodeOrigin={[0.5, 0]}
				nodes={nodes}
				edges={edges}
				nodesConnectable={isEditing}
				elementsSelectable={isEditing}
				nodesFocusable={isEditing}
				edgesUpdatable={isEditing}
				nodesDraggable={true}
				nodeTypes={nodeTypes}
				connectionLineStyle={baseEdge.style}
				connectionLineType={connectionType}
				zoomOnDoubleClick={false}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
				onInit={setRfInstance}
				onEdgeUpdate={onEdgeUpdate}
				onDoubleClick={createNodeSelector}
			>
				<Controls showInteractive={false} />
				<Background variant={BackgroundVariant.Dots} />

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
