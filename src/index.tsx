import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./styles/main.css";

const Index = () => {
  return (
    // @ts-ignore
    <App />
  );
};

ReactDOM.render(<Index />, document.getElementById("root"));
