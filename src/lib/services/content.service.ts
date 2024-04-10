import { astroI18n } from 'astro-i18n'
import type { CollectionEntry, ContentCollectionKey, ValidContentEntrySlug } from 'astro:content'

const getLocaleParams = () => {
  return new URLSearchParams({ locale: astroI18n.locale })
}

export const removeLocaleFromSlug = (slug: string) => {
  return slug.split('/').slice(1).join('/')
}

export const addLocaleToSlug = (slug: string) => {
  return `${astroI18n.locale}/${slug}`
}

export const getCollection = async <C extends ContentCollectionKey>(
  collection: C
): Promise<CollectionEntry<C>[]> => {
  const response = await fetch(`/api/collection/${collection}` + '?' + getLocaleParams())
  return response.json()
}

export const getCollectionEntry = async <C extends ContentCollectionKey>(
  collection: C,
  slug: ValidContentEntrySlug<C>
): Promise<CollectionEntry<C>> => {
  const response = await fetch(`/api/collection/${collection}/${slug}` + '?' + getLocaleParams())
  return response.json()
}
