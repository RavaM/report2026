'use client'
import styles from './Outro.module.scss'
import { useEffect, useMemo, useState } from 'react'
import type { OutroBlock } from '@/payload-types'
import RichText from '@/components/RichText'
import { useInView } from 'react-intersection-observer'
import Button from '@/components/Button'
import Media from '@/components/Media'
import classnames from 'classnames'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { Autoplay } from 'swiper/modules'

type CarouselMedia = {
  id: number | string
  type: 'image' | 'video'
  url: string
  width: number
  height: number
  alt: string
}

export default function Outro({
  greeting,
  signature,
  gallery,
  shuffleGallery,
  contactButton,
  footerText,
  copyright,
}: OutroBlock) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '-30%',
  })

  const originalMedia = useMemo<CarouselMedia[]>(
    () =>
      (gallery ?? []).flatMap((media) =>
        typeof media === 'object' && media !== null && media.url
          ? [
              {
                id: media.id,
                type: media.mimeType?.startsWith('video/') ? 'video' : 'image',
                url: media.url,
                width: media.width ?? 800,
                height: media.height ?? 600,
                alt: media.alt ?? '',
              },
            ]
          : [],
      ),
    [gallery],
  )
  const [images, setImages] = useState<CarouselMedia[]>([])

  useEffect(() => {
    const media = [...originalMedia]
    if (shuffleGallery) {
      for (let i = media.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[media[i], media[j]] = [media[j], media[i]]
      }
    }
    setImages(media)
  }, [originalMedia, shuffleGallery])

  const currentYear = new Date().getFullYear()
  const startYear = copyright?.startYear ?? currentYear

  return (
    <motion.div id="outro">
      <div className={styles.section}>
        <div className={classnames(styles.logo, { [styles.animate]: inView })} ref={ref}>
          <svg
            className={styles.start}
            xmlns="http://www.w3.org/2000/svg"
            width="1034"
            height="616"
            fill="none"
            viewBox="0 0 1034 616"
            role="img"
            aria-label="Anno 2025"
          >
            <path
              fill="url(#a)"
              d="M761.807 462.353h271.703v44.759H701.918v-40.346c189.122-109.69 262.88-176.514 262.88-261.619 0-61.779-41.607-102.756-104.018-102.756-63.671 0-105.908 39.716-105.908 100.235 0 25.846 7.565 56.106 18.282 80.061H720.83c-9.456-21.433-17.651-53.584-17.651-82.583 0-83.844 63.671-140.58 158.862-140.58 93.931 0 155.709 56.106 155.709 140.58 0 97.713-70.604 168.949-255.943 262.249Z"
            />
            <path
              fill="url(#b)"
              d="M513.416 513.416c-113.473 0-179.035-82.583-179.035-226.316 0-144.363 68.084-227.577 179.035-227.577 110.952 0 178.406 83.214 178.406 227.577 0 144.994-66.193 226.316-178.406 226.316Zm0-42.867c83.214 0 127.973-66.193 127.973-183.449 0-121.038-48.541-184.709-127.973-184.709-80.061 0-128.603 63.671-128.603 184.709 0 119.778 46.651 183.449 128.603 183.449Z"
            />
            <path
              fill="url(#c)"
              d="M59.887 462.353h271.705v44.759H-.002v-40.346c189.122-109.69 262.88-176.514 262.88-261.619 0-61.779-41.607-102.756-104.017-102.756-63.671 0-105.909 39.716-105.909 100.235 0 25.846 7.565 56.106 18.282 80.061H18.91c-9.456-21.433-17.65-53.584-17.65-82.583 0-83.844 63.67-140.58 158.862-140.58 93.931 0 155.711 56.106 155.711 140.58 0 97.713-70.606 168.949-255.945 262.249Z"
            />
            <defs>
              <linearGradient
                id="a"
                x1="679"
                x2="679"
                y1="-91.889"
                y2="664.111"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset=".235" stopColor="#ECFCE6" />
                <stop offset="1" stopColor="#D9FCC7" />
              </linearGradient>
              <linearGradient
                id="b"
                x1="679"
                x2="679"
                y1="-91.889"
                y2="664.111"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset=".235" stopColor="#ECFCE6" />
                <stop offset="1" stopColor="#D9FCC7" />
              </linearGradient>
              <linearGradient
                id="c"
                x1="679"
                x2="679"
                y1="-91.889"
                y2="664.111"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset=".235" stopColor="#ECFCE6" />
                <stop offset="1" stopColor="#D9FCC7" />
              </linearGradient>
            </defs>
          </svg>
          <svg
            className={styles.number5}
            xmlns="http://www.w3.org/2000/svg"
            width="400"
            height="616"
            fill="none"
            viewBox="0 0 400 616"
            role="img"
            aria-label="Numero 5"
          >
            <path
              fill="url(#a)"
              d="M235.533 212.711c78.171 0 132.385 54.845 132.385 143.733 0 93.93-65.562 156.971-165.166 156.971-92.039 0-157.602-48.541-171.47-128.603l47.91-20.173c10.717 66.823 57.367 105.908 124.821 105.908 68.714 0 114.103-44.759 114.103-116.625 0-64.932-41.606-105.908-102.126-105.908-67.453 0-102.125 39.085-116.625 84.474l-47.91-8.195c18.912-84.475 28.368-150.667 34.672-258.467h271.705v44.759H133.407c-5.043 54.215-11.347 107.169-22.694 170.84 23.325-41.607 65.562-68.714 124.82-68.714Z"
            />
            <defs>
              <linearGradient
                id="a"
                x1="204.5"
                x2="204.5"
                y1="-91.889"
                y2="664.111"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0.235" stopColor="#BFEBFD" />
                <stop offset="1" stopColor="#D3CFFD" />
              </linearGradient>
            </defs>
          </svg>

          <svg
            className={styles.number6}
            xmlns="http://www.w3.org/2000/svg"
            width="400"
            height="616"
            fill="none"
            viewBox="0 0 400 616"
            role="img"
            aria-label="Numero 6"
          >
            <path
              fill="#BFEBFD"
              d="M220.643 225.578c86.365 0 139.319 52.323 139.319 138.689 0 90.148-59.888 150.037-156.34 150.037-113.474 0-172.102-80.062-172.102-212.447 0-152.558 53.585-241.446 177.145-241.446 78.801 0 141.841 45.389 147.515 127.973l-44.759 10.086c-3.782-61.78-48.541-95.822-100.865-95.822-88.887 0-129.233 64.302-129.864 197.948 0 8.195 0 22.064 1.892 36.564 9.456-65.563 65.562-111.582 138.059-111.582Zm-16.391 247.119c64.301 0 106.539-40.976 106.539-109.06 0-64.302-40.977-102.756-104.648-102.756-66.823 0-114.734 46.65-114.734 102.125 0 64.302 46.02 109.691 112.843 109.691Z"
            />
            <path
              fill="url(#a)"
              d="M220.643 225.578c86.365 0 139.319 52.323 139.319 138.689 0 90.148-59.888 150.037-156.34 150.037-113.474 0-172.102-80.062-172.102-212.447 0-152.558 53.585-241.446 177.145-241.446 78.801 0 141.841 45.389 147.515 127.973l-44.759 10.086c-3.782-61.78-48.541-95.822-100.865-95.822-88.887 0-129.233 64.302-129.864 197.948 0 8.195 0 22.064 1.892 36.564 9.456-65.563 65.562-111.582 138.059-111.582Zm-16.391 247.119c64.301 0 106.539-40.976 106.539-109.06 0-64.302-40.977-102.756-104.648-102.756-66.823 0-114.734 46.65-114.734 102.125 0 64.302 46.02 109.691 112.843 109.691Z"
            />
            <defs>
              <linearGradient
                id="a"
                x1="193.989"
                x2="193.989"
                y1="-343.189"
                y2="915.998"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset=".235" stopColor="#BFEBFD" />
                <stop offset="1" stopColor="#D3CFFD" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className={styles.container}>
          <p className={styles.top}>{greeting}</p>
          {images.length > 0 && (
            <div className={styles.carousel} aria-label="Carosello di foto del team">
              <Swiper
                modules={[Autoplay]}
                spaceBetween={0}
                loop={images.length > 1}
                slidesPerView="auto"
                allowTouchMove={false}
                centeredSlides={true}
                speed={6000}
                autoplay={{
                  delay: 1,
                  disableOnInteraction: true,
                  pauseOnMouseEnter: true,
                }}
              >
                {images.map((media, index) => (
                  <SwiperSlide key={`${media.id}-${index}`}>
                    <Media
                      type={media.type}
                      url={media.url}
                      width={media.width}
                      height={media.height}
                      className={styles.media}
                      alt={media.alt}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
          <p className={styles.bottom}>{signature}</p>
          {contactButton?.url && contactButton.label && (
            <Button
              className={styles.button}
              color={contactButton.color ?? undefined}
              textColor={contactButton.textColor ?? undefined}
              href={contactButton.url}
              ariaLabel={contactButton.ariaLabel || contactButton.label}
            >
              {contactButton.label}
            </Button>
          )}
          <footer className={styles.footer}>
            {footerText && <RichText data={footerText} enableGutter={false} enableProse={false} />}
            {copyright?.company && (
              <p>
                © {startYear}
                {currentYear > startYear ? ` - ${currentYear}` : ''}{' '}
                {copyright.url ? (
                  <a href={copyright.url}>{copyright.company}</a>
                ) : (
                  copyright.company
                )}{' '}
                {copyright.note}
              </p>
            )}
          </footer>
        </div>
      </div>
    </motion.div>
  )
}
