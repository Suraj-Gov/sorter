import { createContext } from "react";
import { Dispatch, SetStateAction } from "react";

export type SpeedContextType = {
  operationsInterval: number;
  swapAnimationDuration: number;
};

type SpeedContextState = {
  speedContext: SpeedContextType;
  setSpeedContext: Dispatch<SetStateAction<SpeedContextType>>;
};

export const defaultSpeeds: SpeedContextType = {
  operationsInterval: 500,
  swapAnimationDuration: 350,
};

// @ts-ignore
const SpeedContext = createContext<SpeedContextState>(null);

export default SpeedContext;
