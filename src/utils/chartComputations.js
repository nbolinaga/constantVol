export function pct_change(data, periods = 1) {
  const percentageChanges = [];
  let startIndex = 0;

  while (startIndex < data.length && !Number.isFinite(data[startIndex])) {
    startIndex++;
  }

  for (let i = startIndex + 1; i < data.length; i++) {
    const previous = data[i - 1];
    const current = data[i];
    if (!Number.isFinite(previous) || !Number.isFinite(current)) {
      continue;
    }
    const percentageChange = ((current - previous) / Math.abs(previous));
    percentageChanges.push(percentageChange);
  }
  return percentageChanges;
}

function calculateRollingStd(arr, rollingWindow) {
  let rollingStd = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == null) {
      rollingStd.push(null);
      continue;
    }
    let start = Math.max(0, i - rollingWindow + 1);
    let end = i + 1;
    let slice = arr.slice(start, end);
    let std = null;
    if (slice.length >= rollingWindow) {
      std = calculateStd(slice);
      rollingStd.push(std);
    } else {
      rollingStd.push(null);
    }

  }
  return rollingStd;
}

export function calculateStd(arr) {
  if (arr == null) {
    return
  }
  const mean = arr.reduce((acc, val) => acc + val, 0) / arr.length;
  const squaredDiffs = arr.map(val => (val - mean) ** 2);
  const variance = squaredDiffs.reduce((acc, val) => acc + val, 0) / (arr.length - 1);
  return Math.sqrt(variance);
}

function shiftArray(arr, shiftAmount) {
  let shiftedArray = [];
  for (let i = 0; i < arr.length; i++) {
    if (i < shiftAmount) {
      shiftedArray.push(null); // Fill with null for the shifted positions
    } else {
      shiftedArray.push(arr[i - shiftAmount]);
    }
  }
  return shiftedArray;
}

function calculateScaledReturn(arr, shifted, periodsPerYear, targetVol) {
  const scaled_return = [];
  const squared = Math.sqrt(periodsPerYear);
  for (let i = 0; i < arr.length; i++) {
    if (shifted[i] !== null && arr[i] !== null) {
      const scaledValue = (arr[i] / (shifted[i] * squared)) * targetVol;
      scaled_return.push(scaledValue);
    } else {
      scaled_return.push(null);
    }
  }
  return scaled_return;
}

export function calculateScaledReturns(data, rollingWindow, periodsPerYear, targetVol) {
  const rolling_std = calculateRollingStd(data, rollingWindow);
  const shifted_rolling_std = shiftArray(rolling_std, 1);
  const scaled_return = calculateScaledReturn(data, shifted_rolling_std, periodsPerYear, targetVol)
  return scaled_return;
}

export function filterByDate(data, dates, startDate, endDate) {
  var startIndex = 0
  var endIndex = data.length

  for (let i = 0; i < dates.length; i++) {
    if (dates[i] == startDate) {
      startIndex = i
      break
    }
  }

  for (let i = startIndex; i < dates.length; i++) {
    if (dates[i] == endDate) {
      endIndex = i
      break
    }
  }

  dates = dates.slice(startIndex, endIndex + 1)
  data = data.slice(startIndex, endIndex + 1)

  endIndex = data.length

  for (let i = 0; i < dates.length; i++) {
    if (data[i] != 0) {
      startIndex = i
      break
    }
  }

  dates = dates.slice(startIndex, endIndex + 1)
  data = data.slice(startIndex, endIndex + 1)

  return [data, dates];
}

export function calculateCumulativeReturns(data) {
  const cumulativeReturns = [];
  let cumulativeProduct = 1;

  for (const numer of data) {
    if (numer !== 0) {
      cumulativeProduct *= 1 + numer;
      break
    }
  }

  for (let i = 0; i < data.length; i++) {
    let num = data[i]
    if (num == null || num == undefined) num = 0
    cumulativeProduct *= (num) + 1;
    cumulativeReturns.push(cumulativeProduct);
  }

  return cumulativeReturns;
}

export function calculateRolling(data, rollingWindow) {
  let rollingStd = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i] == null) {
      rollingStd.push(null);
      continue;
    }
    let start = Math.max(0, i - rollingWindow + 1);
    let end = i + 1;
    let slice = data.slice(start, end);
    rollingStd.push(slice);
  }
  for (let i = 0; i < rollingStd.length; i++) {
    rollingStd[i] = calculateStd(rollingStd[i])
  }
  return rollingStd;
}


export function calculateRollingVol(data, rollingWindow, periodsPerYear) {
  let rolling = [];
  for (let i = 0; i < data.length; i++) {
    let start = Math.max(0, i - rollingWindow + 1);
    let end = i + 1
    let slice = data.slice(start, end);
    rolling.push(slice);
  }

  for (let i = 0; i < rolling.length; i++) {
    if (rolling[i].length < rollingWindow) {
      rolling[i] = 0
      continue
    }

    rolling[i] = calculateStd(rolling[i])
  }

  for (let i = 0; i < rolling.length; i++) {
    rolling[i] *= Math.sqrt(periodsPerYear)
  }

  return rolling;
}

export function calculateMean(arr) {
  const sum = arr.reduce((acc, val) => acc + val, 0);
  const mean = sum / arr.length;

  return mean;
}

export function safeRound(value, precision) {
  if (isNaN(value)) {
    return NaN; // Handle case where value is NaN
  }
  return Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision);
}

export function cummax(array) {
  if (array.length === 0) {
    return [];
  }

  let maxSoFar = array[0];
  const result = [maxSoFar];

  for (let i = 1; i < array.length; i++) {
    maxSoFar = Math.max(maxSoFar, array[i]);
    result.push(maxSoFar);
  }

  return result;
}