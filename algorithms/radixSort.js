let inputArr = Array.from(Array(10)).map((_) =>
  Math.floor(Math.random() * 900)
);

const maxElementDigits = inputArr
  .reduce((retVal, curVal) => (curVal >= retVal ? curVal : retVal), -1)
  .toString().length;

const generateStringifiedNum = (number, length) => {
  let stringifiedNumber = number.toString();
  while (stringifiedNumber.length < length) {
    stringifiedNumber = `0${stringifiedNumber}`;
  }
  return stringifiedNumber;
};

let countArr = Array.from(Array(10)).map((_) => []);

for (let i = maxElementDigits - 1; i >= 0; i--) {
  // const i = maxElementDigits - 1
  for (let j = 0; j < inputArr.length; j++) {
    const digit = parseInt(
      generateStringifiedNum(inputArr[j], maxElementDigits).charAt(i)
    );
    countArr[digit].push(inputArr[j]);
  }
  let sortedArr = [];
  countArr.forEach((digitArr) => {
    while (digitArr.length > 0) {
      sortedArr.push(digitArr.shift());
    }
  });
  console.log(sortedArr, `digit: ${i}`);
  inputArr = [...sortedArr];
}
