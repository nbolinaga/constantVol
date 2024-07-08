import React from 'react'

import Chevron from '../Icons/Chevron'

type SelectProps = {
  handleChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  value: string | number
  options: string[] | number[]
  className?: string
  disabled?: boolean
}

const Select = ({ handleChange, value, options, className = '', disabled = false }: SelectProps) => {
  return (
    <div className="relative">
      <select
        className={`py-0.5 h-fit w-full text-sm border border-white bg-smoke text-white text-left cursor-pointer pr-[2vw] pl-[2vw] | md:w-max md:pr-[2vw] md:pl-[.5vw] ${className}`}
        id="cryptoCoin"
        onChange={handleChange}
        value={value}
        disabled={disabled}
      >
        {options.map((value, index) => (
          <option key={index} value={value}>
            {value}
          </option>
        ))}
      </select>
      <div className="absolute  top-1/2 -translate-y-1/2 pointer-events-none right-[2vw] | md:right-[.5vw]">
        <Chevron />
      </div>
    </div>
  )
}

export default Select
