import React, { useEffect } from "react";
import styled from "styled-components";

const Title = styled.h1`
  font-size: 2rem;
  @media only screen and (max-width: 900px) {
    font-size: 1.5rem;
  }
`;

const Container = styled.div`
  margin: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const SorterSelect = styled.select`
  font-weight: 700;
  padding: 0.5rem;
  padding-right: 1.8rem;
  border: none;
  outline: none;
  border-radius: 5px;
  background-color: #3fd08f;
  color: white;
  appearance: none;

  &:disabled {
    opacity: 0.5;
  }
`;

export const BlackButton = styled.button`
  font-weight: 600;
  background-color: #000;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 0.5rem;
  margin-right: 0.5rem;

  &:disabled {
    opacity: 0.5;
  }
`;

interface props {
  counter: number;
  isSortingFinished: boolean;
  currentSorter: string;
  reset: () => void;
  setCurrentSorter: (value: React.SetStateAction<string>) => void;
  isCurrentlySorting: React.MutableRefObject<boolean>;
  barCount: number;
  setBarCount: React.Dispatch<React.SetStateAction<number>>;
}

const SortOptions: React.FC<props> = ({
  counter,
  currentSorter,
  isSortingFinished,
  reset,
  setCurrentSorter,
}) => {
  useEffect(() => {
    setCurrentSorter("bubbleSort");
  }, [setCurrentSorter]);

  return (
    <Container>
      <div>
        <Title>Sorter</Title>
        <p>
          {counter > 0 && !isSortingFinished
            ? `${counter} steps`
            : isSortingFinished
            ? `Done in ${counter} steps`
            : "Unsorted"}
        </p>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
        }}
      >
        <BlackButton
          disabled={
            counter > 0 && currentSorter === "mergeSort" && !isSortingFinished
          }
          onClick={reset}
        >
          {counter > 0 ? "Reset" : "Shuffle"}
        </BlackButton>
        <div style={{ position: "relative" }}>
          <SorterSelect
            disabled={counter > 0}
            onChange={(e) => {
              const selectedSorterName =
                e.target.selectedOptions[0].textContent;
              if (selectedSorterName) setCurrentSorter(selectedSorterName);
            }}
          >
            {[
              { name: "bubbleSort", fn: () => setCurrentSorter("bubbleSort") },
              {
                name: "selectionSort",
                fn: () => setCurrentSorter("selectionSort"),
              },
              {
                name: "insertionSort",
                fn: () => setCurrentSorter("insertionSort"),
              },
              { name: "mergeSort", fn: () => setCurrentSorter("mergeSort") },
              { name: "quickSort", fn: () => setCurrentSorter("quickSort") },
              { name: "shellSort", fn: () => setCurrentSorter("shellSort") },
            ].map((sorter) => (
              <option key={sorter.name}>{sorter.name}</option>
            ))}
          </SorterSelect>
          {/* prettier-ignore */}
          <svg style={{position: "absolute", right: "10", top: "33%"}} width="10" height="8" viewBox="0 0 15 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.39631 10.5333L1.39631 3.86666C0.407453 2.54818 1.34822 0.666656 2.99631 0.666656H12.9963C14.6444 0.666656 15.5852 2.54818 14.5963 3.86666L9.59631 10.5333C8.79631 11.6 7.19631 11.6 6.39631 10.5333Z" fill="white"/>
</svg>
        </div>
      </div>
    </Container>
  );
};

export default SortOptions;
