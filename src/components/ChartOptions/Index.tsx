import React, { useEffect, useState } from 'react';
import CoinSelect from './CoinSelect/Index';
import DatePicker from './DatePicker/Index';
import IntervalSelect from './IntervalSelect/Index';
import SetDays from './SetDays/Index';
import SetVolatility from './SetVolatility/Index';

const Index = ({
  coins, onSubmit
}:
  {
    coins: string[],
    onSubmit: Function
  }) => {
  const [coin, setCoin] = useState<string>('ADA');
  const [interval, setInterval] = useState<string>('Daily');
  const [start, setStart] = useState<Date>(new Date('2020-01-01'));
  const [end, setEnd] = useState<Date>(new Date());
  const [volatility, setVolatility] = useState<number>(0.1);
  const [days, setDays] = useState<number>(2);

  useEffect(() => {
    // Define the debouncing function
    const debounceSubmit = setTimeout(() => {
      const data = {
        coin,
        interval,
        start,
        end,
        volatility,
        days
      };
      onSubmit(data);
    }, 500); // Adjust debounce time as needed

    // Cleanup function to clear the timeout when any input changes
    return () => clearTimeout(debounceSubmit);
  }, [coin, days, end, interval, onSubmit, start, volatility]);

  return (
    <div className='absolute top-0 left-0 w-screen h-[10vh] flex justify-between px-20 py-10'>
      <div className='flex justify-start space-x-4'>
        <CoinSelect coins={coins} setCoin={setCoin} />
        <IntervalSelect setInterval={setInterval} />
        <SetDays days={days} setDays={setDays} />
        <SetVolatility volatility={volatility} setVolatility={setVolatility} />
      </div>
      <h1 className='text-xl font-bold m-3'>The Bear Protocol - Constant Volatility</h1 >
      <div>
        <DatePicker startDate={start} endDate={end} setStartDate={setStart} setEndDate={setEnd} />
      </div>
    </div>
  )
}

export default Index;
