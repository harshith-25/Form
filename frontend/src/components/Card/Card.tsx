import React, { forwardRef } from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = forwardRef<HTMLDivElement, CardProps>(({ children, className = '', ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`border p-4 rounded shadow ${className}`}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = 'Card'

export default Card;