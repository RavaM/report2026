'use client'

import React from 'react'
import styles from './Project.module.scss'
import { useInView } from 'react-intersection-observer'
import { useEffect } from 'react'
import classnames from 'classnames'
import Button from '@/components/Button'
import SpoilerAlert from '@/components/SpoilerAlert'
import Heading from '@/components/Heading'
import RichText from '@/components/RichText'
import Media from '@/components/Media'
import Quote from './Quote'
import Numbers from './Numbers'
import type { Media as PayloadMedia, Project as PayloadProject, Service } from '@/payload-types'

type ProjectCTA = Pick<PayloadProject['ctas'][number], 'url'> & {
  cta: PayloadProject['ctas'][number]['label']
  buttonColor?: string
  buttonTextColor?: string
  ariaLabel?: string
}

type ProjectMedia = {
  url: NonNullable<PayloadMedia['url']>
  width: NonNullable<PayloadMedia['width']>
  height: NonNullable<PayloadMedia['height']>
  type: 'image' | 'video'
}

type ProjectSpoiler = {
  image: ProjectMedia['url']
  text: NonNullable<NonNullable<PayloadProject['spoiler']>['text']> | React.ReactNode
  width?: ProjectMedia['width']
  height?: ProjectMedia['height']
  type?: ProjectMedia['type']
}

export type ProjectProps = Pick<PayloadProject, 'title' | 'color' | 'textColor' | 'quote'> & {
  text?: PayloadProject['description'] | React.ReactNode
  services?: Service['title'][]
  numbers?: PayloadProject['statistics']
  cta?: ProjectCTA
  cta2?: ProjectCTA
  spoiler?: ProjectSpoiler
  gallery?: ProjectMedia[]
  galleryCaption?: React.ReactNode
  serviceColor?: string
  is2026?: boolean
  isContinue?: boolean
  isLight?: boolean
}

type SpoilerProps = ProjectSpoiler & {
  title: PayloadProject['title']
  dark?: boolean
}

function isPayloadRichText(
  value: ProjectProps['text'],
): value is NonNullable<PayloadProject['description']> {
  return typeof value === 'object' && value !== null && 'root' in value
}

export default function Project({
  title,
  text,
  services,
  serviceColor,
  cta,
  cta2,
  gallery = [],
  galleryCaption,
  numbers,
  quote,
  spoiler,
  color,
  textColor,
  is2026,
  isContinue,
  isLight,
}: ProjectProps) {
  const { ref, inView } = useInView({
    rootMargin: '-50% 0% -50% 0%',
  })
  useEffect(() => {
    if (inView) document.body.style.backgroundColor = color
  }, [inView, color])
  return (
    <section
      className={classnames(
        styles.project,
        { [styles.continue]: isContinue },
        { [styles.hasSpoiler]: spoiler },
      )}
      ref={ref}
      aria-labelledby={`project-${title.replace(/\s+/g, '-').toLowerCase()}`}
    >
      <div className={styles.box}>
        <div className={styles.wrap}>
          <div className={styles.content}>
            {is2026 && (
              <SpoilerAlert className={styles.spoilerAlert} bgColor={color} textColor={textColor} />
            )}
            <Heading
              weight={2}
              className={styles.title}
              id={`project-${title.replace(/\s+/g, '-').toLowerCase()}`}
            >
              {title}
            </Heading>
            {text &&
              (isPayloadRichText(text) ? (
                <RichText className={styles.text} data={text} />
              ) : (
                <div className={styles.text}>{text}</div>
              ))}
            {services && (
              <p className={styles.services} style={{ color: serviceColor || color }}>
                {services.map((service, index) => (
                  <React.Fragment key={index}>
                    {service}
                    {index < services.length - 1 && (
                      <>
                        {' '}
                        <span className="sep">•</span>{' '}
                      </>
                    )}
                  </React.Fragment>
                ))}
              </p>
            )}
            {cta && (
              <div className={styles.buttons}>
                <Button
                  className={styles.button}
                  href={cta.url}
                  color={cta.buttonColor || color}
                  textColor={cta.buttonTextColor || textColor}
                  ariaLabel={cta.ariaLabel || `${cta.cta} - ${title}`}
                >
                  {cta.cta}
                </Button>
                {cta2 && (
                  <Button
                    className={styles.button}
                    href={cta2.url}
                    ghost
                    ariaLabel={cta2.ariaLabel || `${cta2.cta} - ${title}`}
                  >
                    {cta2.cta}
                  </Button>
                )}
              </div>
            )}
          </div>
          <div className={styles.gallery}>
            {gallery.map((image, index) => (
              <Media className={styles.image} key={index} {...image} alt={title} />
            ))}
            {galleryCaption && <p className={styles.galleryCaption}>{galleryCaption}</p>}
          </div>
        </div>
        {quote && <Quote {...quote} color={quote.color || color} />}
        {numbers && numbers.length > 0 && <Numbers numbers={numbers} />}
      </div>
      {spoiler && <Spoiler {...spoiler} title={title} dark={isLight} />}
    </section>
  )
}

const Spoiler = ({
  image,
  text,
  title,
  dark,
  width = 500,
  height = 400,
  type = 'image',
}: SpoilerProps) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '-50% 0% -50% 0%',
  })
  return (
    <div
      className={classnames(styles.spoiler, { [styles.dark]: dark }, { [styles.visible]: inView })}
      ref={ref}
    >
      <div className={styles.wrap}>
        <Media
          className={styles.image}
          url={image}
          alt={title}
          width={width}
          height={height}
          type={type}
        />
        <div className={styles.text}>
          <span className={styles.line} />
          <p className={styles.caption}>Nel 2026</p>
          {isPayloadRichText(text) ? (
            <RichText
              className={styles.copy}
              data={text}
              enableGutter={false}
              enableProse={false}
            />
          ) : (
            <div className={styles.copy}>{text}</div>
          )}
        </div>
      </div>
    </div>
  )
}
