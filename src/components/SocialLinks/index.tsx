import { socialLinks } from '@/lib/consts/social.consts'
// import {
//   SiBuymeacoffee,
//   SiGithub,
//   SiLinkedin,
//   SiX,
//   type IconType,
// } from '@icons-pack/react-simple-icons'
import { Link, Tooltip } from '@nextui-org/react'
import { ExternalLink } from 'lucide-react'

type Social = {
  name: string
  url: string
  // icon: IconType
}

const socials: Social[] = [
  {
    name: 'GitHub',
    url: socialLinks.github,
    // icon: SiGithub,
  },
  {
    name: 'LinkedIn',
    url: socialLinks.linkedin,
    // icon: SiLinkedin,
  },
  {
    name: 'X',
    url: socialLinks.x,
    // icon: SiX,
  },
  {
    name: 'Buy Me A Coffee',
    url: socialLinks.buyMeACoffee,
    // icon: SiBuymeacoffee,
  },
]

export default function SocialLinks() {
  return (
    <div className='flex gap-4'>
      {socials.map(({ name, url }) => (
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
            {/* <Icon className='size-6 text-secondary' /> */}
          </Link>
        </Tooltip>
      ))}
    </div>
  )
}
