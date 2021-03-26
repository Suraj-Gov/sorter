import React, { useRef } from "react";
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
  hideVal: boolean;
  swapAnimationDuration: number;
}

const BarComponent = styled.div.attrs<props>((props) => ({
  style: {
    height: props.height + "px",
    width: props.width + "px",
    position: "relative",
    display: "flex",
    marginRight: props.width / 5 + "px",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    border: "none",
    borderTop: `${props.isCurrent ? 10 : 0}px solid white`,
    backgroundColor:
      props.barMoving || props.finishedSorting ? "#ff661f" : "#bfa797",
    transform: `translateX(${props.xPos}px)`,
    transition: `all ${
      props.swapAnimationDuration / 1000
    }s cubic-bezier(0.85, 0, 0.15, 1), backgroundColor 0.2s ease-in-out, border 0.15s ease-in-out`,
  },
}))<props>``;

const Bar: React.FC<props> = ({
  width,
  height,
  xPos,
  value,
  barMoving,
  finishedSorting,
  isCurrent,
  hideVal,
  swapAnimationDuration,
}) => {
  const barRef = useRef<HTMLDivElement>(null);

  // const move = useCallback(
  //   (xPos: number) => {
  //     anime({
  //       targets: [barRef.current],
  //       translateX: xPos,
  //       easing: "easeInOutCirc",
  //       duration: speedContext.swapAnimationDuration,
  //     });
  //   },
  //   [speedContext.swapAnimationDuration]
  // );

  // useLayoutEffect(() => {
  //   move(xPosProp);
  //   // setXPos()
  // }, [xPosProp, move]);

  // const move = (xPos: number) => {
  //   anime({
  //     targets: [barRef.current],
  //     translateX: xPos,
  //     easing: "easeInOutCirc",
  //     duration: speedContext.swapAnimationDuration,
  //   });
  // };

  return (
    <div>
      <BarComponent
        isCurrent={isCurrent}
        ref={barRef}
        height={height}
        width={width}
        xPos={xPos}
        barMoving={barMoving}
        finishedSorting={finishedSorting}
        hideVal={hideVal}
        swapAnimationDuration={swapAnimationDuration}
      >
        {!hideVal && (
          <span style={{ position: "absolute", bottom: "-30", color: "white" }}>
            {value && value}
          </span>
        )}
      </BarComponent>
    </div>
  );
};

export default Bar;
