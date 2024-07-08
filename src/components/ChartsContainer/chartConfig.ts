import type { DeepPartial, LineWidth } from 'lightweight-charts'

export const lineChartConfig = {
  grid: {
    vertLines: {
      visible: false,
    },
    horzLines: {
      visible: false,
    },
  },
  rightPriceScale: {
    visible: false,
    borderVisible: false,
  },
  leftPriceScale: {
    mode: 1,
    visible: true,
    borderVisible: false,
  },
  timeScale: {
    visible: true,
    borderVisible: false,
    fixLeftEdge: true,
    tickMarkFormatter: (time: string | number | Date, locale: Intl.LocalesArgument) => {
      const date = new Date(time)
      return date.toLocaleDateString(locale, { month: 'short', day: 'numeric' })
    },
  },
  crosshair: {
    horzLine: {
      visible: false,
      labelVisible: false,
    },
    vertLine: {
      visible: true,
      style: 0,
      width: 2 as DeepPartial<LineWidth>,
      color: '#111111',
      labelVisible: false,
    },
  },
  localization: {
    dateFormat: "dd MMMM 'yy",
    priceFormatter: (price: number) => {
      return (price / 100).toFixed(2) // Append a string (e.g., currency symbol) to each value
    },
  },
  handleScroll: {
    mouseWheel: false,
    horzTouchDrag: false,
    vertTouchDrag: false,
  },
  handleScale: {
    mouseWheel: false,
  },
}

export const toolTipWidth = 96

export const tooltipConfig = {
  width: `${toolTipWidth}px`,
  position: 'absolute',
  display: 'none',
  padding: '8px',
  boxSizing: 'border-box',
  fontSize: '12px',
  textAlign: 'left',
  zIndex: '10',
  top: '12px',
  left: '12px',
  pointerEvents: 'none',
  fontFamily: '-apple-system, BlinkMacSystemFont, Montserrat, Roboto, Ubuntu, sans-serif',
  color: 'white',
}

export const zeroLine = {
  price: 100,
  color: 'white',
  lineWidth: 2 as LineWidth,
  lineStyle: 0,
  axisLabelVisible: false,
}
