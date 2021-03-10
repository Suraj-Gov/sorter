import React, { useEffect, useRef, useState } from "react";
import SortContainer from "./components/SortContainer";

interface props {}

export interface InputArr {
  id: number;
  val: number;
}

const App: React.FC<props> = () => {
  const initialInputArr = useRef<InputArr[]>(
    Array.from(Array(10)).map((_, idx) => ({
      id: idx,
      val: Math.round(Math.random() * 10 * 2) / 2 + 1,
    }))
    // test array
    // [
    //   { id: 0, val: 7 },
    //   { id: 1, val: 6 },
    //   { id: 2, val: 5 },
    //   { id: 3, val: 4 },
    //   { id: 4, val: 3 },
    //   { id: 5, val: 2 },
    // ]
  );
  const [inputArr, setInputArr] = useState<InputArr[]>([]);
  const [isSortingFinished, setIsSortingFinished] = useState(false);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const init = [...initialInputArr.current];
    setInputArr(init);
  }, []);

  const bubbleSort = () => {
    setIsSortingFinished(false);
    // instead of using loops like for loop, I'm using setInterval
    setCounter(0);
    let i = 0;
    let j = 0;
    // initializing vars
    const sortedArr = [...inputArr].sort((a, b) => a.val - b.val);

    const intervalId = setInterval(() => {
      // the main looping
      if (i < inputArr.length - 1) {
        // the value checker part of the first for loop ☝
        if (j < inputArr.length - i - 1) {
          // the value checker part of the second for loop ☝
          setCounter((prev) => prev + 1);
          // TODO: show iteration count
          const isSorted = inputArr.every(
            (i, idx) => i.val === sortedArr[idx].val
          );
          if (isSorted) {
            setIsSortingFinished(true);
            clearInterval(intervalId);
            return;
          }

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
      else {
        setIsSortingFinished(true);
        clearInterval(intervalId);
      }
      // TODO: allow for dynamic speed
    }, 500);
  };

  const insertionSort = () => {
    console.log("insertionSort");
  };

  const selectionSort = () => {
    console.log("selectionSort");
  };

  return (
    <div>
      <SortContainer
        inputArr={inputArr}
        initialInputArr={initialInputArr.current}
        finishedSorting={isSortingFinished}
      />
      <p>Steps executed: {counter}</p>
      <div style={{ display: "flex" }}>
        <button
          disabled={!isSortingFinished && counter > 0}
          onClick={bubbleSort}
        >
          bubbleSort
        </button>
        <button
          disabled={!isSortingFinished && counter > 0}
          onClick={insertionSort}
        >
          insertionSort
        </button>
        <button
          disabled={!isSortingFinished && counter > 0}
          onClick={selectionSort}
        >
          selectionSort
        </button>
      </div>
    </div>
  );
};

export default App;
