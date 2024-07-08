import React, { useContext } from 'react'

import { OptionsContext } from '@/components/AppProviders'

import Select from '../Select'

const coins = ['BTC', 'ETH', 'PEPE']

const CoinSelect = () => {
  const { coin, setCoin } = useContext(OptionsContext)

  return <Select handleChange={(e) => setCoin(e.target.value)} value={coin} options={coins} />
}

export default CoinSelect
