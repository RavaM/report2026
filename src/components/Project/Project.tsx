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
import dynamic from 'next/dynamic'

export default function Project({
  title,
  text,
  services,
  serviceColor,
  cta,
  cta2,
  gallery,
  galleryCaption,
  numbers,
  quote,
  spoiler,
  color,
  textColor,
  is2026,
  isContinue,
  isLight,
}) {
  const { ref, inView, entry } = useInView({
    rootMargin: '-50% 0% -50% 0%',
  })
  useEffect(() => {
    if (inView) document.body.style.backgroundColor = color
  }, [inView])
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
              <SpoilerAlert
                className={styles.spoilerAlert}
                bgColor={color}
                textColor={textColor}
              />
            )}
            <Heading
              weight={2}
              className={styles.title}
              id={`project-${title.replace(/\s+/g, '-').toLowerCase()}`}
            >
              {title}
            </Heading>
            <RichText className={styles.text}>{text}</RichText>
            {services && (
              <p
                className={styles.services}
                style={{ color: serviceColor || color }}
              >
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
              <Media
                className={styles.image}
                key={index}
                {...image}
                alt={title}
              />
            ))}
            {galleryCaption && (
              <p className={styles.galleryCaption}>{galleryCaption}</p>
            )}
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
}) => {
  const { ref, inView, entry } = useInView({
    triggerOnce: true,
    rootMargin: '-50% 0% -50% 0%',
  })
  return (
    <div
      className={classnames(
        styles.spoiler,
        { [styles.dark]: dark },
        { [styles.visible]: inView },
      )}
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
          <RichText className={styles.copy}>{text}</RichText>
        </div>
      </div>
    </div>
  )
}
