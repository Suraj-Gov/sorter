import React, { useState } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./styles/main.css";
import SpeedContext, { defaultSpeeds } from "./contexts/SpeedContext";

const Index = () => {
  const [speedContext, setSpeedContext] = useState(defaultSpeeds);
  return (
    // @ts-ignore
    <SpeedContext.Provider value={{ speedContext, setSpeedContext }}>
      <App />
    </SpeedContext.Provider>
  );
};

ReactDOM.render(<Index />, document.getElementById("root"));
