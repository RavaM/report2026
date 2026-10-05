'use client'
import styles from './Quote.module.scss'
import { useInView } from 'react-intersection-observer'
import classnames from 'classnames'

export default function Quote({ text, author, color }) {
  const { ref, inView, entry } = useInView({
    triggerOnce: true,
    rootMargin: '-30%',
  })
  return (
    <blockquote className={classnames(styles.quote, { [styles.visible]: inView })} ref={ref}>
      <p className={styles.text}>“{text}”</p>
      {author && (
        <cite>
          {author.name} <em style={{ color: color }}>{author.role}</em>
        </cite>
      )}
    </blockquote>
  )
}
