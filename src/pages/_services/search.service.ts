import type { SnapshotName } from '@/components/ReactFlow/types'
import { xata } from '@/lib/db'
import type { FlowDTO } from '@/lib/db/dto/reactflow.dto'
import type { Node } from '@/lib/db/xata'
import { getDagreLayoutedFlow } from '@/lib/utils/layout.utils'
import type { Edge as FlowEdge, Node as FlowNode, ReactFlowJsonObject } from 'reactflow'
import { getLikesCountForIds } from './reactflow.service'

const findHighlightNodes = ({ nodes }: ReactFlowJsonObject, highlight: string) => {
  const nodesString = JSON.stringify(nodes)

  // Create node positon accessor
  const nodePositions = new Map<number, Node['id']>()
  nodes
    .map((node) => node.id)
    .forEach((nodeId) => {
      const position = nodesString.indexOf(nodeId)
      nodePositions.set(position, nodeId)
    })

  // Isolate search term
  const searchTerm = highlight.match(/<em>(.*?)<\/em>/)?.at(1)
  const searchTermMatches = nodesString.matchAll(new RegExp(searchTerm!, 'g'))
  const searchPositions = Array.from(searchTermMatches).map((match) => match.index)

  // Find the node closest to the search term
  const positionsArray = Array.from(nodePositions.keys())
  const searchNodeIds = searchPositions.map((position) => {
    const closestPosition = positionsArray.findLast((pos) => pos < position!)
    return nodePositions.get(closestPosition!)
  })

  return nodes.filter((node) => searchNodeIds.includes(node.id))
}

export const createSearchFlowObject = async (query: string): Promise<ReactFlowJsonObject> => {
  const skippedSnapshots: SnapshotName[] = ['footer']

  const res = await xata.db.Snapshot.search(query, {
    target: ['name', 'document'],
    highlight: {
      enabled: true,
      encodeHTML: false,
    },
    fuzziness: 2,
    filter: {
      $not: { name: { $any: skippedSnapshots } },
    },
    prefix: 'disabled',
  })

  const searchNodes: FlowNode[] = []
  const searchEdges: FlowEdge[] = []
  for (const { document, xata } of res.records) {
    const docHighlight: string = xata.highlight?.['document']?.at(0)
    if (!docHighlight) continue

    const nodes = findHighlightNodes(document, docHighlight)
    searchNodes.push(...nodes)
    searchEdges.push(...document.edges)
  }

  return {
    nodes: searchNodes,
    edges: searchEdges,
    viewport: {
      x: 0,
      y: 0,
      zoom: 1,
    },
  }
}

export const searchMe = async (query: string): Promise<FlowDTO> => {
  const flowObject = await createSearchFlowObject(query)
  const likes = await getLikesCountForIds(flowObject.nodes.map((node) => node.id))
  const layoutedFlowObject = getDagreLayoutedFlow(flowObject, { direction: 'TB' })
  return { likes, flowObject: layoutedFlowObject }
}
