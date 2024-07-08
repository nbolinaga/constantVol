import type { ReactNode } from 'react'
import { useState, createContext } from 'react'

interface OptionsContextType {
  coin: string
  setCoin: React.Dispatch<React.SetStateAction<string>>
  rollingWindow: number
  setRollingWindow: React.Dispatch<React.SetStateAction<number>>
  window: number
  setWindow: React.Dispatch<React.SetStateAction<number>>
  volatility: number
  setVolatility: React.Dispatch<React.SetStateAction<number>>
  showCandle: boolean
  setShowCandle: React.Dispatch<React.SetStateAction<boolean>>
  studyCase: number
  setStudyCase: React.Dispatch<React.SetStateAction<number>>
}

export const OptionsContext = createContext<OptionsContextType>({
  coin: 'BTC - High Vol',
  setCoin: () => { },
  rollingWindow: 14,
  setRollingWindow: () => { },
  window: 365,
  setWindow: () => { },
  volatility: 0.2,
  setVolatility: () => { },
  showCandle: false,
  setShowCandle: () => { },
  studyCase: 1,
  setStudyCase: () => { },
})



const AppProviders = ({ children }: { children: ReactNode | ReactNode[] }) => {
  const [coin, setCoin] = useState<string>('BTC - High Vol')
  const [rollingWindow, setRollingWindow] = useState<number>(14)
  const [window, setWindow] = useState<number>(365)
  const [volatility, setVolatility] = useState<number>(0.2)
  const [showCandle, setShowCandle] = useState<boolean>(false)
  const [studyCase, setStudyCase] = useState<number>(1)

  return (

    <OptionsContext.Provider
      value={{
        coin,
        setCoin,
        rollingWindow,
        setRollingWindow,
        window,
        setWindow,
        volatility,
        setVolatility,
        showCandle,
        setShowCandle,
        studyCase,
        setStudyCase,
      }}
    >{children}
    </OptionsContext.Provider>
  )
}

export default AppProviders
