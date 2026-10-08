import { JSX } from 'react/jsx-runtime'
import styles from './Heading.module.scss'
import classnames from 'classnames'

type HeadingProps = {
  children: React.ReactNode
  weight?: 1 | 2 | 3 | 4 | 5 | 6
  className?: string
  id?: string
}

export default function Heading({ children, weight, className, id }: HeadingProps) {
  const Tag = (weight ? `h${weight}` : `p`) as keyof JSX.IntrinsicElements

  return (
    <Tag className={classnames(styles.heading, className)} id={id}>
      {children}
    </Tag>
  )
}
