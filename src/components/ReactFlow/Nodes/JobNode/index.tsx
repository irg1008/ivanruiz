import { CollectionSelect } from '@/components/CollectionSelect'
import { NodeSocial } from '@/components/ReactFlow/NodeSocial'
import { nodeWrapper } from '@/components/ReactFlow/NodeWrapper'
import { useIsEditing } from '@/lib/hooks/useEditing'
import { getCollectionEntry } from '@/lib/services/content.service'
import { transition } from '@/lib/transition'
import { Avatar, Button, Card, CardBody } from '@nextui-org/react'
import { l, t } from 'astro-i18n'
import type { CollectionEntry } from 'astro:content'
import { navigate } from 'astro:transitions/client'
import { BriefcaseIcon, ChevronRightIcon } from 'lucide-react'
import { memo, useEffect, useState } from 'react'
import type { NodeData, NodeType } from '../types'

export const JobNode = nodeWrapper<NodeType.Job>(({ data }) => {
  const { isEditing } = useIsEditing()

  return (
    <>
      <Card className='size-full'>
        <CardBody className='p-4'>
          {isEditing ? (
            <JobNodeEditing {...data} />
          ) : (
            <>
              <JobNodeContent {...data} />
              <Button
                onClick={async () => await navigate(l(`/jobs/${data.slug}`))}
                color='primary'
                variant='flat'
                className='mt-6 self-end'
                endContent={<ChevronRightIcon className='size-4' />}
              >
                {t('reactflow.nodes.job.job_cta')}
              </Button>
            </>
          )}
        </CardBody>
      </Card>

      <NodeSocial />
    </>
  )
})

export function JobNodeEditing(data: NodeData<NodeType.Job>) {
  return (
    <CollectionSelect
      collection='jobs'
      icon={BriefcaseIcon}
      select={{
        placeholder: t('reactflow.nodes.job.choose_job'),
        label: t('reactflow.nodes.job.select_label'),
      }}
      image={(data) =>
        data.companyLogo && (
          <Avatar alt={data.companyLogo.alt} src={data.companyLogo.src} className='*:h-auto' />
        )
      }
      initialSlug={data.slug}
    />
  )
}

export const JobNodeContent = memo(({ slug }: NodeData<NodeType.Job>) => {
  const [job, setJob] = useState<CollectionEntry<'jobs'>>()

  useEffect(() => {
    if (!slug) return

    const fetchJob = async () => {
      const job = await getCollectionEntry('jobs', slug)
      if (job) setJob(job)
    }

    fetchJob()
  }, [slug])

  if (!job) return

  const { data } = job

  return (
    <transition.main name={`${slug}-job`} className='flex gap-2'>
      {data.companyLogo ? (
        <Avatar
          isBordered
          alt={data.companyLogo.alt}
          src={data.companyLogo.src}
          className='size-full *:h-auto'
        />
      ) : (
        <Avatar isBordered name={data.company} />
      )}
      <div className='ml-2'>
        <transition.div name={`${slug}-job-company`} className='text-lg font-bold'>
          {job.data.company}
        </transition.div>
        <transition.div name={`${slug}-job-position`} className='text-foreground-500'>
          {job.data.position}
        </transition.div>

        <transition.div name={`${slug}-job-location`} className='text-foreground-300'>
          {job.data.location}
        </transition.div>
      </div>
    </transition.main>
  )
})
