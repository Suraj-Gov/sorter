import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { InputArr } from "../App";
import BarContext from "../contexts/BarContext";
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
}

const SortContainer: React.FC<props> = ({ inputArr, initialInputArr }) => {
  const { barContext } = useContext(BarContext);
  const initialInputArrContainer = useRef<InputArr[]>([]);
  const initialXPositions = useRef<number[]>([]);
  const [xPositions, setXPositions] = useState<number[]>([]);

  useEffect(() => {
    initialInputArrContainer.current = [...initialInputArr];
  }, [initialInputArr]);

  useEffect(() => {
    if (barContext !== null) {
      const bars = barContext.map(
        (i) => i.current && i.current.getBoundingClientRect().x
      );
      // @ts-ignore
      initialXPositions.current = [...bars];

      // @ts-ignore
      setXPositions([...bars]);
      initialInputArrContainer.current = [...initialInputArr];
    }
  }, [barContext, initialInputArr]);

  useEffect(() => {
    if (inputArr.length !== 0 && xPositions.length !== 0) {
      setXPositions((prev) => {
        const changeInBars = [];
        // console.log({
        //   inputArr: inputArr.map((i) => i.id),
        //   initialInputArr: initialInputArr.map((i) => i.id),
        // });
        for (let i = 0; i < initialInputArr.length; i++) {
          if (inputArr[i].id !== initialInputArr[i].id) {
            changeInBars.push(i);
          }
        }
        if (changeInBars.length === 0) {
          return [...prev];
        }
        console.log(changeInBars, "change");

        const [a, b] = changeInBars;
        // swapping xPositions
        // const temp = prev[a.data.id];
        // prev[a.idx] = prev[b.data.id];
        // prev[b.idx] = temp;
        const temp = prev[a];
        prev[a] = prev[b];
        prev[b] = temp;
        console.log(prev.map((i) => i - initialXPositions.current[0]));

        return [...prev];
      });
    }
  }, [inputArr, xPositions.length]);

  return (
    <Container>
      {/* <Bar xPos={0} height={100} width={10} color={"#e91414"} /> */}
      {initialInputArrContainer.current.map((i, idx) => {
        return (
          <Bar
            xPos={xPositions[idx] - initialXPositions.current[idx]}
            height={50 * i.val}
            width={10}
            color="#e91414"
            key={i.id}
          />
        );
      })}
    </Container>
  );
};

export default SortContainer;
