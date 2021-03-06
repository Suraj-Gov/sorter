import React, { useRef, useState } from "react";
import SortContainer from "./components/SortContainer";

interface props {}

const App: React.FC<props> = () => {
  const [inputArr, setInputArr] = useState(() =>
    Array.from(Array(30)).map((_) => Math.random() * 10)
  );
  const counter = useRef(0);

  // const swap = (j: number) => {
  //   setTimeout(() => {
  //     if (inputArr[j] > inputArr[j + 1]) {
  //       const temp = inputArr[j];
  //       inputArr[j] = inputArr[j + 1];
  //       inputArr[j + 1] = temp;
  //     }
  //     setInputArr([...inputArr]);
  //     console.log("hello");
  //   }, 500);
  // };

  const sort = () => {
    // for (let i = 0; i < inputArr.length - 1; i++) {
    //   for (let j = 0; j < inputArr.length - i - 1; j++) {
    //     swap(j);
    //   }
    // }
    let i = 0;
    let j = 0;
    const intervalId = setInterval(() => {
      if (i < inputArr.length - 1) {
        if (j < inputArr.length - i - 1) {
          console.log(counter.current++);

          if (inputArr[j] > inputArr[j + 1]) {
            const temp = inputArr[j];
            inputArr[j] = inputArr[j + 1];
            inputArr[j + 1] = temp;
          }
          setInputArr([...inputArr]);
          j++;
        } else {
          j = 0;
          i++;
        }
      } else clearInterval(intervalId);
    }, 50);
  };

  return (
    <div>
      <SortContainer inputArr={inputArr} />
      <button onClick={sort}>sort</button>
    </div>
  );
};

export default App;
