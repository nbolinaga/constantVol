import React, { useContext, useEffect, useRef, useState } from 'react'

import { OptionsContext } from '../../AppProviders'
import { classicTheme, proTheme } from '@/styles/colors'
import { formatDate, formatDateAmerican, hexToRGBA } from '../../../utils/formatters'

import { calculateCumulativeReturns, calculateScaledReturnsLeverage, pct_change } from '../chartComputations'
import { lineChartConfig, tooltipConfig, toolTipWidth, zeroLine } from '../chartConfig'

import type { IChartApi, Time } from 'lightweight-charts'
import { ColorType, createChart } from 'lightweight-charts'

interface PriceChartData {
  time: Time
  value: number
}

interface ChartProps {
  dates: Date[]
  seriesData1: number[]
  seriesData2: number[]
  ohcl: number[][]
}

interface OHLCChartData {
  time: Time
  open: number
  high: number
  low: number
  close: number
}

interface ThemeColorsType {
  darkness: string
  smoke: string
  carmesi: string
  white: string
  greySmoke: string
}

const RoC = ({ dates, seriesData1, seriesData2, ohcl }: ChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<IChartApi | undefined>()
  const initialVisibleRange = useRef<{ from: Time; to: Time } | undefined>(undefined)
  const { coin, window, rollingWindow, volatility, showCandle, studyCase } = useContext(OptionsContext)

  const [themeColors, setThemeColors] = useState<ThemeColorsType | null>(null)

  const pro = true

  useEffect(() => {
    if (!pro) {
      setThemeColors({
        darkness: classicTheme.darkness,
        smoke: classicTheme.smoke,
        carmesi: classicTheme.carmesi,
        white: classicTheme.white,
        greySmoke: classicTheme.greySmoke,
      })
    } else {
      setThemeColors({
        darkness: proTheme.darkness,
        smoke: proTheme.smoke,
        carmesi: proTheme.carmesi,
        white: proTheme.white,
        greySmoke: proTheme.greySmoke,
      })
    }
  }, [pro])

  useEffect(() => {
    if (!chartContainerRef.current) return

    if (chartInstance.current) {
      chartInstance.current.remove()
    }

    if (chartContainerRef.current) {
      if (showCandle) {
        chartInstance.current = createChart(chartContainerRef.current, {
          height: 400,
          ...lineChartConfig,
          localization: {
            priceFormatter: (price: number) => {
              return '$' + price
            },
          },
          leftPriceScale: {
            ...lineChartConfig.leftPriceScale,
            mode: 2,
          },
          layout: {
            background: { type: ColorType.Solid, color: 'transparent' },
            textColor: themeColors?.white,
          },
        })
      } else {
        chartInstance.current = createChart(chartContainerRef.current, {
          height: 400,
          ...lineChartConfig,
          // timeScale: { visible: false },
          layout: {
            background: { type: ColorType.Solid, color: 'transparent' },
            textColor: themeColors?.white,
          },
          crosshair: {
            ...lineChartConfig.crosshair,
            vertLine: { ...lineChartConfig.crosshair.vertLine, color: hexToRGBA(themeColors?.white as string, 0.1) },
          },
        })
      }
    }

    const periods = 365 // only for daily, have to change if hourly
    let selectedWindow = window

    if (studyCase == 1) {
      selectedWindow = 1171
    } else if (studyCase == 2) {
      selectedWindow = 258
    }

    const seriesData1Filtered = seriesData1.slice(-(selectedWindow + rollingWindow))
    const seriesData2Filtered = seriesData2.slice(-selectedWindow)
    const datesFiltered = dates.slice(-selectedWindow)
    const ohclFiltered = ohcl.slice(-selectedWindow)

    const data1PercentageChange = pct_change(seriesData1Filtered)
    const scaledReturns = calculateScaledReturnsLeverage(data1PercentageChange, rollingWindow, periods, volatility)

    const scaledReturnsLimited = scaledReturns.map((value) => (value ? Math.min(value, 1) : 0))

    const cumulativeReturnsScaled = calculateCumulativeReturns(
      data1PercentageChange.map((returnValue, index) => returnValue * scaledReturnsLimited[index]),
    )

    const cumulativeReturnsScaledSliced = cumulativeReturnsScaled.slice(
      rollingWindow - 1,
      cumulativeReturnsScaled.length,
    )

    cumulativeReturnsScaledSliced[0] = 1

    const data2PercentageChange = pct_change(seriesData2Filtered)
    const cumulativeReturns = calculateCumulativeReturns(data2PercentageChange)
    cumulativeReturns.unshift(1)

    const lineSeries1 = chartInstance.current?.addLineSeries({
      color: themeColors?.carmesi,
      priceScaleId: 'left',
    })

    const chartDataPrice1: PriceChartData[] = cumulativeReturnsScaledSliced.map((data, index) => ({
      time: formatDate(datesFiltered[index]) as Time,
      value: data * 100,
    }))

    lineSeries1?.setData(chartDataPrice1)

    const lineSeries2 = chartInstance.current?.addLineSeries({
      color: themeColors?.white,
      priceScaleId: 'left',
    })

    const chartDataPrice2: PriceChartData[] = cumulativeReturns.map((data, index) => ({
      time: formatDate(datesFiltered[index]) as Time,
      value: data * 100,
    }))

    if (!showCandle) {
      lineSeries2?.setData(chartDataPrice2)
    }

    const candlestickSeries = chartInstance.current?.addCandlestickSeries({
      priceScaleId: 'left',
    })

    const candlestickData: OHLCChartData[] = ohclFiltered.map((data, index) => ({
      time: formatDate(datesFiltered[index]) as Time,
      open: data[0],
      high: data[1],
      low: data[2],
      close: data[3],
    }))

    if (showCandle) {
      candlestickSeries?.setData(candlestickData)
    }

    const visibleRange = {
      from: formatDate(datesFiltered[0]) as Time,
      to: formatDate(datesFiltered[datesFiltered.length - 1]) as Time,
    }

    initialVisibleRange.current = visibleRange
    chartInstance.current?.timeScale().setVisibleRange(visibleRange)

    const toolTip = document.createElement('div')

    Object.assign(toolTip.style, {
      height: '400px',
      ...tooltipConfig,
    })

    toolTip.style.background = hexToRGBA(themeColors?.white as string, 0.1)
    toolTip.style.color = 'var(--color-white)'

    chartContainerRef.current?.appendChild(toolTip)

    chartInstance.current?.subscribeCrosshairMove((param) => {
      if (
        param.point === undefined ||
        !param.time ||
        param.point.x < 0 ||
        param.point.x > (chartContainerRef.current?.clientWidth ?? 0) ||
        param.point.y < 0 ||
        param.point.y > (chartContainerRef.current?.clientHeight ?? 0)
      ) {
        toolTip.style.display = 'none'
      } else {
        toolTip.style.display = 'block'
        const dateStr = formatDateAmerican(param.time)
        console.log(param.time)
        const data1 = lineSeries1
          ? (param.seriesData.get(lineSeries1) as { value?: number; close?: number })
          : undefined
        const rocScaled = data1?.value !== undefined ? data1.value : data1?.close
        const data2 = lineSeries2
          ? (param.seriesData.get(lineSeries2) as { value?: number; close?: number })
          : undefined
        const rocCumulative = data2?.value !== undefined ? data2.value : data2?.close

        if (!showCandle && rocCumulative !== undefined && rocScaled !== undefined) {
          if (rocScaled > rocCumulative) {
            toolTip.innerHTML = `<div style="color: var(--color-white)">${coin}</div>
          <div>
            <p style="font-size: 10px; margin: 4px 0px; color: var(--color-carmesi); font-weight: bold;">
            Vol Scaled: ${(rocScaled / 100)?.toFixed(2)}</p>
            <p style="font-size: 10px; margin: 4px 0px; color: var(--color-white); font-weight: bold;">
            Raw Price: ${(rocCumulative / 100)?.toFixed(2)}</p>
          </div>
          <div style="position: absolute; bottom: 0; left: 0; width: 100%; background-color: var(--color-darkness); color: var(--color-white); text-align: center; padding-top: 4px; padding-bottom: 8px;">
            ${dateStr}
          </div>`
          } else {
            toolTip.innerHTML = `<div style="color: var(--color-white)">${coin}</div>
          <div>
            <p style="font-size: 10px; margin: 4px 0px; color: var(--color-white); font-weight: bold;">
            Raw Price: ${(rocCumulative / 100)?.toFixed(2)}</p>
            <p style="font-size: 10px; margin: 4px 0px; color: var(--color-carmesi); font-weight: bold;">
            Vol Scaled: ${(rocScaled / 100)?.toFixed(2)}</p>
          </div>
          <div style="position: absolute; bottom: 0; left: 0; width: 100%; background-color: var(--color-darkness); color: var(--color-white); text-align: center; padding-top: 4px; padding-bottom: 8px;">
            ${dateStr}
          </div>`
          }
        } else if (showCandle) {
          const candlestick = candlestickSeries
            ? (param.seriesData.get(candlestickSeries) as {
              open?: number
              high?: number
              low?: number
              close?: number
            })
            : undefined
          if (candlestick) {
            const { open, high, low, close } = candlestick
            toolTip.innerHTML = `<div style="color: var(--color-white)">${coin}</div>
            <div>
              <p style="font-size: 10px; margin: 4px 0px; color: lightblue; font-weight: bold;">
              O: ${open?.toFixed(4)}</p>
              <p style="font-size: 10px; margin: 4px 0px; color: lightgreen; font-weight: bold;">
              H: ${high?.toFixed(4)}</p>
              <p style="font-size: 10px; margin: 4px 0px; color: salmon; font-weight: bold;">
              L: ${low?.toFixed(4)}</p>
              <p style="font-size: 10px; margin: 4px 0px; color: gold; font-weight: bold;">
              C: ${close?.toFixed(4)}</p>
            </div>
            <div style="position: absolute; bottom: 0; left: 0; width: 100%; background-color: var(--color-darkness); color: var(--color-white); text-align: center; padding-top: 4px; padding-bottom: 8px;">
              ${dateStr}
            </div>`
          }
        }

        let left = param.point.x as number
        const timeScaleWidth = chartInstance.current?.timeScale().width() ?? 0
        const priceScaleWidth = chartInstance.current?.priceScale('left').width() ?? 0
        const halfTooltipWidth = toolTipWidth / 2
        left += priceScaleWidth - halfTooltipWidth
        left = Math.min(left, priceScaleWidth + timeScaleWidth - toolTipWidth)
        left = Math.max(left, priceScaleWidth)

        toolTip.style.left = left + 'px'
        toolTip.style.top = '0px'
      }
    })

    if (lineSeries1) {
      lineSeries1.createPriceLine({ ...zeroLine, color: hexToRGBA(themeColors?.white as string, 0.25) })
    }

    if (candlestickSeries) {
      candlestickSeries.createPriceLine({ ...zeroLine, color: hexToRGBA(themeColors?.white as string, 0.25) })
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.remove()
        toolTip.style.display = 'none'
        chartInstance.current = undefined
      }
    }
  }, [
    coin,
    dates,
    ohcl,
    rollingWindow,
    seriesData1,
    seriesData2,
    showCandle,
    studyCase,
    volatility,
    window,
    themeColors,
  ])

  if (coin == 'PEPE' && studyCase == 1) {
    return (
      <div className="w-full h-[400px] flex justify-center items-center">
        <div className="text-center">
          <p>NO DATA</p>
          <p className="text-carmesi">please choose other parameters</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="absolute top-0 left-[4vw]  w-full">
        <div className="flex items-center space-x-2">
          <div className="w-[2vw] h-1 bg-white"></div>
          <span className="text-sm">
            {coin.substring(0, coin.indexOf(' ')) ? coin.substring(0, coin.indexOf(' ')) : coin} - Raw Price
          </span>
        </div>
        <div className="flex items-center space-x-2 w-fit">
          <div className="w-[2vw] h-1 bg-carmesi"></div>
          <p className="text-carmesi text-sm">
            {coin.substring(0, coin.indexOf(' ')) ? coin.substring(0, coin.indexOf(' ')) : coin}
            {pro ? ' - Volatility Scaled' : ' - Low Volatility'}
          </p>
        </div>
      </div>
      <div ref={chartContainerRef} style={{ width: '100%', height: '100%', position: 'relative', marginTop: '20px' }} />
    </div>
  )
}

export default RoC
