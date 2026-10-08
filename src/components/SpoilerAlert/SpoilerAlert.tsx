'use client'

import styles from './SpoilerAlert.module.scss'
import classnames from 'classnames'
import dynamic from 'next/dynamic'
import type { CSSProperties } from 'react'
const Marquee = dynamic(() => import('react-fast-marquee').then((mod) => mod.default), {
  ssr: false,
})

type SpoilerAlertProps = {
  className?: string
  bgColor?: string
  textColor?: string
}

export default function SpoilerAlert({ className, bgColor, textColor }: SpoilerAlertProps) {
  return (
    <div
      className={classnames(styles.object, className)}
      style={
        {
          '--spoiler-bg-color': bgColor,
          '--spoiler-text-color': textColor,
        } as CSSProperties
      }
    >
      <Marquee direction="left" speed={30} pauseOnHover={true} gradient={false}>
        {` `} SPOILER 2026 • SPOILER 2026 • SPOILER 2026 • SPOILER 2026 • SPOILER 2026 • SPOILER
        2026 • {` `} SPOILER 2026 • SPOILER 2026 • {` `}
      </Marquee>
    </div>
  )
}
