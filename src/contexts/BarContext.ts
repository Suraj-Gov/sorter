import { createContext, Dispatch, SetStateAction } from "react";

interface BarContextState {
  barContext: React.RefObject<HTMLDivElement>[];
  setBarContext: Dispatch<SetStateAction<React.RefObject<HTMLDivElement>[]>>;
}

// @ts-ignore
// idk how to solve this ts requirement
const BarContext = createContext<BarContextState>(null);

export default BarContext;
