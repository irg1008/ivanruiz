import translations from '@/i18n/translations.json'
import { defineAstroI18nConfig } from 'astro-i18n'

export default defineAstroI18nConfig({
  primaryLocale: 'en', // default app locale
  secondaryLocales: ['es'], // other supported locales
  fallbackLocale: 'en', // fallback locale (on missing translation)
  trailingSlash: 'never', // "never" or "always"
  run: 'client+server', // "client+server" or "server"
  showPrimaryLocale: false, // "/en/about" vs "/about"
  translationLoadingRules: [], // per page group loading
  translationDirectory: {}, // translation directory names - doesn't work with serverless
  translations, // { [translation_group1]: { [locale1]: {}, ... } }
  routes: {
    es: {
      jobs: 'trabajos',
      education: 'educacion',
      events: 'eventos',
      projects: 'proyectos',
    },
  }, // { [secondary_locale1]: { about: "about-translated", ... } }
})
