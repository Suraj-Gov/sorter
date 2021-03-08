import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { InputArr } from "../App";
import Bar from "./Bar";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  position: relative;
`;

interface props {
  inputArr: InputArr[];
  initialInputArr: InputArr[];
  finishedSorting: boolean;
}

const SortContainer: React.FC<props> = ({
  inputArr,
  initialInputArr,
  finishedSorting,
}) => {
  const [xPositions, setXPositions] = useState<number[]>([]);
  const [movingBars, setMovingBars] = useState<number[]>([]);

  useEffect(() => {
    if (inputArr.length !== 0) {
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
  }, [inputArr, xPositions.length, initialInputArr.length]);

  return (
    <Container>
      {/* <Bar xPos={0} height={100} width={10} color={"#e91414"} /> */}
      {initialInputArr.map((i, idx) => {
        return (
          <Bar
            xPos={xPositions[idx]}
            height={50 * i.val}
            width={20}
            color="#c00b0b"
            key={i.id}
            value={i.val}
            barMoving={movingBars.includes(idx)}
            finishedSorting={finishedSorting}
          />
        );
      })}
    </Container>
  );
};

export default SortContainer;
