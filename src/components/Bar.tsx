import anime from "animejs";
import React, { useContext, useLayoutEffect, useRef, useState } from "react";
import styled from "styled-components";
import BarContext from "../contexts/BarContext";

interface props {
  height: number;
  color?: string;
  active?: boolean;
  width: number;
  xPos: number;
}

const BarComponent = styled.div<props>`
  height: ${(props) => props.height + "px"};
  background-color: ${(props) => props.color};
  width: ${(props) => props.width + "px"};
  margin-right: 5px;
  position: relative;
  left: ${(props) => props.xPos + "px"};
`;

const Bar: React.FC<props> = ({ width, height, color, xPos: xPosProp }) => {
  const { setBarContext } = useContext(BarContext);
  const barRef = useRef<HTMLDivElement>(null);
  const [xPos, setXPos] = useState(0);

  useLayoutEffect(() => {
    setBarContext((prev) => [...prev, barRef]);
  }, [setBarContext]);

  useLayoutEffect(() => {
    move(xPosProp);
    // setXPos()
  }, [xPosProp]);

  const move = (xPos: number) => {
    anime({
      targets: [barRef.current],
      translateX: xPos,
      easing: "easeInOutCirc",
      duration: 500,
    });
  };

  return (
    <BarComponent
      ref={barRef}
      height={height}
      width={width}
      color={color}
      xPos={xPos}
      className="bar"
    ></BarComponent>
  );
};

export default Bar;
