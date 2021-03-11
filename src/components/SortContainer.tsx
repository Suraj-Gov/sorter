import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Input } from "../App";
import Bar from "./Bar";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  position: relative;
`;

interface props {
  counter: number;
  inputArr: Input[];
  initialInputArr: Input[];
  finishedSorting: boolean;
  currentBar: number;
}

const SortContainer: React.FC<props> = ({
  counter,
  inputArr,
  initialInputArr,
  finishedSorting,
  currentBar,
}) => {
  const [xPositions, setXPositions] = useState<number[]>([]);
  const [movingBars, setMovingBars] = useState<number[]>([]);

  useEffect(() => {
    if (!finishedSorting) {
      setMovingBars([]);
      setXPositions((prev) => prev.map((_) => 0));
    }
  }, [finishedSorting]);

  useEffect(() => {
    if (inputArr.length !== 0 && counter > 0) {
      setMovingBars([]);
      // if the inputArr is not empty
      const barWidth = 25;
      // hard coded barwidth
      // TODO: make it dynamic based on bar width on DOM
      const offsets = [];
      // create a new empty offsets array
      for (let i = 0; i < initialInputArr.length; i++) {
        // loop through the initInputs and inputs
        for (let iidx = 0; iidx < inputArr.length; iidx++) {
          // if the position of the element has advanced to the left or right of the array
          // for ex.
          // [0, 1, 2] <- initArr
          // [1, 0, 2] <- inputArr
          // 1 has moved -1 indexes and 0 has moved +1 indexes
          if (inputArr[iidx].id === i) {
            // if the inputArr offset elements are detected, calculate offset and push it
            // (initArrPos - inputArrPos) * barWidth
            offsets.push((iidx - i) * barWidth);
            break;
          }
        }
      }

      const newMovingBars = offsets
        .map((i, idx) => ({ i, idx }))
        .filter((i, idx) => i.i !== xPositions[idx])
        .map((i) => i.idx);

      setXPositions(offsets);
      setMovingBars(newMovingBars);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputArr, xPositions.length, initialInputArr.length]);

  return (
    <Container>
      {initialInputArr.map((i, idx) => {
        return (
          <Bar
            isCurrent={i.id === currentBar}
            xPos={xPositions[idx]}
            height={50 * i.val}
            width={20}
            key={i.id}
            value={i.id / 2}
            barMoving={movingBars.includes(idx)}
            finishedSorting={finishedSorting}
          />
        );
      })}
    </Container>
  );
};

export default SortContainer;
