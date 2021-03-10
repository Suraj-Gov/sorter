// consider a element to be the smallest, then check the rest of the array
// if you find a element even lesser than the smallest till the end of the array
// swap them

let inputArr = Array.from(Array(10)).map((_) =>
  Math.round(Math.random() * 10 + 1)
);

console.log(inputArr);

for (let i = 1; i < inputArr.length; i++) {
  let lowestPos = i - 1;
  let j = i;
  while (j < inputArr.length) {
    if (inputArr[j] < inputArr[lowestPos]) {
      lowestPos = j;
    }
    j++;
  }
  [inputArr[lowestPos], inputArr[i - 1]] = [
    inputArr[i - 1],
    inputArr[lowestPos],
  ];
}

console.log(inputArr);
