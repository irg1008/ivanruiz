import { NodeResizer as BaseNodeResizer } from 'reactflow'

export function NodeResizer({ isVisible }: { isVisible: boolean }) {
  return (
    <BaseNodeResizer
      isVisible={isVisible}
      color='currentColor'
      lineClassName='text-yellow-400'
      handleClassName='text-yellow-400 !size-2'
      minWidth={100}
      minHeight={30}
    />
  )
}
