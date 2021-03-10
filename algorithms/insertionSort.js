// make two parts, sorted on the left, which is empty and unsorted on the right, which is the initial array
// then the elements are picked from the unsorted part and are placed on the sorted part
// | 3 4 2 1 -> 3 | 4 2 1 -> 3 4 | 2 1 -> 2 3 4 | 1 -> 1 2 3 4 |

let inputArr = Array.from(Array(10)).map((_) =>
  Math.round(Math.random() * 10 + 1)
);

console.log(inputArr);

for (let i = 1; i < inputArr.length; i++) {
  let el = inputArr[i];
  let elPos = i;
  while (elPos > 0 && inputArr[elPos - 1] > el) {
    inputArr[elPos] = inputArr[--elPos];
  }
  inputArr[elPos] = el;
}

console.log(inputArr);
