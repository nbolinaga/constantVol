'use client'
import { SetStateAction, useEffect, useState } from 'react';
import ChartOptions from '@/components/ChartOptions/Index';
import Chart from '@/components/Chart/Index';
import * as d3 from "d3"
import { timeParse } from 'd3-time-format';

interface CoinData {
  [key: string]: string | Date | null;
}

interface Performance {
  raw: {
    sharpe: number,
    cagr: number,
    dd_max: number,
  },
  scaled: {
    sharpe: number,
    cagr: number,
    dd_max: number,
  }
}

const Index = () => {
  const [daily, setDaily] = useState<CoinData[]>([]);
  const [hourly, setHourly] = useState<CoinData[]>([]);
  const [coin, setCoin] = useState<string>('ADA');
  const [interval, setInterval] = useState<string>('Daily');
  const [start, setStart] = useState<Date>(new Date('2020-01-01'));
  const [end, setEnd] = useState<Date>(new Date());
  const [days, setDays] = useState<number>(2);
  const [volatility, setVolatility] = useState<number>(0.1);
  const [rawSharpe, setRawSharpe] = useState<number>(0);
  const [rawCAGR, setRawCAGR] = useState<number>(0);
  const [rawDDMax, setRawDDMax] = useState<number>(0);
  const [scaledSharpe, setScaledSharpe] = useState<number>(0);
  const [scaledCAGR, setScaledCAGR] = useState<number>(0);
  const [scaledDDMax, setScaledDDMax] = useState<number>(0);

  useEffect(() => {
    if (daily.length === 0) {
      const fetchDailyData = async () => {
        try {
          const parsedData = await d3.csv('/daily_prices_for_jesus.csv')

          const parseDate = timeParse("%Y-%m-%d");
          const formatTime = d3.utcFormat("%B %d, %Y");

          const transformedData = parsedData.map(obj => {
            const { ['']: dateString, ...rest } = obj;
            const date = dateString ? parseDate(dateString) : null;
            const formattedDate = date ? formatTime(date) : null;
            return { date: formattedDate, ...rest };
          });

          setDaily(transformedData);

        } catch (error) {
          console.error('Error fetching daily data:', error);
        }
      };

      fetchDailyData();
    }
    if (hourly.length === 0) {
      const fetchHourlyData = async () => {
        try {
          const parsedData = await d3.csv('/HourlCandles.csv')

          const parseDate = timeParse("%Y-%m-%d");
          const formatTime = d3.utcFormat("%B %d, %Y");

          const transformedData = parsedData.map(obj => {
            const { ['']: dateString, ...rest } = obj;
            const date = dateString ? parseDate(dateString) : null;
            const formattedDate = date ? formatTime(date) : null;
            return { date: formattedDate, ...rest };
          });

          setHourly(transformedData);
        } catch (error) {
          console.error('Error fetching daily data:', error);
        }
      };

      fetchHourlyData();
    }
  }, [daily, hourly]);


  const coinNames: string[] = daily.reduce<string[]>((acc, obj) => {
    const keys = Object.keys(obj).filter(key => key !== 'date');
    return [...acc, ...keys];
  }, []);

  const uniqueCoinNames = Array.from(new Set(coinNames));
  const uniqueCoinNamesShort = uniqueCoinNames.map(coin => coin.slice(0, -4));

  const dates: Date[] = daily.map(obj => obj.date).filter(date => date !== null) as Date[];
  const datesHourly: Date[] = hourly.map(obj => obj.date).filter(date => date !== null) as Date[];

  const dailyPrices = (coinName: string): number[] => {
    return daily.map(obj => {
      const value = obj[coinName];
      if (typeof value === 'string') {
        return parseFloat(value) || 0;
      } else {
        return 0;
      }
    });
  };

  const hourlyPrices = (coinName: string): number[] => {
    return hourly.map(obj => {
      const value = obj[coinName];
      if (typeof value === 'string') {
        return parseFloat(value) || 0;
      } else {
        return 0;
      }
    });
  };

  const onChange = (data: Performance) => {
    setRawSharpe(data.raw.sharpe)
    setScaledSharpe(data.scaled.sharpe)
    setRawCAGR(data.raw.cagr)
    setScaledCAGR(data.scaled.cagr)
    setRawDDMax(data.raw.dd_max)
    setScaledDDMax(data.scaled.dd_max)
  }

  const submit = (data: { coin: SetStateAction<string>; interval: SetStateAction<string>; end: SetStateAction<Date>; start: SetStateAction<Date>; volatility: SetStateAction<number>; days: SetStateAction<number>; }) => {
    setCoin(data.coin)
    setInterval(data.interval)
    setEnd(data.end)
    setStart(data.start)
    setVolatility(data.volatility)
    setDays(data.days)
  }

  return (
    <>
      <div className="relative col-span-1 space-y-3 w-screen h-screen">
        <div className='absolute top-0 left-0 w-fit z-10 text-white space-x-3 space-y-3 text-right'>
          <ChartOptions coins={uniqueCoinNamesShort} onSubmit={submit} />
        </div>

        <div className='absolute top-0 translate-y-[50vh] right-10 w-fit z-10 text-white space-x-3 space-y-3 text-right'>
          <h2 className='text-xl font-bold mb-4'>Rebalancing Results</h2>
          <p>Rebalancing <b>{coin}</b> - <b>{interval}</b>  for <b>{volatility}</b> volatility <b>{days}</b> day lookback window</p>
          <p>Sharpe Ratio, Raw: <b>{rawSharpe}</b> Constant Volatility: <b>{scaledSharpe}</b></p>
          <p>CAGR, Raw: <b>{rawCAGR}%</b> Constant Volatility: <b>{scaledCAGR}%</b></p>
          <p>Largest Drawdown, Raw: <b>{rawDDMax}%</b> Constant Volatility: <b>{scaledDDMax}%</b></p>
        </div>
      </div>
      <div className='absolute top-0 right-0 w-screen h-screen'>
        {interval == 'Daily' &&
          <Chart period={[start, end]} dates={dates} prices={dailyPrices(`${coin}USDT`)} window={days} volatility={volatility} onFinish={onChange} selectedCoin={coin} hourly={false} />
        }
        {interval == 'Hourly' &&
          <Chart period={[start, end]} dates={datesHourly} prices={hourlyPrices(`${coin}USDT`)} window={days} volatility={volatility} onFinish={onChange} selectedCoin={coin} hourly={true} />
        }
      </div>
    </>
  );
};

export default Index;
