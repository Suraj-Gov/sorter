import React, { useState } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import BarContext from "./contexts/BarContext";
import "./styles/main.css";

const Index = () => {
  const [barContext, setBarContext] = useState([]);

  return (
    // @ts-ignore
    <BarContext.Provider value={{ barContext, setBarContext }}>
      <App />
    </BarContext.Provider>
  );
};

ReactDOM.render(<Index />, document.getElementById("root"));
