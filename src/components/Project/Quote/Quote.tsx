'use client'
import type { Project } from '@/payload-types'
type QuoteProps = NonNullable<Project['quote']>

import styles from './Quote.module.scss'
import { useInView } from 'react-intersection-observer'
import classnames from 'classnames'

export default function Quote({ text, author, color }: QuoteProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '-30%',
  })
  return (
    <blockquote className={classnames(styles.quote, { [styles.visible]: inView })} ref={ref}>
      <p className={styles.text}>“{text}”</p>
      {author && (
        <cite>
          {author.name} <em style={{ color: color ?? undefined }}>{author.role}</em>
        </cite>
      )}
    </blockquote>
  )
}
