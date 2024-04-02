import { getMyGithubStars, type StarsInfo } from '@/lib/services/github.service'
import { SiGithub } from '@icons-pack/react-simple-icons'
import { Chip, Link } from '@nextui-org/react'
import { StarIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function StarProject() {
  const [stars, setStars] = useState<StarsInfo | null>(null)

  useEffect(() => {
    getMyGithubStars().then(setStars)
  }, [])

  return (
    stars && (
      <Link href={stars.projectUrl} color='foreground' isExternal className='flex gap-2'>
        <SiGithub className='size-5' />
        Star
        <Chip
          size='sm'
          variant='shadow'
          className='flex items-center gap-px'
          radius='sm'
          startContent={<StarIcon className='size-3 text-yellow-300' />}
        >
          {stars.starCount}
        </Chip>
      </Link>
    )
  )
}
