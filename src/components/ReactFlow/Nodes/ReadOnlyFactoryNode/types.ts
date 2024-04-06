import type { ComponentType, LazyExoticComponent } from 'react'

export type AvailableComponent =
  | 'nodeSocial'
  | 'search'
  | 'starProject'
  | 'localeSwitcher'
  | 'siteLinks'
  | 'madeBy'

export type ImportFn = () => LazyExoticComponent<ComponentType>

export type ImportData = {
  import: ImportFn
  label: string
  isSocialComponent?: boolean
}
