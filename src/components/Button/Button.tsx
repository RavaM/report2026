import styles from './Button.module.scss'
import classnames from 'classnames'

export default function Button({
  href,
  className,
  children,
  color,
  ghost,
  textColor,
  ariaLabel,
}) {
  return (
    <a
      className={classnames(
        styles.button,
        'fancy-text',
        { [styles.ghost]: ghost },
        className,
      )}
      href={href}
      aria-label={ariaLabel}
      style={{
        '--button-bg-color': color,
        '--button-text-color': textColor,
      }}
    >
      {children}
    </a>
  )
}
