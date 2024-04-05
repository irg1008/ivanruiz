import { ErrorBoundary } from '@/components/ErrorBoundary'
import { NodeSocial } from '@/components/ReactFlow/NodeSocial'
import { Card, CardBody, Skeleton } from '@nextui-org/react'
import { Suspense, type PropsWithChildren } from 'react'
import type { ImportData } from './types'

type ComponentWrapperProps = PropsWithChildren<{
  importData: ImportData
}>

export const ComponentWrapper = ({ children, importData }: ComponentWrapperProps) => {
  return (
    <ErrorBoundary>
      <Card className='size-full'>
        <CardBody>
          <Suspense
            fallback={
              <Skeleton>
                <div className='h-24 w-52 rounded-lg bg-default-300'></div>
              </Skeleton>
            }
          >
            {children}
          </Suspense>
        </CardBody>
      </Card>

      {importData.isSocialComponent && <NodeSocial />}
    </ErrorBoundary>
  )
}
