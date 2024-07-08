import React, { useContext } from 'react'

import { OptionsContext } from '@/components/AppProviders'

import Card from '../Card'
import CaseStudies from './CaseStudies'
import CoinSelect from './CoinSelect'
import SetWindow from './SetWindow'
import ShowCandle from './ShowCandle'
import SetVolatility from './SetVolatility'
import SetRollingWindows from './SetRollingWindow'

const ChartOptions = ({ prices, guide = false }: { prices: number[][]; guide?: boolean }) => {
  const { volatility, rollingWindow, studyCase } = useContext(OptionsContext)
  const pro = true
  return (
    <>
      {/* DESKTOP */}
      <Card className="hidden | md:block w-full mb-[2vh] relative">
        <div className="flex justify-between items-center">
          <p className="text-greySmoke text-left text-sm">Asset:</p>
          <CoinSelect />
        </div>
        <div className="flex justify-between items-center mt-[1vh]">
          <p className="text-greySmoke text-left text-sm">Case Studies:</p>
          <CaseStudies />
        </div>
        <div className="flex justify-between items-center mt-[1vh]">
          <p className="text-greySmoke text-left text-sm">Days:</p>
          {studyCase == 0 && <SetWindow />}
          {studyCase == 1 && (
            <p className="px-[1vw] py-0.5 h-fit w-fit text-sm border  bg-smoke text-greySmoke text-left">04/01/2021</p>
          )}
          {studyCase == 2 && (
            <p className="px-[1vw] py-0.5 h-fit w-fit text-sm border  bg-smoke text-greySmoke text-left">10/01/2023</p>
          )}
        </div>
        {pro && (
          <>
            <div className="flex justify-between items-center mt-[1vh]">
              <p className="text-greySmoke text-left text-sm">Volatility:</p>
              <SetVolatility />
            </div>
            <div className="flex justify-between items-center mt-[1vh]">
              <p className="text-greySmoke text-left text-sm">Rolling Window:</p>
              <SetRollingWindows />
            </div>
          </>
        )}
      </Card>
    </>
  )
}

export default ChartOptions
