import { Listbox, ListboxItem, ListboxSection } from '@nextui-org/react'
import { t } from 'astro-i18n'
import { BriefcaseIcon, GraduationCapIcon, SpeechIcon, type LucideIcon } from 'lucide-react'

type SiteLink = {
  href: Route
  label: string
  description?: string
  icon?: LucideIcon
}

const siteLinks: SiteLink[] = [
  {
    href: '/jobs',
    label: t('site_links.jobs.label'),
    description: t('site_links.jobs.description'),
    icon: BriefcaseIcon,
  },
  {
    href: '/education',
    label: t('site_links.education.label'),
    description: t('site_links.education.description'),
    icon: GraduationCapIcon,
  },
  {
    href: '/events',
    label: t('site_links.events.label'),
    description: t('site_links.events.description'),
    icon: SpeechIcon,
  },
]

export default function SiteLinks() {
  return (
    <Listbox>
      <ListboxSection title={t('site_links.label')}>
        {siteLinks.map(({ href, icon: Icon, label, description }) => (
          <ListboxItem
            key={label}
            href={href}
            startContent={Icon && <Icon className='size-5' />}
            description={description}
          >
            {label}
          </ListboxItem>
        ))}
      </ListboxSection>
    </Listbox>
  )
}
