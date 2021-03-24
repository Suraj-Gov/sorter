const inputArr = Array.from(Array(100)).map((_) =>
  Math.floor(Math.random() * 100)
);
const sortedArr = [...inputArr].sort((a, b) => a - b);
let gap = Math.floor(inputArr.length / 2);
while (gap >= 1) {
  for (let i = 0; i < inputArr.length; i++) {
    const end = i + gap;
    if (end >= inputArr.length) {
      break;
    }
    const idxs = [];
    let j = (i + gap) % gap;
    while (j < inputArr.length) {
      idxs.push(j);
      j += gap;
    }
    // go from the end to the start of array
    for (let idx = idxs.length; idx > 0; idx--) {
      const b = idxs[idx];
      const a = idxs[idx - 1];
      if (b <= end) {
        if (inputArr[a] > inputArr[b]) {
          [inputArr[a], inputArr[b]] = [inputArr[b], inputArr[a]];
        }
      } else {
        continue;
      }
    }
  }
  gap = Math.floor(gap / 2);
}

console.log(inputArr.every((i, idx) => i === sortedArr[idx]));
