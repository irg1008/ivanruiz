import type { ComponentType, LazyExoticComponent } from 'react'

export type AvailableComponent =
  | 'nodeSocial'
  | 'search'
  | 'starProject'
  | 'localeSwitcher'
  | 'siteLinks'

export type ImportFn = () => LazyExoticComponent<ComponentType>

export type ImportData = {
  import: ImportFn
  label: string
  isSocialComponent?: boolean
}
