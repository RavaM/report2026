'use client'
import styles from "./Numbers.module.scss"
import {useInView} from "react-intersection-observer"
import classnames from "classnames"

export default function Numbers({numbers}) {
  return (
    <ul className={styles.numbers}>
      {numbers.map((num,index) => (
        <Item key={index} num={num} />
      ))}
    </ul>
  )
}

const Item = ({num}) => {
  const {ref, inView, entry} = useInView({
    triggerOnce: true,
    rootMargin: "-30%"
  });
  return (
    <li className={classnames({[styles.visible]:inView})} ref={ref}>
      <strong><span>{num.prefix}{num.value}{(num?.suffix) ? <em>{num.suffix}</em> : ``}</span></strong> <span className={styles.caption}>{num.label}</span>
    </li>
  )
}
