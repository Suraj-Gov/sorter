let inputArr = Array.from(Array(10)).map((_) => Math.floor(Math.random() * 10));

console.log(inputArr);

function merge(left, right) {
  let arr = [];
  while (left.length && right.length) {
    if (left[0] < right[0]) {
      arr.push(left.shift());
    } else {
      arr.push(right.shift());
    }
  }
  while (left.length) {
    arr.push(left.shift());
  }
  while (right.length) {
    arr.push(right.shift());
  }
  return arr;
}

function mergeSort(arr) {
  if (arr.length < 2) {
    return arr;
  }
  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);
  return merge(mergeSort(left), mergeSort(right));
}

console.log(mergeSort(inputArr));
