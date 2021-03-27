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
  padding: 0.4rem;
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

const ShuffleButton = styled.button`
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
            ? "Sorted"
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
        <ShuffleButton
          style={{}}
          disabled={!isSortingFinished && counter > 0}
          onClick={reset}
        >
          Shuffle
        </ShuffleButton>
        <SorterSelect
          disabled={counter > 0}
          onChange={(e) => {
            const selectedSorterName = e.target.selectedOptions[0].textContent;
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
      </div>
    </Container>
  );
};

export default SortOptions;
