import { FlowCanvasProvider, type FlowCanvasProviderProps } from '@/lib/contexts/FlowCanvas.context'
import { transition } from '@/lib/transition'
import { cn } from '@/lib/utils/cn'
import { memo } from 'react'
import { ReactFlowProvider } from 'reactflow'
import 'reactflow/dist/style.css'
import { FlowCanvas, type FlowCanvasProps } from './FlowCanvas'

export type ReactFlowProps = FlowCanvasProps &
  FlowCanvasProviderProps & {
    className?: string
  }

const isSameCanvas = (prev: ReactFlowProps, next: ReactFlowProps) => {
  return prev.snapshot.name === next.snapshot.name
}

export const ReactFlow = memo(({ className, ...props }: ReactFlowProps) => {
  return (
    <ReactFlowProvider>
      <FlowCanvasProvider {...props}>
        <transition.div name='reactflow' className={cn('size-full', className)}>
          <FlowCanvas {...props} />
        </transition.div>
      </FlowCanvasProvider>
    </ReactFlowProvider>
  )
}, isSameCanvas)

ReactFlow.displayName = 'ReactFlowCanvas'
