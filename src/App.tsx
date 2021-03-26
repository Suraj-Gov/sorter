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
  const operationsInterval = useRef(500);
  const sortDelayCounter = useRef(0);
  const inputArrs = useRef<Input[][]>([]);
  const currentBars = useRef<number[][]>([]);
  const playPauseButton = useRef<HTMLButtonElement>(null);
  const { setSpeedContext } = useContext(SpeedContext);
  const stepBackRef = useRef<HTMLButtonElement>(null);
  const stepForwardRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    /// 1st fn that runs on mount, just resets the values and sets the initialInputArr and inputArr
    reset();
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
    operationsInterval.current = newOpsInterval;
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

  let handleSorting: (option: "toggle" | "no toggle") => void;

  const reset = () => {
    setCurrentSorter("");
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
    handleSorting("no toggle");
  };

  const init = useCallback(() => {
    currentBars.current = [];
    inputArrs.current = [];
    isCurrentlySorting.current = true;
    sortDelayCounter.current = 0;
    setIsSortingFinished(false);
    setCounter(0);
    if (stepBackRef.current && stepForwardRef.current) {
      stepBackRef.current.disabled = isCurrentlySorting.current;
      stepForwardRef.current.disabled = isCurrentlySorting.current;
    }
    return { i: 0, j: 0 };
  }, []);

  const finish = (intervalId?: NodeJS.Timeout) => {
    isCurrentlySorting.current = false;
    setIsSortingFinished(true);
    if (intervalId) clearInterval(intervalId);
    setCurrentBar([-1]);
  };

  const getCurrentSpeed = () => {
    return operationsInterval.current;
  };

  const bubbleSort = useCallback(() => {
    // instead of using loops like for loop, I'm using setInterval
    // initializing vars
    let { i, j } = init();
    setCurrentBar([inputArr[j].id, inputArr[j + 1].id]);
    const sort = (ops: number) =>
      setTimeout(() => {
        if (!isCurrentlySorting.current) {
          sort(getCurrentSpeed());
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
            inputArrs.current.push(inputArr);
            setInputArr([...inputArr]);
            currentBars.current.push([inputArr[j + 2]?.id, inputArr[j + 1].id]);
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
          sort(getCurrentSpeed());
        }
        // if the first loop is over, stop the intervals
        else {
          finish();
        }
        // TODO: allow for dynamic speed
      }, ops);
    sort(getCurrentSpeed());
  }, [inputArr, init]);

  const insertionSort = useCallback(() => {
    let { i, j } = init();
    // -9 only when the var needs to be reinitialized
    // in while loops, the vars need to retain their prev values
    // if they need to be changed after the while loop is finished, set them to -9
    j = -9;
    i = 1;
    let key: Input;
    const sort = (ops: number) =>
      setTimeout(() => {
        if (!isCurrentlySorting.current) {
          sort(getCurrentSpeed());
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
            inputArrs.current.push(inputArr);
            currentBars.current.push([inputArr[j]?.id, inputArr[i]?.id]);
            setCurrentBar([inputArr[j]?.id, inputArr[i]?.id]);
          } else {
            // the part after the while loop ⬇
            inputArr[j + 1] = key;
            j = -9;
            inputArrs.current.push(inputArr);
            currentBars.current.push([inputArr[j]?.id, inputArr[i]?.id]);
            setCurrentBar([inputArr[i]?.id]);
            i++;
            setInputArr([...inputArr]);
          }
          sort(getCurrentSpeed());
        } else {
          finish();
        }
      }, ops);
    sort(getCurrentSpeed());
  }, [inputArr, init]);

  const selectionSort = useCallback(() => {
    let { i, j } = init();
    i = 1;
    j = -9;
    let lowestPos: number;
    const sort = (ops: number) =>
      setTimeout(() => {
        if (!isCurrentlySorting.current) {
          sort(getCurrentSpeed());
          return;
        }
        setCounter((c) => c + 1);
        if (i < inputArr.length) {
          if (j === -9) {
            lowestPos = i - 1;
            j = i;
          }
          inputArrs.current.push(inputArr);
          currentBars.current.push([
            inputArr[j - 1].id,
            inputArr[lowestPos].id,
          ]);
          setCurrentBar([inputArr[j - 1].id, inputArr[lowestPos].id]);
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
            inputArrs.current.push(inputArr);
            currentBars.current.push([inputArr[j - 1].id]);
            setInputArr([...inputArr]);
            i++;
            j = -9;
          }
          sort(getCurrentSpeed());
        } else {
          finish();
        }
      }, ops);
    sort(getCurrentSpeed());
  }, [inputArr, init]);

  const mergeSort = () => {
    init();
    const merge = (
      inputArr: Input[],
      start: number,
      mid: number,
      end: number
    ) => {
      sortDelayCounter.current++;
      setTimeout(() => {
        // cannot pause, or alter speed in merge sort, I just don't know how to do merge sort iteratively
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
          }
        }
        if (checkIfSortingIsComplete(sortedArr.current, inputArr)) {
          finish();
        }
      }, getCurrentSpeed() * sortDelayCounter.current);
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

  const quickSort = useCallback(() => {
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
      const sort = (ops: number) =>
        setTimeout(() => {
          if (checkIfSortingIsComplete(sortedArr.current, inputArr)) {
            finish();
            return;
          }

          if (!isCurrentlySorting.current) {
            sort(getCurrentSpeed());
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
          sort(getCurrentSpeed());
        }, ops);
      sort(getCurrentSpeed());
    };

    quickSort(inputArr, 0, inputArr.length - 1);
  }, [inputArr, init]);

  const shellSort = () => {
    let { i, j: gap } = init();
    gap = Math.floor(inputArr.length / 2);
    let end = -1;
    let idxs: number[] = [];
    let idx = -1;
    const sort = (ops: number) =>
      setTimeout(() => {
        if (!isCurrentlySorting.current) {
          sort(getCurrentSpeed());
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
          sort(getCurrentSpeed());
        } else {
          finish();
        }
      }, ops);
    sort(getCurrentSpeed());
  };

  handleSorting = (option: "toggle" | "no toggle") => {
    if (option === "toggle")
      isCurrentlySorting.current = !isCurrentlySorting.current;
    if (currentSorter !== "mergeSort") {
      if (
        playPauseButton.current &&
        stepBackRef.current &&
        stepForwardRef.current
      ) {
        playPauseButton.current.innerHTML = !isCurrentlySorting.current
          ? "Play"
          : "Pause";
        stepBackRef.current.disabled = isCurrentlySorting.current;
        stepForwardRef.current.disabled = isCurrentlySorting.current;
      }
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
          case "":
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
      <button
        disabled={
          currentSorter === "mergeSort" || (!isSortingFinished && counter > 0)
        }
        onClick={reset}
      >
        reset
      </button>
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
            disabled={currentSorter !== ""}
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
        <button
          ref={stepBackRef}
          disabled={currentSorter === "mergeSort" && counter > 0}
        >
          Step back
        </button>
        <button
          ref={playPauseButton}
          disabled={
            currentSorter === "" ||
            (currentSorter === "mergeSort" && counter > 0)
          }
          onClick={() => handleSorting("toggle")}
        >
          Play
        </button>
        <button
          ref={stepForwardRef}
          disabled={currentSorter === "mergeSort" && counter > 0}
        >
          Step Forward
        </button>
        <input
          type="range"
          min="1"
          max="20"
          value={sliderVal}
          onChange={(e) =>
            setSliderVal(
              !(currentSorter === "mergeSort" && counter > 0)
                ? parseInt(e.target.value)
                : sliderVal
            )
          }
        />
      </div>
    </div>
  );
};

export default App;
