import { SiGithub } from '@/components/Icons/SiGithub'
import { getMyGithubStars, type StarsInfo } from '@/lib/services/github.service'
import { Chip, Link, Skeleton } from '@nextui-org/react'
import { t } from 'astro-i18n'
import { StarIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function StarProject() {
  const [stars, setStars] = useState<StarsInfo | null>(null)

  useEffect(() => {
    getMyGithubStars().then(setStars)
  }, [])

  return stars ? (
    <Link href={stars.projectUrl} color='foreground' isExternal className='flex gap-2 capitalize'>
      <SiGithub className='size-5' />
      {t('star')}
      <Chip
        size='sm'
        variant='shadow'
        className='flex items-center gap-px'
        radius='sm'
        startContent={<StarIcon className='size-3 dark:text-yellow-300' />}
      >
        {stars.starCount}
      </Chip>
    </Link>
  ) : (
    <Skeleton>
      <div className='h-10 w-20 rounded-lg bg-default-300'></div>
    </Skeleton>
  )
}
