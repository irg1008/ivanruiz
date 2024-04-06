import type { PropsWithChildren, SVGAttributes } from 'react'

export type IconProps = SVGAttributes<SVGElement>
export type IconType = (props: IconProps) => JSX.Element

export const Icon = ({
  children: path,
  title,
  ...props
}: PropsWithChildren<IconProps & { title: string }>) => {
  return (
    <svg
      role='img'
      fill='currentColor'
      viewBox='0 0 24 24'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <title>{title}</title>
      {path}
    </svg>
  )
}
