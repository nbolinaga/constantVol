import type { BusinessDay, Time } from 'lightweight-charts'
import { isBusinessDay } from 'lightweight-charts'

export const shortenAddress = (address?: string, length = 4): string => {
  if (!address) {
    return ''
  }

  return `${address.slice(0, length + 2)}...${address.slice(-length)}`
}

export const formatBalance = (number: bigint): string => {
  try {
    const toStringNumber = number.toString()
    const length = toStringNumber.length

    let integerPart = '0'
    let decimalPart = '0'

    if (length > 6) {
      integerPart = toStringNumber.slice(0, length - 6)
      decimalPart = toStringNumber.slice(length - 6, length - 4)
    } else {
      integerPart = '0'
      decimalPart = '0'.repeat(6 - length) + toStringNumber
    }

    let formattedNumber = `${integerPart}.${decimalPart}`
    formattedNumber = parseFloat(formattedNumber).toFixed(2)

    return formattedNumber
  } catch (error) {
    return '0.0'
  }
}

export const formatShares = (share: bigint): string => {
  try {
    const toStringNumber = share.toString()
    const length = toStringNumber.length

    let integerPart = '0'
    let decimalPart = '0'

    if (length > 18) {
      integerPart = toStringNumber.slice(0, length - 18)
      decimalPart = toStringNumber.slice(length - 18, length - 16)
    } else {
      integerPart = '0'
      decimalPart = '0'.repeat(18 - length) + toStringNumber
    }

    let formattedNumber = `${integerPart}.${decimalPart}`
    formattedNumber = parseFloat(formattedNumber).toFixed(2)

    return formattedNumber
  } catch (error) {
    return '0.0'
  }
}

export const formatPrice = (price: string): string => {
  const priceNum = parseFloat(price)

  if (isNaN(priceNum)) return 'Invalid Number'

  let formattedPrice

  if (Math.abs(priceNum) >= 1000) formattedPrice = priceNum.toFixed(2)
  else formattedPrice = priceNum.toFixed(4)

  return formattedPrice.replace(/\d(?=(\d{3})+\.)/g, '$&,')
}

export const formatPercentage = (percentage: number): string => {
  const roundedPercentage = Math.abs(percentage).toFixed(2)

  const prefix = percentage >= 0 ? '+' : '-'

  const formattedPercentage = `${prefix}${roundedPercentage}%`

  return formattedPercentage
}

export const formatDate = (date: Date): string => {
  const newDate = new Date(date)
  const year = newDate.getUTCFullYear()
  const month = String(newDate.getUTCMonth() + 1).padStart(2, '0')
  const day = String(newDate.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatDateAmerican(time: Time): string {
  const date = timeToDate(time)

  const pad = (n: number): string => (n < 10 ? '0' + n : n.toString())

  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  const year = date.getFullYear()

  return `${month}/${day}/${year}`
}

function timeToDate(time: Time): Date {
  if (isBusinessDay(time)) {
    const businessDay = time as BusinessDay
    return new Date(businessDay.year, businessDay.month - 1, businessDay.day)
  } else if (typeof time === 'string') {
    return new Date(time)
  } else {
    const unixTimestamp = time as number
    return new Date(unixTimestamp * 1000)
  }
}

export function hexToRGBA(hex: string, opacity: number) {
  if (hex == undefined) return 'white'
  hex = hex.replace(/^#/, '')

  // Parse the r, g, b values
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  // Return the RGBA string
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}
