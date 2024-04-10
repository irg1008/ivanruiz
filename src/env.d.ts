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

/* eslint-disable */


// ###> astro-i18n/type-generation ###
type PrimaryLocale = "en"
type SecondaryLocale = "es"
type Locale = PrimaryLocale | SecondaryLocale
type RouteParameters = {"/":undefined;"/jobs":undefined;"/education":undefined;"/events":undefined;"/404":undefined;"/admin/[key]":{"key":unknown;};"/jobs/[slug]":{"slug":unknown;};"/projects/[slug]":{"slug":unknown;};}
type Route = keyof RouteParameters
type TranslationVariables = {"404.meta_title":{"path"?:unknown;}|undefined;"404.title":{"path"?:unknown;}|undefined;"404.home_action":object|undefined;"name":object|undefined;"full_name":object|undefined;"location_country":object|undefined;"name_dotted":object|undefined;"title_name.drag_me":object|undefined;"title_name.img_alt":object|undefined;"star_project.label":object|undefined;"star_project.star":object|undefined;"social_links.lable":object|undefined;"site_links.label":object|undefined;"site_links.jobs.label":object|undefined;"site_links.jobs.description":object|undefined;"site_links.education.label":object|undefined;"site_links.education.description":object|undefined;"site_links.events.label":object|undefined;"site_links.events.description":object|undefined;"made_by.label":object|undefined;"made_by.description":object|undefined;"locale_switcher.description":object|undefined;"locale_switcher.label":object|undefined;"locale_switcher.locales.en":object|undefined;"locale_switcher.locales.es":object|undefined;"hero.about_me.description":object|undefined;"hero.links.jobs":object|undefined;"hero.links.education":object|undefined;"hero.links.events":object|undefined;"search.label":object|undefined;"search.placeholder":object|undefined;"search.no_results":object|undefined;"search.results":object|undefined;"search.searching":object|undefined;"search.close_modal":object|undefined;"errors.loading_component":object|undefined;"reactflow.hint.title":object|undefined;"reactflow.hint.description":object|undefined;"reactflow.hint.dismiss_text":object|undefined;"reactflow.toolbar.toggle_vertical_fit":object|undefined;"reactflow.toolbar.toggle_horizontal_fit":object|undefined;"reactflow.toolbar.delete_node":object|undefined;"reactflow.node_social.give_like":{"emoji"?:unknown;}|undefined;"reactflow.save":object|undefined;"reactflow.edit":object|undefined;"reactflow.exit":object|undefined;"reactflow.nodes.selector.label":object|undefined;"reactflow.nodes.selector.choose_node":object|undefined;"reactflow.nodes.job.label":object|undefined;"reactflow.nodes.job.select_label":object|undefined;"reactflow.nodes.job.job_cta":object|undefined;"reactflow.nodes.job.choose_job":object|undefined;"reactflow.nodes.project.label":object|undefined;"reactflow.nodes.project.select_label":object|undefined;"reactflow.nodes.project.project_cta":object|undefined;"reactflow.nodes.project.choose_project":object|undefined;"reactflow.nodes.read_only_factory.label":object|undefined;"reactflow.nodes.read_only_factory.choose_component":object|undefined;"meta_title":object|undefined;"meta_description":object|undefined;}
type Translation = keyof TranslationVariables
type Environment = "none"|"node"|"browser"
declare module "astro-i18n" {
	type GetStaticPathsProps = {paginate:Function;rss:Function}
	type GetStaticPathsItem = {params:Record<string,number|string|undefined>;props?:Record<string,unknown>}
	type DeepStringRecord = {[key: string]:string|DeepStringRecord}
	type TranslationDirectory = {i18n?:string;pages?: string}
	export type Translations = {[group: string]:{[locale: string]: DeepStringRecord}}
	export type TranslationFormatters = {[formatterName: string]:(value:unknown,...args:unknown[])=>unknown}
	export type TranslationLoadingRules = {groups:string[];routes: string[]}[]
	export type SegmentTranslations = {[secondaryLocale: string]:{[segment: string]:string}}
	export interface AstroI18nConfig {primaryLocale:string;secondaryLocales:string[];fallbackLocale:string;showPrimaryLocale:boolean;trailingSlash:"always"|"never";run:"server"|"client+server";translations:Translations;translationLoadingRules:TranslationLoadingRules;translationDirectory:TranslationDirectory;routes:SegmentTranslations;srcDir:string;}
	/** Typed astro-i18n config definition. */
	export function defineAstroI18nConfig(config: Partial<AstroI18nConfig>): Partial<AstroI18nConfig>
	/** The `astro-i18n` middleware. */
	export function useAstroI18n(
		config?: Partial<AstroI18nConfig> | string,
		formatters?: TranslationFormatters,
	): (...args: any[]) => any
	/** Workaround function to make astroI18n work inside getStaticPaths. This is because Astro's getStaticPaths runs before everything which doesn't allows astroI18n to update its state automatically. */
	function createGetStaticPaths(
		callback: (
			props: GetStaticPathsProps,
		) => GetStaticPathsItem[] | Promise<GetStaticPathsItem[]>,
	): (props: GetStaticPathsProps & {
		astroI18n?: {
			locale: string;
		};
	}) => Promise<GetStaticPathsItem[]>
	/**
	 * @param key The translation key, for example `"my.nested.translation.key"`.
	 * @param properties An object containing your interpolation variables and/or your variants, for example `{ variant: 3, interpolation: "text" }`.
	 * @param options `route`: Overrides the current route, you will be able to access that route's translations. `locale`: Overrides the current locale, this allows you to control which language you want to translate to. `fallbackLocale`: Overrides the fallback locale.
	 */
	export function t<T extends Translation>(
		key: T | string & {},
		...args: undefined extends TranslationVariables[T]
			? [
				properties?: keyof TranslationVariables extends T 
					? Record<string, unknown> 
					: TranslationVariables[T], 
				options?: {
					route?: Route | string & {}
					locale?: Locale | string & {}
					fallbackLocale?: Locale | string & {}
				}
			]
			: [
				properties: TranslationVariables[T], 
				options?: {
					route?: Route | string & {}
					locale?: Locale | string & {}
					fallbackLocale?: Locale | string & {}
				}
			]
	): string
	/**
	 * @param route A route in any of the configured languages, for example `"/en/my/english/route/[param]"`.
	 * @param parameters An object containing your route parameters, for example `{ slug: "my-blog-post-slug" }`.
	 * @param options `targetLocale`: Overrides the target locale. `routeLocale`: Overrides the given route locale, this is useful if astro-i18n cannot figure out the route's locale. `showPrimaryLocale`: Overrides the showPrimaryLocale parameter. `query`: Adds these query parameters at the end of the translated route.
	 */
	export function l<T extends Route>(
		route: T | string & {},
		...args: T extends keyof RouteParameters
			? undefined extends RouteParameters[T]
				? [
					parameters?: Record<string, string>, 
					options?: { 
						targetLocale?: string, 
						routeLocale?: string,
						showPrimaryLocale?: string,
						query?: Record<string, unknown>
					}
				]
				: [
					parameters: RouteParameters[T], 
					options?: { 
						targetLocale?: string, 
						routeLocale?: string,
						showPrimaryLocale?: string,
						query?: Record<string, unknown>
					}
				]
			: [
				parameters?: Record<string, string>, 
				options?: { 
					targetLocale?: string, 
					routeLocale?: string,
					showPrimaryLocale?: string,
					query?: Record<string, unknown>
				}
			]
	): string
	class AstroI18n {
		/** The detected runtime environment. */
		environment: Environment
		/** The current page route. */
		route: string
		/** All page routes. For example: `["/", "/about", "/posts/[slug]"]` */
		pages: string[]
		/** The equivalent page for the current route. For example if route is equal to `"/posts/my-cool-cat"` this could return `"/posts/[slug]"`. */
		page: string
		/** The current page locale. */
		locale: Locale
		/** All configured locales. */
		locales: Locale[]
		/** The default/primary locale. */
		primaryLocale: PrimaryLocale
		/** Locales other than the default/primary one. */
		secondaryLocales: SecondaryLocale[]
		/** The fallback locale, when a translation is missing in a locale the fallback locale will be used to find a replacement. */
		fallbackLocale: Locale
		/** True when astro-i18n is initialized. */
		isInitialized: boolean
		/**
		 * @param key The translation key, for example `"my.nested.translation.key"`.
		 * @param properties An object containing your interpolation variables and/or your variants, for example `{ variant: 3, interpolation: "text" }`.
		 * @param options `route`: Overrides the current route, you will be able to access that route's translations. `locale`: Overrides the current locale, this allows you to control which language you want to translate to. `fallbackLocale`: Overrides the fallback locale.
		 */
		t<T extends Translation>(
			key: T | string & {},
			...args: undefined extends TranslationVariables[T]
				? [
					properties?: keyof TranslationVariables extends T 
						? Record<string, unknown> 
						: TranslationVariables[T], 
					options?: {
						route?: Route | string & {}
						locale?: Locale | string & {}
						fallbackLocale?: Locale | string & {}
					}
				]
				: [
					properties: TranslationVariables[T], 
					options?: {
						route?: Route | string & {}
						locale?: Locale | string & {}
						fallbackLocale?: Locale | string & {}
					}
				]
		): string
		/**
		 * @param route A route in any of the configured languages, for example `"/en/my/english/route/[param]"`.
		 * @param parameters An object containing your route parameters, for example `{ slug: "my-blog-post-slug" }`.
		 * @param options `targetLocale`: Overrides the target locale. `routeLocale`: Overrides the given route locale, this is useful if astro-i18n cannot figure out the route's locale. `showPrimaryLocale`: Overrides the showPrimaryLocale parameter. `query`: Adds these query parameters at the end of the translated route.
		 */
		l<T extends Route>(
			route: T | string & {},
			...args: T extends keyof RouteParameters
				? undefined extends RouteParameters[T]
					? [
						parameters?: Record<string, string>, 
						options?: { 
							targetLocale?: string, 
							routeLocale?: string,
							showPrimaryLocale?: string,
							query?: Record<string, unknown>
						}
					]
					: [
						parameters: RouteParameters[T], 
						options?: { 
							targetLocale?: string, 
							routeLocale?: string,
							showPrimaryLocale?: string,
							query?: Record<string, unknown>
						}
					]
				: [
					parameters?: Record<string, string>, 
					options?: { 
						targetLocale?: string, 
						routeLocale?: string,
						showPrimaryLocale?: string,
						query?: Record<string, unknown>
					}
				]
		): string
		/** Adds new translations at runtime. */
		addTranslations(translations: Translations): this
		/** Adds new translation formatters at runtime. */
		addFormatters(translationFormatters: TranslationFormatters): this
		/** Adds new translation loading rules at runtime. */
		addTranslationLoadingRules(translationLoadingRules: TranslationLoadingRules): this
		/** Adds new route segment translations at runtime. */
		addRoutes(routes: SegmentTranslations): this
		/** Tries to parse one of the configured locales out of the given route. If no configured locale is found it will return `null`. */
		extractRouteLocale(route: string): string|null
		/** Initializes astro-i18n on the server-side. */
		initialize(config?: Partial<AstroI18nConfig> | string, formatters?: TranslationFormatters = {}): Promise<void>
		/** Redirects the user to the given destination. */
		redirect(destination: string | URL, status = 301)
	}
	export const astroI18n: AstroI18n
}
// ###< astro-i18n/type-generation ###
