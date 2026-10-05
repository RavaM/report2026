import styles from './Heading.module.scss'
import classnames from 'classnames'

export default function Heading({ children, weight, className, id }) {
  const Tag = weight ? `h${weight}` : `p`
  return (
    <Tag className={classnames(styles.heading, className)} id={id}>
      {children}
    </Tag>
  )
}
