import dagre, { type GraphLabel } from 'dagre'
import { Position, type Edge, type Node, type ReactFlowJsonObject } from 'reactflow'

export type Direction = 'TB' | 'LR' | 'BT' | 'RL'

export type Align = 'UL' | 'UR' | 'DL' | 'DR'

type LayoutOptions = {
  direction?: Direction
  align?: Align
  width?: number
  height?: number
}

const dagreGraph = new dagre.graphlib.Graph()
dagreGraph.setDefaultEdgeLabel(() => ({}))

const config: GraphLabel = {
  nodesep: 100,
  edgesep: 40,
  ranksep: 200,
  ranker: 'longest-path',
}

export const getDagreLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  { direction = 'TB', align = 'UR', width = 0, height = 0 }: LayoutOptions = {}
): Pick<ReactFlowJsonObject, 'edges' | 'nodes'> => {
  dagreGraph.setGraph({
    ...config,
    rankdir: direction,
    align,
    width,
    height,
  })

  edges.forEach((edge) => dagreGraph.setEdge(edge.source, edge.target))
  nodes.forEach((node) => dagreGraph.setNode(node.id, node))

  dagre.layout(dagreGraph)

  const isHorizontal = direction === 'LR'
  const targetPosition = isHorizontal ? Position.Left : Position.Top
  const sourcePosition = isHorizontal ? Position.Right : Position.Bottom

  return {
    nodes: nodes.map((node) => {
      const { x, y } = dagreGraph.node(node.id)
      return {
        ...node,
        targetPosition,
        sourcePosition,
        position: {
          x,
          y,
        },
      }
    }),
    edges,
  }
}

export const getDagreLayoutedFlow = (
  flowObject: ReactFlowJsonObject,
  options: LayoutOptions
): ReactFlowJsonObject => {
  const { nodes, edges } = flowObject
  return { ...flowObject, ...getDagreLayoutedElements(nodes, edges, options) }
}
