import dagre from 'dagre'
import { Position, type Edge, type Node, type ReactFlowJsonObject } from 'reactflow'

const dagreGraph = new dagre.graphlib.Graph()
dagreGraph.setDefaultEdgeLabel(() => ({}))

export type Direction = 'TB' | 'LR'

type LayoutOptions = {
  direction: Direction
  distanceScale: {
    x: number
    y: number
  }
}

export const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  options: LayoutOptions
): Pick<ReactFlowJsonObject, 'edges' | 'nodes'> => {
  const { direction, distanceScale } = options

  // TODO: Change settings so the generated layout is more vertical in vertical mode or has less distance between nodes.
  // Bst way is to make nodes horizontally aligned with different parent node, to move slighly vertical. This way gives the feeling of bein in differnet steps
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
    const { x, width, y, height } = dagreGraph.node(node.id)

    node.targetPosition = targetPosition
    node.sourcePosition = sourcePosition
    node.position.x = (x - width / 2) * distanceScale.x
    node.position.y = (y - height / 2) * distanceScale.y
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
