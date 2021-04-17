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
import styled from "styled-components";
import Controls from "./components/Controls";
import SortOptions from "./components/SortOptions";

const Main = styled.div`
  display: grid;
  grid-template-columns: 35vw auto;
  @media only screen and (max-width: 900px) {
    display: flex;
    flex-direction: column-reverse;
    & > *:nth-child(1) {
      height: auto;
    }
    & > *:nth-child(2) {
      height: 50vh;
    }
  }
`;

interface props {}

export interface Input {
  id: number;
  val: number;
}

const App: React.FC<props> = () => {
  const initialInputArr = useRef<Input[]>([]);
  const [inputArr, setInputArr] = useState<Input[]>([]);
  const isCurrentlySorting = useRef(false);
  const [isSortingFinished, setIsSortingFinished] = useState(false);
  const [counter, setCounter] = useState(0);
  const counterRef = useRef(0);
  const [currentBar, setCurrentBar] = useState([-1]);
  const [currentSorter, setCurrentSorter] = useState("");
  const [sliderVal, setSliderVal] = useState(5);
  const sortedArr = useRef<Input[]>([]);
  const operationsInterval = useRef(500);
  const sortDelayCounter = useRef(0);
  const [inputArrs, setInputArrs] = useState<Input[][]>([]);
  const [currentBars, setCurrentBars] = useState<number[][]>([]);
  const [offset, setOffset] = useState(0);
  const playPauseButton = useRef<HTMLButtonElement>(null);
  const { setSpeedContext } = useContext(SpeedContext);
  const stepBackRef = useRef<HTMLButtonElement>(null);
  const stepForwardRef = useRef<HTMLButtonElement>(null);
  const [barCount, setBarCount] = useState(30);

  // a ref can be used to get updated vals in a settimeout
  // updating ref when the state changes
  useEffect(() => {
    counterRef.current = counter;
  }, [counter]);

  useEffect(() => {
    /// 1st fn that runs on mount, just sets the values and sets the initialInputArr and inputArr
    // if (barCount === 30) {
    setIsSortingFinished(false);
    setCounter(0);
    let initialArr = [
      ...Array.from(Array(barCount)).map((_, idx) => ({
        id: idx,
        val: Math.floor(Math.random() * barCount + 1),
      })),
    ];
    initialInputArr.current = [...initialArr];
    setInputArr([...initialArr]);
  }, [barCount]);

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
    setSpeedContext((prev) => ({
      ...prev,
      swapAnimationDuration: newOpsInterval * 0.95,
    }));
  }, [sliderVal, setSpeedContext]);

  // to set the inputArr based on the stepped options
  useEffect(() => {
    const inputArrsLength = inputArrs.length;
    if (offset !== 0) {
      try {
        const newInputArr = [...[...inputArrs][inputArrsLength + offset]];
        const newCurrentBars = [...[...currentBars][inputArrsLength + offset]];
        setInputArr(newInputArr);
        setCurrentBar(newCurrentBars);
      } catch (err) {
        console.log("cannot go back or forward");
        if (inputArrsLength + offset > inputArrsLength) {
          setOffset((prev) => prev - 1);
        } else setOffset((prev) => prev + 1);
      }
    }
    // I'm just listening to changes to offset, I don't need to run this every time inputArr is set
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset]);

  // event handlers for stepBack and stepForward
  useEffect(() => {
    const test = document.querySelectorAll("#controls button");
    test.forEach((button) => {
      if (button.id === "stepBack" || button.id === "stepForward") {
        button.addEventListener("click", () => {
          button.id === "stepBack"
            ? setOffset((p) => p - 1)
            : setOffset((p) => p + 1);
        });
      }
    });
  }, []);

  let handleSorting: (option: "toggle" | "no toggle") => void;

  const reset = () => {
    isCurrentlySorting.current = false;
    setCurrentBar([-1]);
    if (counter > 0) {
      initialInputArr.current = [...initialInputArr.current];
      setInputArr([...initialInputArr.current]);
    } else {
      let initialArr = [
        ...Array.from(Array(barCount)).map((_, idx) => ({
          id: idx,
          val: Math.floor(Math.random() * barCount),
        })),
      ];
      initialInputArr.current = [...initialArr];
      setInputArr([...initialInputArr.current]);
    }
    setInputArrs([]);
    setCurrentBars([]);
    setCurrentBar([]);
    setCounter(0);
    setIsSortingFinished(false);
    if (playPauseButton.current) {
      playPauseButton.current.innerHTML = `<svg viewBox="0 0 34 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 37.3713V2.43737C0 0.903735 1.65505 -0.0592372 2.98833 0.698632L32.1 17.2463C33.4131 17.9927 33.4567 19.8695 32.1796 20.676L3.06799 39.0623C1.73625 39.9034 0 38.9465 0 37.3713Z" fill="#7F7F7F"/>
</svg>`;
      playPauseButton.current.disabled = false;
    }

    // handleSorting("no toggle");
  };

  const init = useCallback(() => {
    setCurrentBars([]);
    setInputArrs([]);
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

  const finish = () => {
    isCurrentlySorting.current = false;
    setIsSortingFinished(true);
    setCurrentBar([-1]);
    if (playPauseButton.current) {
      playPauseButton.current.disabled = true;
      // prettier-ignore
      playPauseButton.current.innerHTML = `<svg viewBox="0 0 34 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 37.3713V2.43737C0 0.903735 1.65505 -0.0592372 2.98833 0.698632L32.1 17.2463C33.4131 17.9927 33.4567 19.8695 32.1796 20.676L3.06799 39.0623C1.73625 39.9034 0 38.9465 0 37.3713Z" fill="#7F7F7F"/>
</svg>`
    }
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
          // if the sorting is paused
          if (counterRef.current === 0) {
            // if the array is reset
            return;
          } else {
            // if the array is not reset, just run the fn again, but do not execute anything in the settimeout fn
            sort(getCurrentSpeed());
            return;
          }
        } // else if the sorting is not paused
        setOffset(0);
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
            setInputArrs((prev) => [...prev, [...inputArr]]);
            setInputArr([...inputArr]);
            setCurrentBars((prev) => [
              ...prev,
              [inputArr[j + 2]?.id, inputArr[j + 1].id],
            ]);
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
          if (counterRef.current === 0) {
            return;
          } else {
            sort(getCurrentSpeed());
            return;
          }
        }
        setOffset(0);
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
            setInputArrs((prev) => [...prev, [...inputArr]]);
            setCurrentBars((prev) => [
              ...prev,
              [inputArr[j + 2]?.id, inputArr[j + 1].id],
            ]);
            setCurrentBar([inputArr[j]?.id, inputArr[i]?.id]);
          } else {
            // the part after the while loop ⬇
            inputArr[j + 1] = key;
            j = -9;
            setInputArrs((prev) => [...prev, [...inputArr]]);
            setCurrentBars((prev) => [
              ...prev,
              [inputArr[j + 2]?.id, inputArr[j + 1]?.id],
            ]);
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
          if (counterRef.current === 0) {
            return;
          } else {
            sort(getCurrentSpeed());
            return;
          }
        }
        setOffset(0);
        setCounter((c) => c + 1);
        if (i < inputArr.length) {
          if (j === -9) {
            lowestPos = i - 1;
            j = i;
          }
          setInputArrs((prev) => [...prev, [...inputArr]]);
          setCurrentBars((prev) => [
            ...prev,
            [inputArr[j + 2]?.id, inputArr[j + 1]?.id],
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
            setInputArrs((prev) => [...prev, [...inputArr]]);
            setCurrentBars((prev) => [
              ...prev,
              [inputArr[j + 2]?.id, inputArr[j + 1]?.id],
            ]);
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
        if (start === 0 && end === inputArr.length - 1) {
          finish();
        }
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
          if (!isCurrentlySorting.current) {
            if (counterRef.current === 0) {
              return;
            } else {
              sort(getCurrentSpeed());
              return;
            }
          }
          setOffset(0);
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
              setInputArrs((prev) => [...prev, [...inputArr]]);
              setCurrentBars((prev) => [...prev, [inputArr[i].id, pivot.id]]);
              setCurrentBar([inputArr[i].id, pivot.id]);
              if (inputArr[i].val <= pivot.val) {
                [inputArr[i], inputArr[comparisonIdx]] = [
                  inputArr[comparisonIdx],
                  inputArr[i],
                ];
                setInputArrs((prev) => [...prev, [...inputArr]]);
                setCurrentBars((prev) => [...prev, [inputArr[i].id, pivot.id]]);
                setInputArr([...inputArr]);
                comparisonIdx++;
              }
              i++;
            } else {
              [inputArr[comparisonIdx], inputArr[end]] = [
                inputArr[end],
                inputArr[comparisonIdx],
              ];
              setInputArrs((prev) => [...prev, [...inputArr]]);
              setInputArr([...inputArr]);
              setCurrentBars((prev) => [...prev, [inputArr[i].id, pivot.id]]);
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
          } else {
            finish();
            return;
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
          if (counterRef.current === 0) {
            return;
          } else {
            sort(getCurrentSpeed());
            return;
          }
        }
        setOffset(0);
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
                    setInputArrs((prev) => [...prev, [...inputArr]]);
                    setInputArr([...inputArr]);
                  } else setInputArrs((prev) => [...prev, [...inputArr]]);
                  setCurrentBars((prev) => [
                    ...prev,
                    [inputArr[a].id, inputArr[b].id],
                  ]);
                }
                idx--;
              } else {
                setCurrentBar([]);
                setCurrentBars((prev) => [...prev, []]);
                setInputArrs((prev) => [...prev, [...inputArr]]);
                end = -1;
                i++;
                idx = -1;
                idxs = [];
              }
            } else {
              setCurrentBar([]);
              setCurrentBars((prev) => [...prev, []]);
              setInputArrs((prev) => [...prev, [...inputArr]]);
              end = -1;
              i++;
              idx = -1;
              idxs = [];
              gap = Math.floor(gap / 2);
              i = 0;
              sort(0);
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
          ? // prettier-ignore play
            `<svg viewBox="0 0 34 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 37.3713V2.43737C0 0.903735 1.65505 -0.0592372 2.98833 0.698632L32.1 17.2463C33.4131 17.9927 33.4567 19.8695 32.1796 20.676L3.06799 39.0623C1.73625 39.9034 0 38.9465 0 37.3713Z" fill="#7F7F7F"/>
</svg>`
          : // prettier-ignore pause
            `<svg viewBox="0 0 34 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 5C0 2.23858 2.23858 0 5 0H9C11.7614 0 14 2.23858 14 5V35C14 37.7614 11.7614 40 9 40H5C2.23858 40 0 37.7614 0 35V5Z" fill="#7F7F7F"/>
<path d="M20 5C20 2.23858 22.2386 0 25 0H29C31.7614 0 34 2.23858 34 5V35C34 37.7614 31.7614 40 29 40H25C22.2386 40 20 37.7614 20 35V5Z" fill="#7F7F7F"/>
</svg>

`;
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
    <Main>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#eee",
        }}
      >
        <div>
          <SortOptions
            barCount={barCount}
            isCurrentlySorting={isCurrentlySorting}
            setBarCount={setBarCount}
            counter={counter}
            currentSorter={currentSorter}
            isSortingFinished={isSortingFinished}
            reset={reset}
            setCurrentSorter={setCurrentSorter}
          />
          <Controls
            barCount={barCount}
            isCurrentlySorting={isCurrentlySorting}
            setBarCount={setBarCount}
            counter={counter}
            currentSorter={currentSorter}
            handleSorting={handleSorting}
            isSortingFinished={isSortingFinished}
            offset={offset}
            playPauseButton={playPauseButton}
            setSliderVal={setSliderVal}
            sliderVal={sliderVal}
            stepBackRef={stepBackRef}
            stepForwardRef={stepForwardRef}
          />
        </div>

        <div
          style={{
            margin: "1.5rem",
            textAlign: "center",
            color: "gray",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              style={{ width: 20, height: 20, marginRight: "0.3rem" }}
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Association_for_Computing_Machinery_%28ACM%29_logo.svg/1200px-Association_for_Computing_Machinery_%28ACM%29_logo.svg.png"
              alt="vvce-acm-logo"
            />
            <p>Powered by VVCE-ACM Student Chapter</p>
          </div>
          <p>Built with React and styled-components</p>
        </div>
      </div>
      <SortContainer
        barCount={barCount}
        counter={counter}
        inputArr={inputArr}
        initialInputArr={initialInputArr.current}
        finishedSorting={isSortingFinished}
        currentBar={currentBar}
      />
    </Main>
  );
};

export default App;
