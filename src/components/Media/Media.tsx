'use client'
import styles from './Media.module.scss'
import classnames from 'classnames'
import { useInView } from 'react-intersection-observer'
import { useState } from 'react'

type MediaProps = {
  url: string
  alt: string
  className?: string
  type: 'image' | 'video'
  width: number
  height: number
}

export default function Media({ url, alt, className, type, width, height }: MediaProps) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })
  const [isLoaded, setIsLoaded] = useState(false)

  if (type === 'video') {
    const srcProperties = {
      [inView ? 'src' : 'data-src']: url,
    }

    const handleVideoLoad = (e: React.SyntheticEvent<HTMLVideoElement>) => {
      setIsLoaded(true)
      // Forza il play su iOS
      if (inView) {
        e.target.play().catch(() => {
          // Ignora errori se il play fallisce
        })
      }
    }

    return (
      <span
        className={classnames(styles.media, { [styles.view]: isLoaded && inView }, className)}
        style={{ aspectRatio: `${width}/${height}` }}
        ref={ref}
      >
        <video
          {...srcProperties}
          title={alt}
          autoPlay
          muted
          playsInline
          webkit-playsinline="true"
          loop
          preload="auto"
          onLoadedData={handleVideoLoad}
          onCanPlay={(e) => {
            // Forza il play anche su canPlay per iOS
            if (inView) {
              e.target.play().catch(() => {})
            }
          }}
        />
      </span>
    )
  }

  return (
    <span
      className={classnames(styles.media, { [styles.view]: isLoaded && inView }, className)}
      style={{ aspectRatio: `${width}/${height}` }}
      ref={ref}
    >
      {inView && <img src={url} alt={alt} onLoad={() => setIsLoaded(true)} />}
    </span>
  )
}
