const fs = require('fs');
const path = './test_case.json';

// Read and parse JSON data
const jsonData = JSON.parse(fs.readFileSync(path, 'utf8'));
// console.log(jsonData);

const { n, k } = jsonData.keys;
const m = k - 1; // Degree

let x = [];
let y = [];
// console.log(n, k);

Object.keys(jsonData).forEach((item) => {
  if (item !== 'keys') {
    // console.log(item);
    x.push(parseInt(item)); // Convert to integer directly
    const base = jsonData[item].base;
    const value = jsonData[item].value;

    //! Decode the y values
    const y_val = parseInt(value, base);
    // console.log(y);
    y.push(y_val);
  }
});

// console.log({ x, y });

//! Apply Gauss Elimination
x = x.slice(0, k);
y = y.slice(0, k);

// console.log({ x, y });

function mat_create(x) {
  let matrix = [];
  const length = x.length; // Use const for scope

  for (let i = 0; i < length; i++) {
    let row = [];
    for (let j = length - 1; j >= 0; j--) {
      row.push(Math.pow(x[i], j));
    }
    matrix.push(row);
  }
  return matrix;
}

// console.log(mat_create(x));

function gaussElimination(matrix, y) {
  //! Make the things below the diagonal to 0
  const length = matrix.length; // Use const for scope
  for (let i = 0; i < length; i++) {
    for (let j = i + 1; j < length; j++) {
      // console.log({ i, j }); //! Location
      const factor = matrix[j][i] / matrix[i][i];
      // console.log(factor);
      for (let k = 0; k < length; k++) {
        matrix[j][k] -= factor * matrix[i][k];
      }
      y[j] -= factor * y[i];
    }
  }

  //! Make the things calculate the a,b,c - co-effs
  let co_eff = new Array(length).fill(0); // Use length instead of n
  // console.log(co_eff);

  for (let i = length - 1; i >= 0; i--) {
    let sum = y[i]; //! Y values in sum
    // console.log(sum);
    for (let j = i + 1; j < length; j++) {
      // console.log(j);
      sum -= matrix[i][j] * co_eff[j];
      // console.log({ sum, j });
    }
    co_eff[i] = sum / matrix[i][i];
  }
  // console.log(co_eff);
  return co_eff;
}

const mat = mat_create(x);
const coefficients = gaussElimination(mat, y);

const constant_term = coefficients[coefficients.length - 1];
console.log('Constant Term (c):', constant_term);
