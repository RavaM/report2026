import styles from './Button.module.scss'
import classnames from 'classnames'
import type { ComponentPropsWithoutRef, CSSProperties } from 'react'

type ButtonProps = ComponentPropsWithoutRef<'a'> & {
  ghost?: boolean
  textColor?: string
  ariaLabel?: string
}

export default function Button({
  href,
  className,
  children,
  color,
  ghost,
  textColor,
  ariaLabel,
}: ButtonProps) {
  const style: CSSProperties & {
    '--button-bg-color'?: string
    '--button-text-color'?: string
  } = {
    '--button-bg-color': color,
    '--button-text-color': textColor,
  }

  return (
    <a
      className={classnames(styles.button, 'fancy-text', { [styles.ghost]: ghost }, className)}
      href={href}
      aria-label={ariaLabel}
      style={style}
    >
      {children}
    </a>
  )
}
