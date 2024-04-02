import dagre from 'dagre'
import { Position, type Edge, type Node, type ReactFlowJsonObject } from 'reactflow'

const dagreGraph = new dagre.graphlib.Graph()
dagreGraph.setDefaultEdgeLabel(() => ({}))

type Direction = 'TB' | 'LR'

type LayoutOptions = {
  direction: Direction
  distanceScale: number
}

export const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  options: LayoutOptions
): Pick<ReactFlowJsonObject, 'edges' | 'nodes'> => {
  const { direction, distanceScale } = options

  dagreGraph.setGraph({ rankdir: direction })

  nodes.forEach((node) => {
    const { id, width, height } = node
    dagreGraph.setNode(id, { width, height })
  })

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target)
  })

  dagre.layout(dagreGraph)

  const isHorizontal = direction === 'LR'
  const targetPosition = isHorizontal ? Position.Left : Position.Top
  const sourcePosition = isHorizontal ? Position.Right : Position.Bottom

  nodes.forEach((node) => {
    const { x, y } = dagreGraph.node(node.id)

    node.targetPosition = targetPosition
    node.sourcePosition = sourcePosition
    node.position.x = x * distanceScale
    node.position.y = y * distanceScale
  })

  return { nodes, edges }
}

export const getLayoutedFlow = (
  flowObject: ReactFlowJsonObject,
  options: LayoutOptions
): ReactFlowJsonObject => {
  const { nodes, edges } = flowObject
  return { ...flowObject, ...getLayoutedElements(nodes, edges, options) }
}
