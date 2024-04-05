import { NodeSocial } from '@/components/ReactFlow/NodeSocial'
import { nodeWrapper } from '@/components/ReactFlow/NodeWrapper'
import { useIsEditing } from '@/lib/hooks/useEditing'
import { transition } from '@/lib/transition'
import { Button, Card, CardBody, Input } from '@nextui-org/react'
import { t } from 'astro-i18n'
import { navigate } from 'astro:transitions/client'
import { type ChangeEvent } from 'react'
import { useNodeId, useReactFlow } from 'reactflow'
import type { JobNodeData, NodeData, NodeType } from '../types'

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
        label={t('reactflow.nodes.job.name.label')}
        placeholder={t('reactflow.nodes.job.name.placeholder')}
        onChange={(e) => onFieldChange('name', e)}
        defaultValue={data.name}
      />
      <Input
        size='sm'
        variant='flat'
        label={t('reactflow.nodes.job.company.label')}
        placeholder={t('reactflow.nodes.job.job.placeholder')}
        onChange={(e) => onFieldChange('job', e)}
        defaultValue={data.job}
      />
      <Input
        size='sm'
        variant='flat'
        label={t('reactflow.nodes.job.emoji.label')}
        placeholder={t('reactflow.nodes.job.emoji.placeholder')}
        onChange={(e) => onFieldChange('emoji', e)}
        defaultValue={data.emoji}
      />
    </div>
  )
}

export function JobNodeContent({
  nodeId,
  name,
  job,
  emoji,
  snapshotName,
}: NodeData<NodeType.Job> & { nodeId: string }) {
  return (
    <main className='flex transition-colors'>
      <transition.div
        name={`${snapshotName}-info-emoji-${nodeId}`}
        className='flex size-12 items-center justify-center rounded-full bg-gray-100 text-gray-900'
      >
        {emoji}
      </transition.div>
      <div className='ml-2'>
        <transition.div name={`${snapshotName}-info-name-${nodeId}`} className='text-lg font-bold'>
          {name}
        </transition.div>
        <transition.div name={`${snapshotName}-info-job-${nodeId}`} className='text-foreground-500'>
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
                onClick={async () => await navigate(`/jobs/${id}`)}
                color='primary'
                variant='solid'
                className='m-4'
              >
                {t('reactflow.nodes.job.open_page')}
              </Button>
            </>
          )}
        </CardBody>
      </Card>

      <NodeSocial />
    </>
  )
})
