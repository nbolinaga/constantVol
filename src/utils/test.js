function rollingStd(arr, rollingWindow) {
  let rolling = [];
  for (let i = 0; i < arr.length; i++) {
    let start = Math.max(0, i - rollingWindow + 1);
    let end = i + 1
    let slice = arr.slice(start, end);
    rolling.push(slice);
  }

  for (let i = 0; i < rolling.length; i++) {

    if (rolling[i].length < rollingWindow) {
      rolling[i] = 0
      continue
    }

    rolling[i] = calculateStd(rolling[i])
  }
  return rolling;
}

function calculateStd(arr) {
  const mean = arr.reduce((acc, val) => acc + val, 0) / arr.length;
  const squaredDiffs = arr.map(val => (val - mean) ** 2);
  const variance = squaredDiffs.reduce((acc, val) => acc + val, 0) / (arr.length - 1);
  return Math.sqrt(variance);
}

// Example usage:
const data = [0, 1, 5, 2, 8]
const rolling_window = 2;
const periods_per_year = 365;
const stdResult = rollingStd(data, rolling_window);
// for (let i = 0; i < stdResult.length; i++) {
//   if (stdResult[i] != null) {
//     stdResult[i] *= Math.sqrt(periods_per_year);
//   }
// }

console.log(stdResult)
3

