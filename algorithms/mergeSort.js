let inputArr = [4, 3, 8, 5, 9, 2, 5, 1, 7, 10, 8, 0, 3];

console.log(inputArr);

// <--- 1 ---->
// function merge(left, right) {
//   let arr = [];
//   while (left.length && right.length) {
//     if (left[0] < right[0]) {
//       arr.push(left.shift());
//     } else {
//       arr.push(right.shift());
//     }
//   }
//   while (left.length) {
//     arr.push(left.shift());
//   }
//   while (right.length) {
//     arr.push(right.shift());
//   }
//   return arr;
// }

// function mergeSort(arr) {
//   if (arr.length < 2) {
//     return arr;
//   }
//   const mid = Math.floor(arr.length / 2);
//   const left = arr.slice(0, mid);
//   const right = arr.slice(mid);
//   return merge(mergeSort(left), mergeSort(right));
// }

// <--- 2 ---->
// const sort = (arr) => {
//   const numberOfElements = Math.ceil(inputArr.length / arr.length);
//   if(numberOfElements === 1) {
//     for(let i = 0; i < arr.length; i += numberOfElements * 2) {
//       const lenA = arr[i].length
//       const lenB = arr[i+1].length
//       let posA = 0
//       let posB = 0
//       if()
//     }
//   }
// };

// const mergeSort = (inputArr) => {
//   let size = 1;
//   let final = [];
//   // init size set for two elements as a pair
//   while (size <= inputArr.length) {
//     // max sectionsize capped at half the arr length
//     const output = [];
//     // sectionsArr
//     for (let i = 0; i < inputArr.length; i += size) {
//       output.push([]);
//       // for every section, push an empty array
//       for (let j = i; j - i < size; j++) {
//         // push elements into the section's array inside the output array
//         output[output.length - 1].push(inputArr[j]);
//       }
//     }
//     // sort the output here
//     // sort(output);
//     // set the inputArr equal to the sorted output
//     // double the size after all sections added
//     size *= 2;
//   }
//   console.log(final);
// };

// <---- 3 ---->
let z = 0;
const merge = (inputArr, start, mid, end) => {
  z++;
  setTimeout(() => {
    let start2 = mid + 1;
    if (inputArr[mid] <= inputArr[start2]) return;
    while (start <= mid && start2 <= end) {
      if (inputArr[start] <= inputArr[start2]) {
        start++;
      } else {
        const val = inputArr[start2];
        let idx = start2;
        while (idx !== start) {
          inputArr[idx] = inputArr[idx - 1];
          idx--;
        }
        inputArr[start] = val;
        start++;
        mid++;
        start2++;
      }
    }
    console.log(inputArr);
  }, 1000 * z);
};

const mergeSort = (inputArr, l, r) => {
  if (l < r) {
    const mid = Math.floor((l + r) / 2);
    mergeSort(inputArr, l, mid);
    mergeSort(inputArr, mid + 1, r);
    merge(inputArr, l, mid, r);
  }
};

mergeSort(inputArr, 0, inputArr.length - 1);
