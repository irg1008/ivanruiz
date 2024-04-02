import type { NodeTypes } from 'reactflow'
import { JobNode } from './JobNode'
import { ReadOnlyNodeFactory } from './ReadOnlyNodeFactory'
import { SelectorNode } from './SelectorNode'
import { TimelineNode } from './TimelineNode'
import { NodeType } from './types'

export const nodeTypes: NodeTypes = {
  [NodeType.Job]: JobNode,
  [NodeType.Timeline]: TimelineNode,
  [NodeType.Selector]: SelectorNode,
  [NodeType.ReadOnlyFactory]: ReadOnlyNodeFactory,
}
