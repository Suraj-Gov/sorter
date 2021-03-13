let inputArr = Array.from(Array(10)).map((_) =>
  Math.floor(Math.random() * 10 + 1)
);
// in quick sort, a pivot is chosen at random
// then the array is sorted wrt pivot,
// elements lesser or equal to pivot will be to its left
// elements greater than pivot will be to its right

const quickSort = (inputArr, start, end) => {
  if (start < end) {
    // sorting wrt pivot part
    const pivot = inputArr[end];
    let pivotIdx = start;
    for (let i = pivotIdx; i < end; i++) {
      if (inputArr[i] <= pivot) {
        [inputArr[i], inputArr[pivotIdx]] = [inputArr[pivotIdx], inputArr[i]];
        // set here
        pivotIdx++;
      }
    }
    [inputArr[pivotIdx], inputArr[end]] = [inputArr[end], inputArr[pivotIdx]];
    // set here
    quickSort(inputArr, start, pivotIdx - 1);
    quickSort(inputArr, pivotIdx + 1, end);
  }
};

console.log(inputArr);
quickSort(inputArr, 0, inputArr.length - 1);
console.log(inputArr);
