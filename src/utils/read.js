const fs = require('fs');

function readFileAndExtractNumbers(fileName) {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      const lines = data.trim().split('\n');
      const numbersArray = lines.map(line => {
        const index = line.indexOf(' ');
        if (index !== -1) {
          const numberString = line.substring(index + 1).trim();
          return parseFloat(numberString);
        }
      }).filter(number => number !== undefined);
      resolve(numbersArray);
    });
  });
}

function writeArrayToJsonFile(array, fileName) {
  return new Promise((resolve, reject) => {
    const jsonContent = JSON.stringify(array, null, 2);
    fs.writeFile(fileName, jsonContent, 'utf8', (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

// Example usage:
const inputFileName = 'src/utils/numbers .txt'; // Change 'your_input_file.txt' to the name of your input text file
const outputFileName = 'output.json'; // Change 'output.json' to the desired name of your output JSON file

readFileAndExtractNumbers(inputFileName)
  .then(numbersArray => {
    return writeArrayToJsonFile(numbersArray, outputFileName);
  })
  .then(() => {
    console.log('Array written to JSON file successfully.');
  })
  .catch(error => {
    console.error('Error:', error);
  });
