let inputArr = Array.from(Array(10)).map((_) => Math.floor(Math.random() * 10));

const partition = (inputArr, start, end) => {
  const pivot = inputArr[end];
  let comparisonIdx = start;
  for (let i = start; i < end; i++) {
    if (inputArr[i] <= pivot) {
      [inputArr[i], inputArr[comparisonIdx]] = [
        inputArr[comparisonIdx],
        inputArr[i],
      ];
      comparisonIdx++;
    }
  }
  [inputArr[comparisonIdx], inputArr[end]] = [
    inputArr[end],
    inputArr[comparisonIdx],
  ];
  return comparisonIdx;
};

const quickSort = (inputArr, start, end) => {
  if (start < end) {
    const p = partition(inputArr, start, end);
    quickSort(inputArr, start, p - 1);
    quickSort(inputArr, p + 1, end);
  }
};
console.log(inputArr);
quickSort(inputArr, 0, inputArr.length - 1);
console.log(inputArr);
