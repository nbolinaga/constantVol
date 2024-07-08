import type { ReactNode } from 'react'
import React from 'react'

type CardProps = {
  title?: string
  subtitle?: string
  children: ReactNode
  className?: string
}

const Card = ({ title, subtitle, children, className }: CardProps) => {
  return (
    <div className={`h-fit w-fit p-[5vh] transition ease-in-out bg-darkness ${className}`}>
      {(title || subtitle) && (
        <div className="flex justify-between items-center h-fit font-bold border-b-carmesi border-b-4 pb-1 mb-[2vh]">
          <h4 className="text-xl">{title}</h4>
          <p className="text-md">{subtitle}</p>
        </div>
      )}
      {children}
    </div>
  )
}

export default Card
