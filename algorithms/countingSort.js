// generating array(10) of 0-9
let inputArr = Array.from(Array(10)).map((_) => Math.floor(Math.random() * 10));
// generating array(10) of just 0s
let countArr = Array.from(Array(10)).map((_) => 0);
// counting the occurances
inputArr.forEach((i) => ++countArr[i]);
// summing up
let sumArr = [...countArr];
sumArr.forEach((i, idx, arr) => (arr[idx] += idx !== 0 ? arr[idx - 1] : 0));
// right shifting - this is not required for only number sorting
// for (let i = sumArr.length - 1; i >= 0; i--) {
//   if (i === 0) {
//     sumArr[i] = 0;
//   } else {
//     sumArr[i] = sumArr[i - 1];
//   }
// }
console.log(inputArr);
let sortedArr = [];
for (let i = 0; i < sumArr.length; i++) {
  if (countArr[i] === 0) {
    continue;
  }
  while (countArr[i] > 0) {
    sortedArr.push(i);
    countArr[i]--;
  }
}
console.log(sortedArr);
