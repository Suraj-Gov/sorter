import React, { useEffect, useRef, useState } from "react";
import SortContainer from "./components/SortContainer";

interface props {}

export interface InputArr {
  id: number;
  val: number;
}

const App: React.FC<props> = () => {
  const initialInputArr = useRef<InputArr[]>(
    Array.from(Array(30)).map((_, idx) => ({
      id: idx,
      val: Math.random() * 10,
    }))
  );
  const [inputArr, setInputArr] = useState<InputArr[]>([]);
  const counter = useRef(0);

  useEffect(() => {
    const init = [...initialInputArr.current];
    setInputArr(init);
  }, []);

  const sort = () => {
    // instead of using loops like for loop, I'm using setInterval
    let i = 0;
    let j = 0;
    // initializing vars
    const intervalId = setInterval(() => {
      // the main looping
      if (i < inputArr.length - 1) {
        // the value checker part of the first for loop ☝
        if (j < inputArr.length - i - 1) {
          // the value checker part of the second for loop ☝
          counter.current++;
          // TODO: show iteration count

          if (inputArr[j].val > inputArr[j + 1].val) {
            const temp = inputArr[j];
            inputArr[j] = inputArr[j + 1];
            inputArr[j + 1] = temp;
          }
          // swap if the left element is more than right element
          setInputArr([...inputArr]);
          // set the array after swapping
          j++;
          // increment second loop variable
        } else {
          // if the second loop is finished, reset second loop var, increment first loop var
          j = 0;
          i++;
        }
      }
      // if the first loop is over, stop the intervals
      else clearInterval(intervalId);
      // TODO: allow for dynamic speed
    }, 30);
  };

  return (
    <div>
      <SortContainer inputArr={initialInputArr.current} />
      <button onClick={sort}>sort</button>
    </div>
  );
};

export default App;
