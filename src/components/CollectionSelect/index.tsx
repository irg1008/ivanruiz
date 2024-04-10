import {
  addLocaleToSlug,
  getCollection,
  removeLocaleFromSlug,
} from '@/lib/services/content.service'
import { Select, SelectItem } from '@nextui-org/react'
import type { CollectionEntry, ContentCollectionKey } from 'astro:content'
import { type LucideIcon } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { useNodeId, useReactFlow } from 'reactflow'

type CollectionSelectProps<C extends ContentCollectionKey> = {
  collection: C
  icon: LucideIcon
  initialSlug?: string
  select: {
    placeholder: string
    label: string
  }
  image?: (data: CollectionEntry<C>['data']) => ReactNode
}

export function CollectionSelect<C extends ContentCollectionKey>({
  collection,
  icon: Icon,
  image,
  initialSlug,
  select: { placeholder, label },
}: CollectionSelectProps<C>) {
  const reactflow = useReactFlow()
  const nodeId = useNodeId()
  const node = reactflow.getNode(nodeId!)

  const [entries, setEntries] = useState<CollectionEntry<C>[]>()
  const [slug, setSlug] = useState(initialSlug ? addLocaleToSlug(initialSlug) : '')

  useEffect(() => {
    const fetchJobs = async () => {
      const entries = await getCollection(collection)
      if (entries) setEntries(entries)
    }

    fetchJobs()
  }, [collection])

  const updateNodeSlug = (slug: string) => {
    setSlug(slug)

    if (!node) return

    node.data.slug = removeLocaleFromSlug(slug)
    node.data.searchMeta = entries?.find((entry) => entry.slug === slug)

    reactflow.setNodes((nodes) => {
      const index = nodes.indexOf(node)
      nodes[index] = node
      return nodes
    })
  }

  return (
    entries && (
      <div className='flex flex-col gap-2'>
        <Select
          label={label}
          placeholder={placeholder}
          startContent={<Icon />}
          selectedKeys={[slug]}
          isRequired
          className='min-w-56'
          onChange={(e) => updateNodeSlug(e.target.value)}
        >
          {entries.map(({ data, slug }) => (
            <SelectItem key={slug} textValue={data.title} value={slug} startContent={image?.(data)}>
              {data.title}
            </SelectItem>
          ))}
        </Select>
      </div>
    )
  )
}
