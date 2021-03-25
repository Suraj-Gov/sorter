// this is a really big App.tsx
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import SortContainer from "./components/SortContainer";
import SpeedContext from "./contexts/SpeedContext";

interface props {}

export interface Input {
  id: number;
  val: number;
}

const checkIfSortingIsComplete = (sortedArr: Input[], inputArr: Input[]) => {
  return sortedArr
    .map((i) => i.val)
    .every((currentVal, idx) => currentVal === inputArr[idx].val);
};

const App: React.FC<props> = () => {
  const initialInputArr = useRef<Input[]>([
    // this will be the values of test array
    { id: 0, val: 1.4 },
    { id: 1, val: 1.8 },
    { id: 2, val: 1.9 },
    { id: 3, val: 3.0 },
    { id: 4, val: 2.3 },
    { id: 5, val: 4.0 },
    { id: 6, val: 2.9 },
    { id: 7, val: 3.7 },
    { id: 8, val: 1.1 },
  ]);
  const [inputArr, setInputArr] = useState<Input[]>([]);
  const isCurrentlySorting = useRef(false);
  const [isSortingFinished, setIsSortingFinished] = useState(false);
  const [counter, setCounter] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout>();
  const [currentBar, setCurrentBar] = useState([-1]);
  const [currentSorter, setCurrentSorter] = useState("");
  const [sliderVal, setSliderVal] = useState(5);
  const sortedArr = useRef<Input[]>([]);
  const [operationsInterval, setOperationsInterval] = useState(500);
  const sortDelayCounter = useRef(0);
  const playPauseButton = useRef<HTMLButtonElement>(null);
  const { setSpeedContext } = useContext(SpeedContext);

  useEffect(() => {
    /// 1st fn that runs on mount, just resets the values and sets the initialInputArr and inputArr
    // reset();
    const init = [...initialInputArr.current];
    setInputArr(init);
    // if I add reset to the dep array, it calls it on every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // idk why I added this
  useEffect(() => {
    sortedArr.current = [...initialInputArr.current].sort(
      (a, b) => a.val - b.val
    );
  }, [isSortingFinished]);

  // updating operation intervals and animationspeeds here
  useEffect(() => {
    const newOpsInterval = 100 * sliderVal;
    setOperationsInterval(newOpsInterval);
    setSpeedContext((prev) => ({
      ...prev,
      operationsInterval: newOpsInterval,
    }));
    if (newOpsInterval < 350) {
      setSpeedContext((prev) => ({
        ...prev,
        swapAnimationDuration: newOpsInterval * 0.75,
      }));
    }
  }, [sliderVal, setSpeedContext]);

  const reset = () => {
    isCurrentlySorting.current = false;
    setCurrentBar([-1]);
    initialInputArr.current = [
      ...Array.from(Array(30)).map((_, idx) => ({
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
    isCurrentlySorting.current = true;
    sortDelayCounter.current = 0;
    setIsSortingFinished(false);
    setCounter(0);
    return { i: 0, j: 0 };
  };

  const finish = (intervalId?: NodeJS.Timeout) => {
    isCurrentlySorting.current = false;
    setIsSortingFinished(true);
    if (intervalId) clearInterval(intervalId);
    setCurrentBar([-1]);
  };

  const getCurrentSpeed = () => {
    return operationsInterval;
  };

  const bubbleSort = useCallback(() => {
    // instead of using loops like for loop, I'm using setInterval
    // initializing vars
    let { i, j } = init();
    setCurrentBar([inputArr[j].id, inputArr[j + 1].id]);
    const intervalId = setInterval(() => {
      console.log(getCurrentSpeed());
      setIntervalId(intervalId);
      if (!isCurrentlySorting.current) {
        return;
      }
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
            setCurrentBar([inputArr[j + 1].id, inputArr[j].id]);
          }
          // swap if the left element is more than right element
          setInputArr([...inputArr]);
          setCurrentBar([inputArr[j + 2]?.id, inputArr[j + 1].id]);
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
    }, getCurrentSpeed());
  }, [inputArr, operationsInterval]);

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
      if (!isCurrentlySorting.current) {
        return;
      }
      setCounter((c) => c + 1);
      if (i < inputArr.length) {
        if (j === -9) {
          key = inputArr[i];
          j = i - 1;
        }
        // the while loop ⬇
        if (j >= 0 && inputArr[j].val > key.val) {
          inputArr[j + 1] = inputArr[j];
          j = j - 1;
          setCurrentBar([inputArr[j]?.id, inputArr[i]?.id]);
        } else {
          // the part after the while loop ⬇
          inputArr[j + 1] = key;
          j = -9;
          setCurrentBar([inputArr[i]?.id]);
          i++;
          setInputArr([...inputArr]);
        }
      } else {
        finish(intervalId);
      }
    }, operationsInterval);
  };

  const selectionSort = () => {
    let { i, j } = init();
    i = 1;
    j = -9;
    let lowestPos: number;
    const intervalId = setInterval(() => {
      debugger;
      setIntervalId(intervalId);
      if (!isCurrentlySorting.current) {
        return;
      }
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
    }, operationsInterval);
  };

  const mergeSort = () => {
    init();
    const merge = (
      inputArr: Input[],
      start: number,
      mid: number,
      end: number
    ) => {
      sortDelayCounter.current++;
      const timeoutId = setTimeout(() => {
        setIntervalId(timeoutId);
        // TODO check for isSortingCurrently
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

            if (checkIfSortingIsComplete(sortedArr.current, inputArr)) {
              finish();
            }
          }
        }
      }, operationsInterval * sortDelayCounter.current);
    };
    const mergeSort = (inputArr: Input[], l: number, h: number) => {
      if (l < h) {
        setCounter((c) => c + 1);
        const mid = Math.floor((l + h) / 2);
        mergeSort(inputArr, l, mid);
        mergeSort(inputArr, mid + 1, h);
        merge(inputArr, l, mid, h);
      }
    };

    mergeSort(inputArr, 0, initialInputArr.current.length - 1);
  };

  const quickSort = () => {
    // https://www.geeksforgeeks.org/iterative-quick-sort/
    // here the quick sort function is being run iteratively instead of recursively,
    // the stack holds the values instead of the function call stack if in recursion
    let { i, j: comparisonIdx } = init();
    const quickSort = (inputArr: Input[], start: number, end: number) => {
      let stack: number[] = [];
      let top = -1;
      let isPartitioning = false;
      i = -1;
      comparisonIdx = -1;
      stack[++top] = start;
      stack[++top] = end;
      const intervalId = setInterval(() => {
        // debugger;
        setIntervalId(intervalId);
        if (checkIfSortingIsComplete(sortedArr.current, inputArr)) {
          console.log("finished");
          finish(intervalId);
        }

        if (!isCurrentlySorting.current) {
          return;
        }
        setCounter((c) => c + 1);
        if (top >= 0 || isPartitioning) {
          if (!isPartitioning) {
            end = stack[top--];
            start = stack[top--];
          }
          // partitioning
          // suppposed to return comparisonIdx
          isPartitioning = true;
          const pivot = inputArr[end];
          if (comparisonIdx === -1) {
            comparisonIdx = start;
            i = start;
          }
          if (i < end) {
            setCurrentBar([inputArr[i].id, pivot.id]);
            if (inputArr[i].val <= pivot.val) {
              [inputArr[i], inputArr[comparisonIdx]] = [
                inputArr[comparisonIdx],
                inputArr[i],
              ];
              setInputArr([...inputArr]);
              comparisonIdx++;
            }
            i++;
          } else {
            [inputArr[comparisonIdx], inputArr[end]] = [
              inputArr[end],
              inputArr[comparisonIdx],
            ];
            setInputArr([...inputArr]);
            if (comparisonIdx - 1 > start) {
              stack[++top] = start;
              stack[++top] = comparisonIdx - 1;
            }
            if (comparisonIdx + 1 < end) {
              stack[++top] = comparisonIdx + 1;
              stack[++top] = end;
            }
            // I could use pop, but that's giving me a weird TS error
            // it says that I cannot assign a (number | undefined) type to number
            // that could be because a pop might return undefined when the array is empty
            isPartitioning = false;
            comparisonIdx = -1;
            i = -1;
          }
        }
      }, operationsInterval);
    };

    quickSort(inputArr, 0, inputArr.length - 1);
  };

  const shellSort = () => {
    let { i, j: gap } = init();
    gap = Math.floor(inputArr.length / 2);
    let end = -1;
    let idxs: number[] = [];
    let idx = -1;
    const intervalId = setInterval(() => {
      setIntervalId(intervalId);
      if (!isCurrentlySorting.current) {
        return;
      }
      if (gap >= 1) {
        if (i < inputArr.length) {
          if (end === -1) {
            end = i + gap;
          }
          if (end < inputArr.length) {
            if (!idxs.length) {
              let j = (i + gap) % gap;
              while (j < inputArr.length) {
                idxs.push(j);
                j += gap;
              }
            }
            if (idx === -1) {
              idx = idxs.length - 1;
            }
            if (idx > 0) {
              const b = idxs[idx];
              const a = idxs[idx - 1];
              if (b <= end) {
                setCurrentBar([inputArr[a].id, inputArr[b].id]);
                setCounter((c) => c + 1);
                if (inputArr[a].val > inputArr[b].val) {
                  [inputArr[a], inputArr[b]] = [inputArr[b], inputArr[a]];
                  setInputArr([...inputArr]);
                }
              }
              idx--;
            } else {
              setCurrentBar([]);
              end = -1;
              i++;
              idx = -1;
              idxs = [];
            }
          } else {
            setCurrentBar([]);
            end = -1;
            i++;
            idx = -1;
            idxs = [];
            gap = Math.floor(gap / 2);
            i = 0;
          }
        } else {
          i = 0;
          gap = Math.floor(gap / 2);
        }
      } else {
        finish(intervalId);
      }
    }, operationsInterval);
  };

  const handleSorting = () => {
    isCurrentlySorting.current = !isCurrentlySorting.current;
    if (playPauseButton.current) {
      playPauseButton.current.innerHTML = !isCurrentlySorting.current
        ? "Play"
        : "Pause";
    }
    if (isCurrentlySorting.current) {
      if (counter === 0)
        switch (currentSorter) {
          case "bubbleSort":
            bubbleSort();
            break;
          case "selectionSort":
            selectionSort();
            break;
          case "insertionSort":
            insertionSort();
            break;
          case "mergeSort":
            mergeSort();
            break;
          case "quickSort":
            quickSort();
            break;
          case "shellSort":
            shellSort();
            break;
          default:
            alert("this shouldn't happen.");
            break;
        }
    }
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
          { name: "bubbleSort", fn: () => setCurrentSorter("bubbleSort") },
          {
            name: "selectionSort",
            fn: () => setCurrentSorter("selectionSort"),
          },
          {
            name: "insertionSort",
            fn: () => setCurrentSorter("insertionSort"),
          },
          { name: "mergeSort", fn: () => setCurrentSorter("mergeSort") },
          { name: "quickSort", fn: () => setCurrentSorter("quickSort") },
          { name: "shellSort", fn: () => setCurrentSorter("shellSort") },
        ].map((sorter) => (
          <button
            key={sorter.name}
            disabled={isCurrentlySorting.current}
            onClick={sorter.fn}
          >
            <p
              style={{
                fontWeight: sorter.name === currentSorter ? "bold" : "normal",
              }}
            >
              {sorter.name}
            </p>
          </button>
        ))}
      </div>
      <div style={{ display: "flex" }}>
        <button disabled={counter === 0}>Step back</button>
        <button
          ref={playPauseButton}
          disabled={currentSorter === ""}
          onClick={() => handleSorting()}
        >
          Play
        </button>
        <button disabled={counter === 0}>Step Forward</button>
        <input
          type="range"
          min="1"
          max="20"
          value={sliderVal}
          onChange={(e) => setSliderVal(parseInt(e.target.value))}
        />
      </div>
    </div>
  );
};

export default App;
