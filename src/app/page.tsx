'use client'

import { useEffect, useState, type ReactNode } from 'react'

import AppProviders from '@/components/AppProviders'
import '@/styles/globals.css'
import ChartsContainer from '@/components/ChartsContainer/Index'

import * as d3 from 'd3'
import { timeParse } from 'd3-time-format'
import ChartOptions from '@/components/ChartOptions/Index'

const parseDate = timeParse('%Y-%m-%d')
const formatTime = d3.utcFormat('%B %d, %Y')

const parseData = (data: any) => {
  return data.map((obj: any) => {
    const { ['']: dateString, ...rest } = obj
    const date = dateString ? parseDate(dateString) : null
    const formattedDate = date ? formatTime(date) : null
    return { date: formattedDate, ...rest }
  })
}

const RootLayout = ({
  children,
}: Readonly<{
  children: ReactNode
}>) => {
  const [prices, setPrices] = useState<number[][]>([])
  const [dates, setDates] = useState<Date[]>([])

  const fetchDaily = async () => {


    try {
      let dailyData = await d3.csv('/daily_prices_for_jesus.csv')
      dailyData = parseData(dailyData)

      const coins = Object.keys(dailyData[0]).filter((key) => key !== 'date')
      const dates = dailyData.map((obj) => obj.date).filter((date) => date !== null) as unknown as Date[]

      const arrayOfArrays = coins.map((coin) => {
        const prices = dailyData.map((obj) => parseFloat(obj[coin]) || 0)
        return prices
      })

      // const coinNames: string[] = dailyData.reduce<string[]>((acc, obj) => {
      //   const keys = Object.keys(obj).filter((key) => key !== 'date')
      //   return [...acc, ...keys]
      // }, [])

      // const uniqueCoinNames = Array.from(new Set(coinNames))

      // setCoins(uniqueCoinNames.map((coin) => coin.slice(0, -4)))
      setDates(dates)
      setPrices(arrayOfArrays)
    } catch (error) {
      console.error('Error fetching data :', error)
    }
  }

  useEffect(() => {
    fetchDaily()
  }, [])

  return (
    <html lang="en">
      <body className="overscroll-none pro">
        <AppProviders>
          {prices.length > 0 ? (
            <>
              <ChartOptions prices={prices} />
              <ChartsContainer prices={prices} dates={dates} />
            </>
          ) : (
            <div className="w-full h-full flex justify-center pt-[15vh]" title="LOADING...">
              <></>
            </div>
          )}
        </AppProviders>
      </body>
    </html>
  )
}

export default RootLayout
