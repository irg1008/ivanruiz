import { useCallback } from 'react'
import ReactFlow, {
	Background,
	BackgroundVariant,
	Controls,
	MiniMap,
	ReactFlowProvider,
	addEdge,
	useEdgesState,
	useNodesState,
	type Connection,
	type Edge,
	type Node,
} from 'reactflow'

import 'reactflow/dist/style.css'
import './style.module.css'

const initialNodes: Node[] = [
	{ id: '1', position: { x: 0, y: 50 }, data: { label: '1' } },
	{ id: '2', position: { x: 0, y: 200 }, data: { label: '2' } },
]
const initialEdges: Edge[] = [{ id: 'e1-2', source: '1', target: '2', animated: true }]

export function ReactFlowCanvas() {
	const [nodes, _, onNodesChange] = useNodesState(initialNodes)
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

	const onConnect = useCallback(
		(params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
		[setEdges]
	)

	return (
		<div className='h-screen w-screen'>
			<ReactFlowProvider>
				<ReactFlow
					fitView
					nodes={nodes}
					edges={edges}
					onNodesChange={onNodesChange}
					onEdgesChange={onEdgesChange}
					onConnect={onConnect}
				>
					<MiniMap />
					<Controls />
					<Background variant={BackgroundVariant.Dots} />
				</ReactFlow>
			</ReactFlowProvider>
		</div>
	)
}
