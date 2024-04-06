import { t } from 'astro-i18n'
import { lazy } from 'react'
import type { AvailableComponent, ImportData } from './types'

export const availableComponents: Record<AvailableComponent, ImportData> = {
  nodeSocial: {
    import: () => lazy(() => import('@/components/SocialLinks')),
    label: t('social_links.lable'),
  },
  search: {
    import: () => lazy(() => import('@/components/Search')),
    label: t('search.label'),
  },
  starProject: {
    import: () => lazy(() => import('@/components/StarProject')),
    label: t('star_project.label'),
  },
  localeSwitcher: {
    import: () => lazy(() => import('@/components/LocaleSwitcher')),
    label: t('locale_switcher.label'),
  },
  siteLinks: {
    import: () => lazy(() => import('@/components/SiteLinks')),
    label: t('site_links.label'),
  },
  madeBy: {
    import: () => lazy(() => import('@/components/MadeBy')),
    label: t('made_by.label'),
  },
}

export const isValidComponentToLoad = (key: string): key is AvailableComponent => {
  return Object.keys(availableComponents).includes(key)
}

export const importComponent = (key: string) => {
  return getComponentData(key)?.import?.()
}

export const getComponentData = (key: string) => {
  return isValidComponentToLoad(key) ? availableComponents[key] : null
}
