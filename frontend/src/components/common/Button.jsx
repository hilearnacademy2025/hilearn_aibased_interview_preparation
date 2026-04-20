import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const baseStyles =
  'inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8601a]/30 disabled:cursor-not-allowed disabled:opacity-60'

const variants = {
  primary:
    'bg-[#c8601a] text-white shadow-[0_16px_28px_rgba(200,96,26,0.24)] hover:bg-[#ae5317]',
  navy: 'bg-[#0f1f3d] text-white shadow-[0_16px_28px_rgba(15,31,61,0.2)] hover:bg-[#0a1630]',
  white: 'bg-white text-[#0f1f3d] shadow-[0_14px_28px_rgba(15,31,61,0.08)] hover:bg-[#fffaf2]',
  secondary:
    'border border-[#e0dbd3] bg-white text-[#111827] shadow-[0_12px_24px_rgba(15,31,61,0.06)] hover:border-[#c8601a]/30 hover:bg-[#fff8f1] hover:text-[#c8601a]',
  ghost: 'bg-transparent text-[#5c5a57] hover:bg-[#fff8f1] hover:text-[#c8601a]',
}

function Button({
  children,
  className = '',
  variant = 'primary',
  href,
  to,
  type = 'button',
  ...props
}) {
  const styles = `${baseStyles} ${variants[variant]} ${className}`

  if (to) {
    return (
      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
        <Link className={styles} to={to} {...props}>
          {children}
        </Link>
      </motion.div>
    )
  }

  if (href) {
    return (
      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
        <a className={styles} href={href} {...props}>
          {children}
        </a>
      </motion.div>
    )
  }

  return (
    <motion.button
      type={type}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={styles}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export default Button
