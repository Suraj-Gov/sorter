import anime from "animejs";
import React, { useLayoutEffect, useRef } from "react";
import styled from "styled-components";

interface props {
  height: number;
  active?: boolean;
  width: number;
  xPos: number;
  value?: number;
  barMoving: boolean;
  finishedSorting: boolean;
  isCurrent: boolean;
}

const BarComponent = styled.div<props>`
  border-bottom: 0px solid black;
  height: ${(props) => props.height + "px"};
  width: ${(props) => props.width + "px"};
  margin-right: 5px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  padding: 5px 0px;
  background-color: ${(props) => (props.isCurrent ? "blue" : "")};
  background-color: ${(props) =>
    props.barMoving || props.finishedSorting ? "#ff661f" : "#bfa797"};
  transition: background-color 0.2s ease-in-out, border 0.15s ease-in-out;
  border-bottom: ${(props) => `${props.isCurrent ? 8.5 : 0}px solid red`};
`;

const Bar: React.FC<props> = ({
  width,
  height,
  xPos: xPosProp,
  value,
  barMoving,
  finishedSorting,
  isCurrent,
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
      duration: 400,
    });
  };

  return (
    <div>
      <BarComponent
        isCurrent={isCurrent}
        ref={barRef}
        height={height}
        width={width}
        xPos={0}
        barMoving={barMoving}
        finishedSorting={finishedSorting}
      >
        <span style={{ color: "white" }}>{value && value * 2}</span>
      </BarComponent>
    </div>
  );
};

export default Bar;
