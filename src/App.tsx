// this is a really big App.tsx
import React, { useEffect, useRef, useState } from "react";
import SortContainer from "./components/SortContainer";

interface props {}

export interface Input {
  id: number;
  val: number;
}

const App: React.FC<props> = () => {
  const initialInputArr = useRef<Input[]>(
    Array.from(Array(30)).map((_, idx) => ({
      id: idx,
      val: Math.round(Math.random() * 10 * 2) / 2 + 1,
    }))
    // [
    //   { id: 0, val: 4.5 },
    //   { id: 1, val: 7 },
    //   { id: 2, val: 5 },
    //   { id: 3, val: 5.5 },
    //   { id: 4, val: 11 },
    //   { id: 5, val: 4 },
    //   { id: 6, val: 7 },
    //   { id: 7, val: 9.5 },
    //   { id: 8, val: 5.5 },
    // ]
  );
  const [inputArr, setInputArr] = useState<Input[]>([]);
  const [isSortingFinished, setIsSortingFinished] = useState(false);
  const [counter, setCounter] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout>();
  const [currentBar, setCurrentBar] = useState([-1]);
  const sortedArr = useRef<Input[]>([]);
  const speedRef = useRef(500);
  useEffect(() => {
    const init = [...initialInputArr.current];
    setInputArr(init);
  }, []);

  useEffect(() => {
    sortedArr.current = [...initialInputArr.current].sort(
      (a, b) => a.val - b.val
    );
  }, [isSortingFinished]);

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
    setCurrentBar([-1]);
  };

  const init = () => {
    setIsSortingFinished(false);
    setCounter(0);
    return { i: 0, j: 0 };
  };

  const finish = (intervalId?: NodeJS.Timeout) => {
    setIsSortingFinished(true);
    if (intervalId) clearInterval(intervalId);
    setCurrentBar([-1]);
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
            setCurrentBar([inputArr[j + 1].id]);
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
    }, speedRef.current);
  };

  const insertionSort = () => {
    let { i, j } = init();
    // -9 only when the var needs to be reinitialized
    // in while loops, the vars need to retain their prev values
    // if they need to be changed after the while loop is finished, set them to -9
    j = -9;
    i = 1;
    let key: Input;
    const intervalId = setInterval(() => {
      setIntervalId(intervalId);
      setCounter((c) => c + 1);
      debugger;
      if (i < inputArr.length) {
        if (j === -9) {
          key = inputArr[i];
          j = i - 1;
        }
        // the while loop ⬇
        if (j >= 0 && inputArr[j].val > key.val) {
          setCurrentBar([inputArr[j].id]);
          inputArr[j + 1] = inputArr[j];
          j = j - 1;
        } else {
          // the part after the while loop ⬇
          inputArr[j + 1] = key;
          j = -9;
          i++;
          setInputArr([...inputArr]);
        }
      } else {
        finish(intervalId);
      }
    }, speedRef.current);
  };

  const selectionSort = () => {
    let { i, j } = init();
    i = 1;
    j = -9;
    let lowestPos: number;
    const intervalId = setInterval(() => {
      debugger;
      setIntervalId(intervalId);
      setCounter((c) => c + 1);
      if (i < inputArr.length) {
        if (j === -9) {
          lowestPos = i - 1;
          j = i;
        }
        setCurrentBar([inputArr[j - 1].id]);
        if (j < inputArr.length) {
          if (inputArr[j].val < inputArr[lowestPos].val) {
            lowestPos = j;
          }
          j++;
        } else {
          [inputArr[lowestPos], inputArr[i - 1]] = [
            inputArr[i - 1],
            inputArr[lowestPos],
          ];
          setInputArr([...inputArr]);
          i++;
          j = -9;
        }
      } else {
        finish(intervalId);
      }
    }, speedRef.current);
  };

  const mergeDelayCounter = useRef(0);
  const mergeSort = () => {
    init();
    const merge = (
      inputArr: Input[],
      start: number,
      mid: number,
      end: number
    ) => {
      mergeDelayCounter.current++;
      setTimeout(() => {
        setCurrentBar(inputArr.slice(start, end).map((i) => i.id));
        let start2 = mid + 1;
        if (inputArr[mid].val <= inputArr[start2].val) {
          setCounter((c) => c + 1);
          return;
        }
        while (start <= mid && start2 <= end) {
          if (inputArr[start].val <= inputArr[start2].val) {
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
            start2++;
            mid++;
            setInputArr([...inputArr]);
            setCounter((c) => c + 1);

            if (
              sortedArr.current
                .map((i) => i.val)
                .every((currentVal, idx) => currentVal === inputArr[idx].val)
            ) {
              finish();
            }
          }
        }
      }, speedRef.current * mergeDelayCounter.current);
    };
    const mergeSort = (inputArr: Input[], l: number, h: number) => {
      if (l < h) {
        const mid = Math.floor((l + h) / 2);
        mergeSort(inputArr, l, mid);
        mergeSort(inputArr, mid + 1, h);
        merge(inputArr, l, mid, h);
      }
    };

    mergeDelayCounter.current = 0;
    mergeSort(inputArr, 0, initialInputArr.current.length - 1);
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
        {[
          { name: "bubbleSort", fn: bubbleSort },
          { name: "insertionSort", fn: insertionSort },
          { name: "selectionSort", fn: selectionSort },
          { name: "mergeSort", fn: mergeSort },
        ].map((sorter) => (
          <button
            key={sorter.name}
            disabled={(!isSortingFinished && counter > 0) || isSortingFinished}
            onClick={sorter.fn}
          >
            {sorter.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default App;
