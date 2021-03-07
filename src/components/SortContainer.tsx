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
  }, []);

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
        for (let i = 0; i < initialInputArr.length; i++) {
          if (inputArr[i].id !== initialInputArr[i].id) {
            changeInBars.push(inputArr[i]);
          }
        }
        // console.log(changeInBars, "changeInBars");
        if (changeInBars.length === 0) {
          return [...prev];
        }
        const [a, b] = changeInBars;
        // swapping xPositions
        const temp = prev[a.id];
        prev[a.id] = prev[b.id];
        prev[b.id] = temp;
        // console.log(prev);

        return [...prev];
      });
    }
  }, [inputArr]);

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
