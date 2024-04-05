import type { NodeTypes } from 'reactflow'
import { JobNode } from './JobNode'
import { ReadOnlyFactoryNode } from './ReadOnlyFactoryNode'
import { SelectorNode } from './SelectorNode'
import { NodeType } from './types'

export const nodeTypes: NodeTypes = {
  [NodeType.Job]: JobNode,
  [NodeType.Selector]: SelectorNode,
  [NodeType.ReadOnlyFactory]: ReadOnlyFactoryNode,
}
