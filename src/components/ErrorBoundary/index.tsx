import { Chip, Image } from '@nextui-org/react'
import { TriangleAlertIcon } from 'lucide-react'
import type { PropsWithChildren } from 'react'
import { ErrorBoundary as ReactErrorboundary } from 'react-error-boundary'

export type ErrorBoundaryProps = PropsWithChildren<{
  fallbackText?: string
}>

function ErrorFallback() {
  return (
    <div className='flex flex-col items-center justify-center gap-2'>
      <Image
        src='/imgs/gifs/shiiiet.webp'
        alt='Error loading component'
        width={200}
        height={200}
        isZoomed
      />
      <Chip
        startContent={<TriangleAlertIcon className='size-4' />}
        variant='shadow'
        color='danger'
        className='flex items-center gap-1'
      >
        Error loading component
      </Chip>
    </div>
  )
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  return <ReactErrorboundary FallbackComponent={ErrorFallback}>{children}</ReactErrorboundary>
}
