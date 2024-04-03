/// <reference types="astro/client" />

type Runtime = import('@astrojs/cloudflare').Runtime<Env>

interface ImportMetaEnv {
  readonly XATA_API_KEY: string
  readonly XATA_BRANCH: string
  readonly API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare namespace App {
  interface Locals extends Runtime {}
}
