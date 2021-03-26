import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Input } from "../App";
import SpeedContext from "../contexts/SpeedContext";
import Bar from "./Bar";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  position: relative;
  height: 100vh;
  overflow: hidden;
  padding: 0em;
`;

interface props {
  barCount: number;
  counter: number;
  inputArr: Input[];
  initialInputArr: Input[];
  finishedSorting: boolean;
  currentBar: number[];
}

const SortContainer: React.FC<props> = ({
  counter,
  inputArr,
  initialInputArr,
  finishedSorting,
  currentBar,
  barCount,
}) => {
  const [xPositions, setXPositions] = useState<number[]>([]);
  const [movingBars, setMovingBars] = useState<number[]>([]);
  const [width, setWidth] = useState(20);
  const [sortContainerDimensions, setSortContainerDimensions] = useState({
    width: 1000,
    height: 700,
  });
  const { speedContext } = useContext(SpeedContext);

  const setContainerDimensions = () => {
    const container = document.getElementById("sortContainer");
    if (container)
      setSortContainerDimensions({
        height: container.getBoundingClientRect().height,
        width: container.getBoundingClientRect().width - 12 * 5 * 2,
      });
  };
  useEffect(() => {
    window.addEventListener("resize", (_) => {
      setContainerDimensions();
    });
    return () => window.removeEventListener("resize", () => {});
  }, []);

  useEffect(() => {
    setContainerDimensions();
  }, []);

  useEffect(() => {
    setWidth((sortContainerDimensions.width * 0.75) / barCount);
  }, [barCount, sortContainerDimensions.width]);

  useEffect(() => {
    if (!finishedSorting) {
      setMovingBars([]);
      setXPositions((prev) => prev.map((_) => 0));
    }
  }, [finishedSorting]);

  useEffect(() => {
    if (currentBar[0] === -1) {
      setMovingBars([]);
    }
  }, [currentBar]);

  useEffect(() => {
    if (inputArr.length !== 0 && counter > 0) {
      setMovingBars([]);
      // if the inputArr is not empty
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
            offsets.push((iidx - i) * (width + width / 3));
            break;
          }
        }
      }

      const newMovingBars = offsets
        .map((i, idx) => ({ i, idx }))
        .filter((i, idx) => i.i !== xPositions[idx] && i.i !== 0)
        // remove the bars where the value of offset is 0 and has the same previous offset values
        .map((i) => i.idx);

      setXPositions(offsets);
      setMovingBars(newMovingBars);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputArr]);

  return (
    <Container id="sortContainer" style={{ backgroundColor: "#AAD6FF" }}>
      {initialInputArr.map((i, idx) => {
        return (
          <Bar
            isCurrent={currentBar.includes(i.id)}
            xPos={xPositions[idx]}
            height={(i.val / barCount) * (sortContainerDimensions.height - 50)}
            width={width}
            key={i.id}
            value={i.val}
            barMoving={movingBars.includes(idx)}
            finishedSorting={finishedSorting}
            hideVal={width < 20}
            swapAnimationDuration={speedContext.swapAnimationDuration}
          />
        );
      })}
    </Container>
  );
};

export default SortContainer;
