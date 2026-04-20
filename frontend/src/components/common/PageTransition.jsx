import { motion } from 'framer-motion'
import { pageTransition } from './motion'

function PageTransition({ children, className = 'page-shell' }) {
  return (
    <motion.div
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      exit={pageTransition.exit}
      transition={pageTransition.transition}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default PageTransition
