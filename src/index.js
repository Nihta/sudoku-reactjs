import React from "react";
import ReactDOM from "react-dom";
import Sudoku from "./components/Sudoku";
import "./styles.css";

function App() {
  return (
    <div className="App">
      <Sudoku />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
