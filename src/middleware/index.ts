import { useAstroI18n as AstroI18n } from 'astro-i18n'
import astroI18nConfig from 'astro-i18n.config'
import { sequence } from 'astro/middleware'

const astroI18n = AstroI18n(astroI18nConfig, undefined /* custom formatters */)

export const onRequest = sequence(astroI18n)
