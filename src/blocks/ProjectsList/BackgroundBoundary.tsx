'use client'

import { useEffect, type ReactNode } from 'react'
import { useInView } from 'react-intersection-observer'

type Props = {
  children: ReactNode
  className?: string
}

export const BackgroundBoundary = ({ children, className }: Props) => {
  const { ref, inView } = useInView({
    rootMargin: '-50% 0% -50% 0%',
  })

  useEffect(() => {
    if (inView) return

    // Wait for the initial background to paint so the CSS transition runs on load.
    let colorFrame: number | undefined
    const paintFrame = requestAnimationFrame(() => {
      colorFrame = requestAnimationFrame(() => {
        document.body.style.backgroundColor = '#5043FC'
      })
    })

    return () => {
      cancelAnimationFrame(paintFrame)
      if (colorFrame !== undefined) cancelAnimationFrame(colorFrame)
    }
  }, [inView])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
