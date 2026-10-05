'use client'
import styles from './Media.module.scss'
import classnames from 'classnames'
import { useInView } from 'react-intersection-observer'
import { useState } from 'react'

export default function Media({ url, alt, className, type, width, height }) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })
  const [isLoaded, setIsLoaded] = useState(false)
  const [imageLoadError, setImageLoadError] = useState({})

  // Controlla se è una GIF
  const isGif = url.toLowerCase().endsWith('.gif')

  // Funzione per generare il percorso ottimizzato
  const getOptimizedPath = (originalUrl, format, suffix = '') => {
    const cleanUrl = originalUrl.replace(/^\/+/, '')
    const lastSlashIndex = cleanUrl.lastIndexOf('/')
    const directory = cleanUrl.substring(0, lastSlashIndex)
    const filename = cleanUrl.substring(lastSlashIndex + 1)
    const baseName = filename.split('.')[0]

    return `/optimized/${directory}/${baseName}${suffix ? `-${suffix}` : ''}.${format}`
  }

  // Funzione per generare srcSet con gestione errori
  const generateSrcSet = (format, originalUrl) => {
    const sizes = [
      { width: 350, suffix: 'sm' },
      { width: 560, suffix: 'md' },
      { width: 1126, suffix: 'lg' },
    ]

    return sizes
      .filter((size) => !imageLoadError[`${format}-${size.suffix}`])
      .map((size) => `${getOptimizedPath(originalUrl, format, size.suffix)} ${size.width}w`)
      .join(', ')
  }

  // Gestione errori di caricamento immagini
  const handleImageError = (format, suffix) => {
    setImageLoadError((prev) => ({
      ...prev,
      [`${format}-${suffix}`]: true,
    }))
  }

  if (type === 'video') {
    const srcProperties = {
      [inView ? 'src' : 'data-src']: url,
    }

    const handleVideoLoad = (e) => {
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

  // Per le GIF, usa direttamente l'originale senza ottimizzazione
  if (isGif) {
    return (
      <span
        className={classnames(styles.media, { [styles.view]: isLoaded && inView }, className)}
        style={{ aspectRatio: `${width}/${height}` }}
        ref={ref}
      >
        {inView && (
          <img
            src={`/optimized${url}`}
            alt={alt}
            onLoad={() => setIsLoaded(true)}
            onError={() => {
              // Fallback all'originale se la copia ottimizzata non esiste
              const img = document.querySelector(`img[src="/optimized${url}"]`)
              if (img) img.src = url
            }}
          />
        )}
      </span>
    )
  }

  return (
    <span
      className={classnames(styles.media, { [styles.view]: isLoaded && inView }, className)}
      style={{ aspectRatio: `${width}/${height}` }}
      ref={ref}
    >
      {inView && (
        <picture>
          {/* AVIF */}
          {!imageLoadError['avif'] && (
            <source
              type="image/avif"
              srcSet={generateSrcSet('avif', url)}
              sizes="(max-width: 350px) 350px, (max-width: 560px) 560px, 1126px"
              onError={() => handleImageError('avif')}
            />
          )}

          {/* WebP */}
          {!imageLoadError['webp'] && (
            <source
              type="image/webp"
              srcSet={generateSrcSet('webp', url)}
              sizes="(max-width: 350px) 350px, (max-width: 560px) 560px, 1126px"
              onError={() => handleImageError('webp')}
            />
          )}

          {/* Fallback originale */}
          <img src={url} alt={alt} onLoad={() => setIsLoaded(true)} />
        </picture>
      )}
    </span>
  )
}
