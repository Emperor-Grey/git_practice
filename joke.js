const fs = require('fs');
const path = './test_case.json';

// Read and parse JSON data
const jsonData = JSON.parse(fs.readFileSync(path, 'utf8'));

const n = jsonData.keys.n;
const k = jsonData.keys.k;

let xPoints = [];
let yPoints = [];

// Finding x and y
Object.keys(jsonData).forEach((key) => {
  if (key !== 'keys') {
    const baseValue = parseInt(jsonData[key].base);
    const value = jsonData[key].value;
    const y = parseInt(value, baseValue);

    xPoints.push(parseInt(key));
    yPoints.push(y);
  }
});

// Only  first k points (Minimum)
xPoints = xPoints.slice(0, k);
yPoints = yPoints.slice(0, k);

console.log('xPoints:', xPoints);
console.log('yPoints:', yPoints);

// matrix for polynomial coefficients
function createMatrix(xPoints) {
  const n = xPoints.length;
  let matrix = [];

  for (let i = 0; i < n; i++) {
    let row = [];
    for (let j = n - 1; j >= 0; j--) {
      row.push(Math.pow(xPoints[i], j));
    }
    matrix.push(row);
  }

  return matrix;
}

// Gauss Elimination
function gaussElimination(matrix, yPoints) {
  const n = matrix.length;

  // Forward elimination
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const factor = matrix[j][i] / matrix[i][i];
      for (let k = 0; k < n; k++) {
        matrix[j][k] -= factor * matrix[i][k];
      }
      yPoints[j] -= factor * yPoints[i];
    }
  }

  // Back substitution
  let coefficients = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let sum = yPoints[i];
    for (let j = i + 1; j < n; j++) {
      sum -= matrix[i][j] * coefficients[j];
    }
    coefficients[i] = sum / matrix[i][i];
  }

  return coefficients;
}

// Create the matrix for the points
let matrix = createMatrix(xPoints);

let coefficients = gaussElimination(matrix, yPoints);
console.log('Polynomial Coefficients:', coefficients);

const constantTerm = coefficients[coefficients.length - 1];
console.log('Constant Term (c):', constantTerm);
