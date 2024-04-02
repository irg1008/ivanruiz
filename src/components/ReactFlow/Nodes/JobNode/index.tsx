import { NodeSocial } from '@/components/ReactFlow/NodeSocial'
import { nodeWrapper } from '@/components/ReactFlow/NodeWrapper'
import { useIsEditing } from '@/lib/stores/reactflow.store'
import { transition } from '@/lib/transition'
import { Button, Card, CardBody, Input } from '@nextui-org/react'
import { navigate } from 'astro:transitions/client'
import { type ChangeEvent } from 'react'
import { useNodeId, useReactFlow } from 'reactflow'
import type { JobNodeData, NodeType } from '../types'

export function JobNodeEditing(data: JobNodeData) {
  const nodeId = useNodeId()
  const reactflow = useReactFlow()

  const node = nodeId === null ? null : reactflow.getNode(nodeId)

  const onFieldChange = (field: keyof JobNodeData, e: ChangeEvent<HTMLInputElement>) => {
    if (!node) return
    node.data[field] = e.target.value

    reactflow.setNodes((nodes) => {
      const index = nodes.indexOf(node)
      nodes[index] = node
      return nodes
    })
  }

  return (
    <div className='flex flex-col gap-2'>
      <Input
        size='sm'
        variant='flat'
        label='Name'
        onChange={(e) => onFieldChange('name', e)}
        defaultValue={data.name}
      />
      <Input
        size='sm'
        variant='flat'
        label='Job'
        onChange={(e) => onFieldChange('job', e)}
        defaultValue={data.job}
      />
      <Input
        size='sm'
        variant='flat'
        label='Emoji'
        onChange={(e) => onFieldChange('emoji', e)}
        defaultValue={data.emoji}
      />
    </div>
  )
}

export function JobNodeContent({ nodeId, name, job, emoji }: JobNodeData & { nodeId: string }) {
  return (
    <main className='flex transition-colors'>
      <transition.div
        name={`info-emoji-${nodeId}`}
        className='flex size-12 items-center justify-center rounded-full bg-gray-100 text-gray-900'
      >
        {emoji}
      </transition.div>
      <div className='ml-2'>
        <transition.div name={`info-name-${nodeId}`} className='text-lg font-bold'>
          {name}
        </transition.div>
        <transition.div name={`info-job-${nodeId}`} className='text-foreground-500'>
          {job}
        </transition.div>
      </div>
    </main>
  )
}

export const JobNode = nodeWrapper<NodeType.Job>((props) => {
  const { data, id } = props
  const { isEditing } = useIsEditing()

  return (
    <>
      <Card className='size-full'>
        <CardBody>
          {isEditing ? (
            <JobNodeEditing {...data} />
          ) : (
            <>
              <JobNodeContent {...data} nodeId={id} />
              <Button
                onClick={async () => await navigate(`/job/${id}`)}
                color='primary'
                variant='solid'
                className='m-4'
              >
                Open page
              </Button>
            </>
          )}
        </CardBody>
      </Card>

      <NodeSocial />
    </>
  )
})
