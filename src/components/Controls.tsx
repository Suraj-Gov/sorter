import React from "react";
import Snail from "../icons/snail";
import Rocket from "../icons/rocket";
import styled from "styled-components";
import PlayIcon from "../icons/play";
import NextIcon from "../icons/next";
import PrevIcon from "../icons/prev";
import LessBarsIcon from "../icons/lessBars";
import MoreBarsIcon from "../icons/moreBars";

interface props {
  stepBackRef: React.RefObject<HTMLButtonElement>;
  stepForwardRef: React.RefObject<HTMLButtonElement>;
  currentSorter: string;
  isSortingFinished: boolean;
  counter: number;
  playPauseButton: React.RefObject<HTMLButtonElement>;
  handleSorting: (option: "toggle" | "no toggle") => void;
  sliderVal: number;
  setSliderVal: React.Dispatch<React.SetStateAction<number>>;
  offset: number;
  barCount: number;
  setBarCount: React.Dispatch<React.SetStateAction<number>>;
  isCurrentlySorting: React.MutableRefObject<boolean>;
}

const ControlsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 3rem);
  gap: 1rem;
  place-content: center;
  justify-items: center;
  align-items: center;
`;

const PlayButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.8rem;
  outline: none;
  border: none;
  background-color: #c4c4c4;
  color: white;
  border-radius: 10px;
  transition: all 0.1s ease-in-out;

  &:disabled {
    opacity: 0.5;
  }

  & > svg {
    width: 100%;
  }
`;
const StepButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.6rem;
  outline: none;
  border: none;
  background-color: #c4c4c4;
  color: white;
  border-radius: 10px;
  width: 2.5rem;
  height: 2.5rem;
  transition: all 0.1s ease-in-out;

  & svg {
    width: 20px;
  }

  &:disabled {
    opacity: 0.5;
  }
`;

const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  & input {
    appearance: none;
    --webkit-appearance: none;
    background-color: #c4c4c4;
    height: 6px;
    border-radius: 5px;
  }
  & input::-webkit-slider-thumb {
    --webkit-appearance: none;
    appearance: none;
    background-color: rgb(63, 208, 143);
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: none;
  }
  & svg {
    fill: rgb(63, 208, 143);
    width: 28px;
    margin: 0.5rem;
  }
`;

const Controls: React.FC<props> = ({
  offset,
  counter,
  currentSorter,
  handleSorting,
  isSortingFinished,
  playPauseButton,
  setSliderVal,
  sliderVal,
  stepBackRef,
  stepForwardRef,
  barCount,
  isCurrentlySorting,
  setBarCount,
}) => {
  return (
    <div>
      <ControlsContainer id="controls">
        <StepButton
          id="stepBack"
          ref={stepBackRef}
          disabled={
            (currentSorter === "mergeSort" && counter > 0) ||
            // inputArrs[inputArr.length - offset] === undefined ||
            counter === 0
          }
        >
          <PrevIcon />
        </StepButton>
        <PlayButton
          ref={playPauseButton}
          disabled={currentSorter === "mergeSort" && counter > 0}
          onClick={() => handleSorting("toggle")}
        >
          <PlayIcon />
        </PlayButton>
        <StepButton
          id="stepForward"
          ref={stepForwardRef}
          disabled={
            (currentSorter === "mergeSort" && counter > 0) || offset === 0
          }
        >
          <NextIcon />
        </StepButton>
      </ControlsContainer>
      <div
        style={{
          marginTop: "1rem",
          display: "grid",
          gridTemplateRows: "repeat(2, auto)",
          placeItems: "center",
          gap: "0.8rem",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <SliderContainer>
            <Snail />
            <input
              type="range"
              style={{ direction: "rtl" }}
              min="1"
              max="50"
              value={sliderVal}
              onChange={(e) =>
                setSliderVal(
                  !(currentSorter === "mergeSort" && counter > 0)
                    ? parseInt(e.target.value)
                    : sliderVal
                )
              }
            />
            <Rocket />
          </SliderContainer>
          <h3>{((1 / sliderVal) * 15).toFixed(1)}</h3>
          <p style={{ fontSize: "0.8rem" }}>Operations / second</p>
        </div>
        <SliderContainer>
          <LessBarsIcon />
          <input
            style={{ width: "15rem" }}
            type="range"
            min="10"
            max="150"
            value={barCount}
            onChange={(e) =>
              !isCurrentlySorting.current &&
              setBarCount(parseInt(e.target.value))
            }
          />
          <MoreBarsIcon />
        </SliderContainer>
      </div>
    </div>
  );
};

export default Controls;
