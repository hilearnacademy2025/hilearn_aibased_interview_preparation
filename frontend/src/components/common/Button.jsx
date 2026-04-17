


// import { motion as Motion } from 'framer-motion'
// import { Link } from 'react-router-dom'

// const baseStyles =
//   'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 disabled:cursor-not-allowed disabled:opacity-60'

// const variants = {
//   primary: 'bg-blue-600 text-white shadow-md shadow-blue-500/30 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/40',
//   white: 'bg-white text-blue-600 shadow-md hover:bg-gray-50 hover:shadow-lg',  
//   secondary: 'border border-gray-300 bg-white text-gray-700 shadow-sm hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600',
//   ghost: 'text-gray-600 hover:bg-blue-50 hover:text-blue-600',
// }

// function Button({
//   children,
//   className = '',
//   variant = 'primary',
//   href,
//   to,
//   type = 'button',
//   ...props
// }) {
//   const styles = `${baseStyles} ${variants[variant]} ${className}`

//   if (to) {
//     return (
//       <Motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
//         <Link className={styles} to={to} {...props}>
//           {children}
//         </Link>
//       </Motion.div>
//     )
//   }

//   if (href) {
//     return (
//       <Motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
//         <a className={styles} href={href} {...props}>
//           {children}
//         </a>
//       </Motion.div>
//     )
//   }

//   return (
//     <Motion.button
//       type={type}
//       whileHover={{ y: -2 }}
//       whileTap={{ scale: 0.97 }}
//       className={styles}
//       {...props}
//     >
//       {children}
//     </Motion.button>
//   )
// }

// export default Button

import { motion as Motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const baseStyles =
  'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 disabled:cursor-not-allowed disabled:opacity-60'

const variants = {
  primary: 'bg-blue-600 !text-white shadow-md shadow-blue-500/30 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/40',
  white: 'bg-white !text-blue-600 shadow-md hover:bg-gray-50 hover:shadow-lg',
  secondary: 'border border-gray-300 bg-white !text-gray-700 shadow-sm hover:border-blue-400 hover:bg-blue-50 hover:!text-blue-600',
  ghost: '!text-gray-600 hover:bg-blue-50 hover:!text-blue-600',
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
      <Motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
        <Link className={styles} to={to} {...props}>
          {children}
        </Link>
      </Motion.div>
    )
  }

  if (href) {
    return (
      <Motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
        <a className={styles} href={href} {...props}>
          {children}
        </a>
      </Motion.div>
    )
  }

  return (
    <Motion.button
      type={type}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      className={styles}
      {...props}
    >
      {children}
    </Motion.button>
  )
}

export default Button