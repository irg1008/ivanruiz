import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react'
import { astroI18n, l, t } from 'astro-i18n'
import type { ReactNode } from 'react'

const routeIcons: Record<Locale, ReactNode> = {
  en: '💂',
  es: '💃',
}

export default function LocaleSwitcher() {
  const { locale, locales, route } = astroI18n
  const params = Object.fromEntries(new URLSearchParams(location.search).entries())

  return (
    <Dropdown backdrop='opaque'>
      <DropdownTrigger>
        <Button
          startContent={<span>{routeIcons[locale]}</span>}
          variant='faded'
          className='uppercase'
        >
          {locale}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        variant='flat'
        aria-label={t('locale_switcher.description')}
        disallowEmptySelection
        selectionMode='single'
        selectedKeys={[locale]}
        disabledKeys={[locale]}
      >
        {locales.map((locale) => (
          <DropdownItem
            key={locale}
            className='capitalize'
            startContent={routeIcons[locale]}
            href={l(route, params, { targetLocale: locale })}
          >
            {t(`locale_switcher.locales.${locale}`)}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  )
}
