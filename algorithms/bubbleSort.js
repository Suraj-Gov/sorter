// check if the first element is more than second element,
// if yes, swap them,

let inputArr = Array.from(Array(10)).map((_) =>
  Math.round(Math.random() * 10 + 1)
);

console.log(inputArr);

// sorting

for (let i = 0; i < inputArr.length; i++) {
  for (let j = 0; j < inputArr.length - i - 1; j++) {
    if (inputArr[j] > inputArr[j + 1]) {
      [inputArr[j], inputArr[j + 1]] = [inputArr[j + 1], inputArr[j]];
    }
  }
}

console.log(inputArr);
