const fs = require('fs');
const path = './file_json.json';

// Read and parse JSON data
const jsonData = JSON.parse(fs.readFileSync(path, 'utf8'));

// Extract n and k from the keys object
const n = jsonData.keys.n;
const m = jsonData.keys.k - 1;
const k = m + 1;

let xPoints = [];
let yPoints = [];

// Only the first k points
Object.keys(jsonData).forEach((key) => {
  if (key !== 'keys') {
    const baseValue = parseInt(jsonData[key].base);
    const value = jsonData[key].value;
    const y = parseInt(value, baseValue);

    xPoints.push(parseInt(key));
    yPoints.push(y);
  }
});

// Minimum degree require
xPoints = xPoints.slice(0, k);
yPoints = yPoints.slice(0, k);

console.log('xPoints:', xPoints);
console.log('yPoints:', yPoints);

// lagrange's Basic polynomial
function lagrangeBasisCoefficients(i, xPoints) {
  const n = xPoints.length;
  let result = [1]; // "1"

  for (let j = 0; j < n; j++) {
    if (j !== i) {
      result = multiplyPolynomials(result, [-xPoints[j], 1]);
      result = result.map((coef) => coef / (xPoints[i] - xPoints[j]));
    }
  }

  return result;
}

function multiplyPolynomials(poly1, poly2) {
  const result = new Array(poly1.length + poly2.length - 1).fill(0);

  for (let i = 0; i < poly1.length; i++) {
    for (let j = 0; j < poly2.length; j++) {
      result[i + j] += poly1[i] * poly2[j];
    }
  }

  return result;
}

// Lagrange Interpolation
function lagrangeInterpolationCoefficients(xPoints, yPoints) {
  const n = xPoints.length;
  let finalCoefficients = new Array(n).fill(0);

  for (let i = 0; i < n; i++) {
    const basisCoefficients = lagrangeBasisCoefficients(i, xPoints);
    for (let j = 0; j < basisCoefficients.length; j++) {
      finalCoefficients[j] += yPoints[i] * basisCoefficients[j];
    }
  }

  return finalCoefficients.reverse();
}

let coefficients = lagrangeInterpolationCoefficients(xPoints, yPoints);
console.log('Polynomial Coefficients:', coefficients);

const constantTerm = coefficients[coefficients.length - 1];
console.log('Constant Term (P(0)):', constantTerm);
