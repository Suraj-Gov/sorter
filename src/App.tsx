import React, { useEffect, useRef, useState } from "react";
import SortContainer from "./components/SortContainer";

interface props {}

export interface InputArr {
  id: number;
  val: number;
}

const App: React.FC<props> = () => {
  const initialInputArr = useRef<InputArr[]>(
    // Array.from(Array(10)).map((_, idx) => ({
    //   id: idx,
    //   val: Math.round(Math.random() * 10 * 2) / 2 + 1,
    // }))
    [
      { id: 0, val: 4.5 },
      { id: 1, val: 7 },
      { id: 2, val: 5 },
      { id: 3, val: 5.5 },
      { id: 4, val: 11 },
      { id: 5, val: 4 },
      { id: 6, val: 7 },
      { id: 7, val: 9.5 },
      { id: 8, val: 5.5 },
      { id: 9, val: 2 },
    ]
  );
  const [inputArr, setInputArr] = useState<InputArr[]>([]);
  const [isSortingFinished, setIsSortingFinished] = useState(false);
  const [counter, setCounter] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout>();
  const [currentBar, setCurrentBar] = useState(-1);
  useEffect(() => {
    const init = [...initialInputArr.current];
    setInputArr(init);
  }, []);

  const reset = () => {
    initialInputArr.current = [
      ...Array.from(Array(10)).map((_, idx) => ({
        id: idx,
        val: Math.round(Math.random() * 10 * 2) / 2 + 1,
      })),
    ];
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(undefined);
    }
    setInputArr([...initialInputArr.current]);
    setCounter(0);
    setIsSortingFinished(false);
  };

  const init = () => {
    setIsSortingFinished(false);
    setCounter(0);
    return { i: 0, j: 0 };
  };

  const finish = (intervalId: NodeJS.Timeout) => {
    setIsSortingFinished(true);
    clearInterval(intervalId);
  };

  const bubbleSort = () => {
    // instead of using loops like for loop, I'm using setInterval
    // initializing vars
    let { i, j } = init();

    const intervalId = setInterval(() => {
      setIntervalId(intervalId);
      // the main looping
      if (i < inputArr.length - 1) {
        // the value checker part of the first for loop ☝
        if (j < inputArr.length - i - 1) {
          // the value checker part of the second for loop ☝
          setCounter((prev) => prev + 1);
          // TODO: show iteration count
          if (inputArr[j].val > inputArr[j + 1].val) {
            const temp = inputArr[j];
            inputArr[j] = inputArr[j + 1];
            inputArr[j + 1] = temp;
          } else {
            setCurrentBar(inputArr[j + 1].id);
          }
          // swap if the left element is more than right element
          setInputArr([...inputArr]);
          // set the array after swapping
          j++;
          // setCurrentBar(i + j);
          // increment second loop variable
        } else {
          // if the second loop is finished, reset second loop var, increment first loop var
          j = 0;
          i++;
        }
      }
      // if the first loop is over, stop the intervals
      else {
        finish(intervalId);
      }
      // TODO: allow for dynamic speed
    }, 500);
  };

  const insertionSort = () => {
    // TODO
  };

  const selectionSort = () => {
    // TODO
  };

  return (
    <div>
      <SortContainer
        counter={counter}
        inputArr={inputArr}
        initialInputArr={initialInputArr.current}
        finishedSorting={isSortingFinished}
        currentBar={currentBar}
      />
      <p>Steps executed: {counter}</p>
      <button onClick={reset}>reset</button>
      <div style={{ display: "flex" }}>
        <button
          disabled={(!isSortingFinished && counter > 0) || isSortingFinished}
          onClick={bubbleSort}
        >
          bubbleSort
        </button>
        <button
          disabled={(!isSortingFinished && counter > 0) || isSortingFinished}
          onClick={insertionSort}
        >
          insertionSort
        </button>
        <button
          disabled={(!isSortingFinished && counter > 0) || isSortingFinished}
          onClick={selectionSort}
        >
          selectionSort
        </button>
      </div>
    </div>
  );
};

export default App;
