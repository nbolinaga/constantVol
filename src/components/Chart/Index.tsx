'use client'
import dynamic from 'next/dynamic';
// import React, { useEffect, useState } from 'react'
import { pct_change, calculateScaledReturns, calculateCumulativeReturns, filterByDate, calculateRollingVol, calculateStd, calculateMean, safeRound, cummax, calculateRolling } from '@/utils/chartComputations'
import * as d3 from "d3"
import { Series, DataFrame } from 'pandas-js'

const Index = ({ period, dates, prices, window, volatility, onFinish, selectedCoin, hourly }: { period: Date[], dates: Date[], prices: number[], window: number, volatility: number, onFinish: Function, selectedCoin: string, hourly: boolean }) => {
  const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });
  const formatTime = d3.utcFormat("%B %d, %Y");

  const start = period[0] ? formatTime(period[0]) : null;
  const end = period[1] ? formatTime(period[1]) : null;

  const filter = filterByDate(prices, dates, start, end)
  const filteredPrices = filter[0]
  const filteredDates = filter[1]

  let periods_per_year = 365 * 24
  let rolling_window = window * 24

  if (!hourly) {
    periods_per_year = 365
    rolling_window = window
  }

  const target_vol = volatility

  const percentageChange = pct_change(filteredPrices)
  const scaledReturns = calculateScaledReturns(percentageChange, rolling_window, periods_per_year, target_vol);
  const cumulativeReturnsScaled = calculateCumulativeReturns(scaledReturns)
  const cumulativeReturns_ret = calculateCumulativeReturns(percentageChange)

  const rolled = calculateRolling(percentageChange, rolling_window)

  for (let i = 0; i < rolled.length; i++) {
    rolled[i] *= Math.sqrt(periods_per_year)
  }


  const oneDay = 24 * 60 * 60 * 1000;
  const years = Math.round(Math.abs((period[0] - period[1]) / oneDay)) / 365;

  const cum_max_raw = cummax(cumulativeReturns_ret)
  const cum_max_scaled = cummax(cumulativeReturnsScaled)

  const divided_raw = cumulativeReturns_ret.map((value, index) => {
    return value / cum_max_raw[index];
  });
  const divided_scaled = cumulativeReturnsScaled.map((value, index) => {
    return value / cum_max_scaled[index];
  });

  const subtracted_raw = divided_raw.map(value => value - 1);
  const subtracted_scaled = divided_scaled.map(value => value - 1);

  const absValues_raw = subtracted_raw.map(value => Math.abs(value));
  const absValues_scaled = subtracted_scaled.map(value => Math.abs(value));

  // const result_raw = absValues_raw.filter(value => !isNaN(value));
  // const result_scaled = absValues_scaled.filter(value => !isNaN(value));

  const sorted_raw = absValues_raw.sort((a, b) => b - a);
  const sorted_scaled = absValues_scaled.sort((a, b) => b - a);



  const newPerformance = {
    raw: {
      sharpe: safeRound((calculateMean(percentageChange) / calculateStd(percentageChange)) * Math.sqrt(periods_per_year), 2),
      cagr: safeRound((cumulativeReturns_ret[cumulativeReturns_ret.length - 1] ** (1 / years) - 1) * 100, 2),
      dd_max: `-${(sorted_raw[0] * 100).toFixed(1)}`,
    },
    scaled: {
      sharpe: safeRound((calculateMean(scaledReturns) / calculateStd(scaledReturns)) * Math.sqrt(periods_per_year), 2),
      cagr: safeRound((cumulativeReturnsScaled[cumulativeReturnsScaled.length - 1] ** (1 / years) - 1) * 100, 2),
      dd_max: `-${(sorted_scaled[0] * 100).toFixed(1)}`,
    }
  };

  onFinish(newPerformance)

  const trace = [
    {
      name: `${selectedCoin}USDT - ${volatility * 100}% volatility `,
      x: filteredDates.map((date: string | number | Date) => new Date(date)) as Date[],
      y: cumulativeReturnsScaled as number[],
      type: 'scatter',
      line: {
        color: '#21DDEA'
      }
    },
    {
      name: `${selectedCoin}USDT`,
      x: filteredDates.map((date: string | number | Date) => new Date(date)) as Date[],
      y: cumulativeReturns_ret as number[],
      type: 'scatter',
      line: {
        color: '#FF3699'
      }
    },
  ];

  const trace2 = [
    {
      name: `${selectedCoin}USDT`,
      x: filteredDates.map((date: string | number | Date) => new Date(date)) as Date[],
      y: rolled as number[],
      type: 'lines',
      line: {
        color: 'limegreen'
      }
    }
  ]

  const layout = {
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    legend: {
      font: {
        color: 'white'
      },
    },
    xaxis: {
      tickfont: {
        color: 'white'
      },
      gridcolor: '#201F31',
      dtick: 'M3',
    },
    yaxis: {
      tickfont: {
        color: 'white'
      },
      gridcolor: '#201F31'
    }
  };


  const layout2 = {
    title: {
      text: 'Rolling Volatility',
      font: {
        color: 'white'
      }
    },
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    legend: {
      font: {
        color: 'white'
      },
    },
    xaxis: {
      tickfont: {
        color: 'white'
      },
      gridcolor: '#201F31',
      dtick: 'M3',
    },
    yaxis: {
      tickfont: {
        color: 'white'
      },
      gridcolor: '#201F31'
    }
  };

  return (
    <div className='h-screen bg-[#151515] pt-10'>
      <Plot
        className='w-full'
        data={trace as any}
        layout={layout as any}
        config={{ displayModeBar: false, displaylogo: false, responsive: true }}
      />
      <Plot
        className='w-full'
        data={trace2 as any}
        layout={layout2 as any}
        config={{ displayModeBar: false, displaylogo: false, responsive: true }}
      />
    </div>

  )
}

export default Index