import React, { useEffect, useRef, useState } from "react";
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
}

const SortContainer: React.FC<props> = ({ inputArr }) => {
  const initialXPositions = useRef<number[]>([]);
  const [xPositions, setXPositions] = useState<number[]>([]);

  useEffect(() => {
    const bars = Array.from(document.querySelectorAll(".bar"));
    initialXPositions.current = bars.map((i) => i.getBoundingClientRect().x);
    setXPositions([...initialXPositions.current]);
  }, []);

  return (
    <Container>
      {/* <Bar xPos={0} height={100} width={10} color={"#e91414"} /> */}
      {inputArr.map((i, idx) => (
        <Bar
          xPos={xPositions[idx] - initialXPositions.current[idx]}
          height={50 * i.val}
          width={10}
          color="#e91414"
          key={i.id}
        />
      ))}
    </Container>
  );
};

export default SortContainer;
