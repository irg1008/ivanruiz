import { NodeResizer as BaseNodeResizer } from 'reactflow'

export function NodeResizer({ isVisible }: { isVisible: boolean }) {
  return <BaseNodeResizer isVisible={isVisible} color='#fff000' minWidth={100} minHeight={30} />
}
