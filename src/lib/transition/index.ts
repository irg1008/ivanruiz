import type { HTMLAttributes, ReactHTML } from 'react'
import { createElement } from 'react'

type HTMLKey = keyof ReactHTML

type TransitionProps = {
	name: string
}

type ElementProps<K extends HTMLKey> = TransitionProps & HTMLAttributes<K>

type ElementFactory<K extends HTMLKey> = (props: ElementProps<K>) => JSX.Element

type Transition = {
	[K in HTMLKey]: ElementFactory<K>
}

const createTransitionElement = <K extends HTMLKey>(element: K, props: ElementProps<K>) => {
	const { name, style, ...rest } = props
	return createElement(element, { ...rest, style: { ...style, viewTransitionName: name } })
}

const transitionGetter = <K extends HTMLKey>(element: K): ElementFactory<K> => {
	return (props) => createTransitionElement<K>(element, props)
}

export const transition = new Proxy<Transition>({} as Transition, {
	get: (_, element: HTMLKey) => transitionGetter(element),
})
