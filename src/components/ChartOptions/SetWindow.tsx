import React, { useContext } from 'react'

import { OptionsContext } from '@/components/AppProviders'

import Select from '../Select'

const dates = [365, 90, 60, 30]

const SetWindow = () => {
  const { window, setWindow } = useContext(OptionsContext)

  return <Select handleChange={(e) => setWindow(parseFloat(e.target.value))} value={window} options={dates} />
}

export default SetWindow
