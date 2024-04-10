import { CollectionSelect } from '@/components/CollectionSelect'
import { useIsEditing } from '@/lib/hooks/useEditing'
import { getCollectionEntry } from '@/lib/services/content.service'
import { transition } from '@/lib/transition'
import { Avatar, Button, Card, CardBody, Image } from '@nextui-org/react'
import { l, t } from 'astro-i18n'
import type { CollectionEntry } from 'astro:content'
import { navigate } from 'astro:transitions/client'
import { ChevronRightIcon, FolderGit2Icon } from 'lucide-react'
import { memo, useEffect, useState } from 'react'
import { NodeSocial } from '../../NodeSocial'
import { nodeWrapper } from '../../NodeWrapper'
import type { NodeData, NodeType } from '../types'

export const ProjectNode = nodeWrapper<NodeType.Project>(({ data }) => {
  const { isEditing } = useIsEditing()

  return (
    <>
      {isEditing ? <ProjectNodeEditing {...data} /> : <ProjectNodeContent {...data} />}
      <NodeSocial />
    </>
  )
})

export function ProjectNodeEditing(data: NodeData<NodeType.Project>) {
  return (
    <Card className='size-full'>
      <CardBody>
        <CollectionSelect
          collection='projects'
          icon={FolderGit2Icon}
          select={{
            placeholder: t('reactflow.nodes.project.choose_project'),
            label: t('reactflow.nodes.project.select_label'),
          }}
          image={(data) =>
            data.cover && <Avatar alt={data.cover.alt} src={data.cover.src} className='*:h-auto' />
          }
          initialSlug={data.slug}
        />
      </CardBody>
    </Card>
  )
}

export const ProjectNodeContent = memo(({ slug }: NodeData<NodeType.Project>) => {
  const [project, setProject] = useState<CollectionEntry<'projects'>>()

  useEffect(() => {
    if (!slug) return

    const fetchProject = async () => {
      const project = await getCollectionEntry('projects', slug)
      if (project) setProject(project)
    }

    fetchProject()
  }, [slug])

  if (!project) return

  const { data } = project

  return (
    <transition.main name={`${slug}-project`}>
      <Card isFooterBlurred>
        <CardBody className='p-2'>
          {data.cover && (
            <Image
              isBlurred
              alt={data.cover.alt}
              src={data.cover.src}
              className='aspect-video rounded-xl object-fill object-left-top'
              width={300}
            />
          )}
          <div className='flex flex-col p-2'>
            <transition.div name={`${slug}-project-title`} className='text-lg font-bold'>
              {project.data.title}
            </transition.div>
            <transition.p
              name={`${slug}-project-description`}
              className='line-clamp-2 max-w-prose text-sm text-foreground-500'
            >
              {project.data.description}
            </transition.p>

            <Button
              onClick={async () => await navigate(l(`/projects/${slug}`))}
              color='secondary'
              variant='flat'
              className='mt-6 self-end'
              endContent={<ChevronRightIcon className='size-4' />}
            >
              {t('reactflow.nodes.project.project_cta')}
            </Button>
          </div>
        </CardBody>
      </Card>
    </transition.main>
  )
})
