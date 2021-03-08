import anime from "animejs";
import React, { useLayoutEffect, useRef, useState } from "react";
import styled from "styled-components";

interface props {
  height: number;
  color?: string;
  active?: boolean;
  width: number;
  xPos: number;
  rank?: number;
  barMoving: boolean;
  finishedSorting: boolean;
}

const BarComponent = styled.div<props>`
  height: ${(props) => props.height + "px"};
  width: ${(props) => props.width + "px"};
  margin-right: 5px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  padding: 5px 0px;
  background-color: ${(props) =>
    props.barMoving || props.finishedSorting ? "#ff661f" : props.color};
  transition: background-color 0.2s ease-in-out;
`;

const Bar: React.FC<props> = ({
  width,
  height,
  color,
  xPos: xPosProp,
  rank,
  barMoving,
  finishedSorting,
}) => {
  const barRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    move(xPosProp);
    // setXPos()
  }, [xPosProp]);

  const move = (xPos: number) => {
    anime({
      targets: [barRef.current],
      translateX: xPos,
      easing: "easeInOutCirc",
      duration: 800,
    });
  };

  return (
    <div>
      <BarComponent
        ref={barRef}
        height={height}
        width={width}
        color={color}
        xPos={0}
        barMoving={barMoving}
        finishedSorting={finishedSorting}
      >
        <span style={{ color: "white" }}>{rank}</span>
      </BarComponent>
    </div>
  );
};

export default Bar;
