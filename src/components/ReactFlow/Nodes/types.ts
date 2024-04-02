import type { SnapshotDTO } from '@/lib/db/dto/reactflow.dto'
import type { NodeProps as ReactflowNodeProps } from 'reactflow'

export enum NodeType {
  Job = 'job',
  Timeline = 'timeline',
  Selector = 'selector',
  ReadOnlyFactory = 'readonly-factory',
}

// Types for the different nodes

export type BaseNodeData = {
  snapshotName: SnapshotDTO['name']
}

export type JobNodeData = {
  name: string
  job: string
  emoji: string
}

export type ReadOnlyFactoryData = {
  componentToLoad: string
}

export type NodeDataRecord = {
  [NodeType.Job]: JobNodeData
  [NodeType.ReadOnlyFactory]: ReadOnlyFactoryData
}

// Generic helpers for node wrappers

export type NodeData<T extends NodeType> = T extends keyof NodeDataRecord
  ? BaseNodeData & NodeDataRecord[T]
  : BaseNodeData

export type NodeProps<T extends NodeType> = ReactflowNodeProps<NodeData<T>>

export type WrapperCB<T extends NodeType> = (props: NodeProps<T>) => JSX.Element
