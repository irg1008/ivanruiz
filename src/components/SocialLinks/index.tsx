import type { IconType } from '@/components/Icons/Icon'
import { SiBuyMeACoffe } from '@/components/Icons/SiBuyMeACoffe'
import { SiGithub } from '@/components/Icons/SiGithub'
import { SiLinkedIn } from '@/components/Icons/SiLinkedIn'
import { SiX } from '@/components/Icons/SiX'
import { socialLinks } from '@/lib/consts/social.consts'
import { Link, Tooltip } from '@nextui-org/react'
import { ExternalLink } from 'lucide-react'

type Social = {
  name: string
  url: string
  icon: IconType
}

const socials: Social[] = [
  {
    name: 'GitHub',
    url: socialLinks.github,
    icon: SiGithub,
  },
  {
    name: 'LinkedIn',
    url: socialLinks.linkedin,
    icon: SiLinkedIn,
  },
  {
    name: 'X',
    url: socialLinks.x,
    icon: SiX,
  },
  {
    name: 'Buy Me A Coffee',
    url: socialLinks.buyMeACoffee,
    icon: SiBuyMeACoffe,
  },
]

export default function SocialLinks() {
  return (
    <div className='flex gap-4'>
      {socials.map(({ name, url, icon: Icon }) => (
        <Tooltip
          key={name}
          content={
            <span className='flex items-center gap-1'>
              {name} <ExternalLink className='size-3' />
            </span>
          }
          placement='top'
          delay={2000}
        >
          <Link
            isExternal
            href={url}
            color='secondary'
            rel='noopener noreferrer'
            className='text-gray-500 hover:text-gray-700'
          >
            <Icon className='size-6 text-secondary' />
          </Link>
        </Tooltip>
      ))}
    </div>
  )
}
