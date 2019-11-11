import React, { Component } from "react";
import "./sudoku.css";
import SudokuGenerator from "./SudokuGenerator";

class Square extends Component {
  renderNote() {
    const valueNote = this.props.value;
    return (
      <table className="note">
        <tbody>
          <tr className="sudoku-tr">
            <td className="note-td">{valueNote[1] ? 1 : " "}</td>
            <td className="note-td">{valueNote[2] ? 2 : " "}</td>
            <td className="note-td">{valueNote[3] ? 3 : " "}</td>
          </tr>
          <tr className="note">
            <td className="note-td">{valueNote[4] ? 4 : " "}</td>
            <td className="note-td">{valueNote[5] ? 5 : " "}</td>
            <td className="note-td">{valueNote[6] ? 6 : " "}</td>
          </tr>
          <tr className="note">
            <td className="note-td">{valueNote[7] ? 7 : " "}</td>
            <td className="note-td">{valueNote[8] ? 8 : " "}</td>
            <td className="note-td">{valueNote[9] ? 9 : " "}</td>
          </tr>
        </tbody>
      </table>
    );
  }

  render() {
    if (typeof this.props.value !== "string") {
      // Render value note
      return (
        <td
          className="sudoku-td"
          style={this.props.style}
          onClick={this.props.onClick}
        >
          {this.renderNote()}
        </td>
      );
    } else {
      // Render square bình thường
      return (
        <td
          className="sudoku-td"
          style={this.props.style}
          onClick={this.props.onClick}
        >
          {this.props.value}
        </td>
      );
    }
  }
}

// Render hàng 9 square dựa vào this.props.arrRow
class Row extends Component {
  setStyleSquare(row, col) {
    let resStyle = {};
    // Ô origin hay ô người nhập vào
    if (this.props.gridOrigin.has(row + "." + col))
      resStyle.backgroundColor = "rgba(178, 190, 195, 0.25)";
    else resStyle.color = "rgba(27, 156, 252,1.0)";

    if (this.props.highlight.has(row + "." + col))
      resStyle.backgroundColor = "rgba(52, 168, 83, 0.2)";

    if (this.props.filter && this.props.filter.has(row + "." + col))
      resStyle.backgroundColor = "rgba(52, 168, 83, 0.5)";

    if (
      this.props.chosen &&
      this.props.chosen[0] === row &&
      this.props.chosen[1] === col
    )
      resStyle.backgroundColor = "#badc58";

    if (this.props.conflict && this.props.conflict.has(row + "." + col))
      resStyle.backgroundColor = "#ff7979";

    return resStyle;
  }

  renderSquare(i) {
    const arrRow = this.props.arrRow;
    const val = arrRow[i] ? arrRow[i] : "";
    const styleSquare = this.setStyleSquare(this.props.row, i);
    return (
      <Square
        style={styleSquare}
        chosen={this.props.chosen}
        value={val}
        note={this.props.note}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <tr className="sudoku-tr">
        {this.renderSquare(0)}
        {this.renderSquare(1)}
        {this.renderSquare(2)}
        {this.renderSquare(3)}
        {this.renderSquare(4)}
        {this.renderSquare(5)}
        {this.renderSquare(6)}
        {this.renderSquare(7)}
        {this.renderSquare(8)}
      </tr>
    );
  }
}

// Board render row
class Board extends Component {
  renderRow(i) {
    return (
      <Row
        row={i}
        arrRow={this.props.grid[i]}
        gridOrigin={this.props.gridOrigin}
        highlight={this.props.highlight}
        filter={this.props.filter}
        conflict={this.props.conflict}
        chosen={this.props.chosen}
        onClick={col => this.props.onClick(i, col)}
        note={this.props.note}
      />
    );
  }
  render() {
    return (
      <table className="sudoku">
        <tbody>
          {this.renderRow(0)}
          {this.renderRow(1)}
          {this.renderRow(2)}
          {this.renderRow(3)}
          {this.renderRow(4)}
          {this.renderRow(5)}
          {this.renderRow(6)}
          {this.renderRow(7)}
          {this.renderRow(8)}
        </tbody>
      </table>
    );
  }
}

class Sudoku extends Component {
  constructor(props) {
    super(props);
    const sudokuInit = new SudokuGenerator("easy").generate();
    this.puzzle = sudokuInit[0]; // Cần đảm bảo immutability (sử dụng deep copy)
    this.solution = sudokuInit[1]; // Cần đảm bảo immutability (sử dụng deep copy)
    this.solutionTypeString = this.solution.toString();

    // Chuyển qua dạng set sẽ dễ sử dụng hơn
    const gridOrigin = new Set();
    for (let i = 0; i < 9; i++)
      for (let j = 0; j < 9; j++)
        if (this.puzzle[i][j]) gridOrigin.add(i + "." + j);

    this.state = {
      gridOrigin: gridOrigin,
      grid: JSON.parse(JSON.stringify(this.puzzle)), // deep copy
      chosen: null,
      filter: new Set(),
      highlight: new Set(),
      conflict: new Set(),
      isNoteMode: false
    };
  }

  // Tạo trò chơi mới với level
  generatePuzzle(level) {
    [this.puzzle, this.solution] = new SudokuGenerator(level).generate();
    this.solutionTypeString = this.solution.toString();

    const gridOrigin = new Set();
    for (let i = 0; i < 9; i++)
      for (let j = 0; j < 9; j++)
        if (this.puzzle[i][j]) gridOrigin.add(i + "." + j);

    this.setState({
      gridOrigin: gridOrigin,
      grid: JSON.parse(JSON.stringify(this.puzzle)),
      chosen: null,
      filter: new Set(),
      highlight: new Set(),
      conflict: new Set(),
      isNoteMode: false
    });
  }

  // Tìm những values có khả năng điền vào square (xét 20 square liên quan tới nó)
  valuesPossible(row, col) {
    const grid = this.state.grid;
    const valuesPossible = new Set([
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9"
    ]);
    // Check hàng
    for (let k = 0; k < 9; k++) {
      if (k === col)
        // Không xét chính nó
        continue;
      if (
        typeof grid[row][k] === "string" &&
        valuesPossible.has(grid[row][k])
      ) {
        valuesPossible.delete(grid[row][k]);
      }
    }
    // Check cột
    for (let k = 0; k < 9; k++) {
      if (k === row)
        // Không xét chính nó
        continue;
      if (
        typeof grid[k][col] === "string" &&
        valuesPossible.has(grid[k][col])
      ) {
        valuesPossible.delete(grid[k][col]);
      }
    }
    // Check box 3x3
    const x = Math.floor(row / 3) * 3;
    const y = Math.floor(col / 3) * 3;
    for (let m = x; m < x + 3; m++) {
      for (let n = y; n < y + 3; n++) {
        if (m === row && n === col)
          // Không xét chính nó
          continue;
        if (typeof grid[m][n] === "string" && valuesPossible.has(grid[m][n])) {
          valuesPossible.delete(grid[m][n]);
        }
      }
    }
    return valuesPossible;
  }

  // Tô sáng các ô liên quan chosen (thay đổi state filter và hightlight)
  highlightSquare(i, j) {
    const grid = this.state.grid;

    const valueFilter = grid[i][j] ? grid[i][j] : 10; // 10 thì sẽ !== null

    // Tô những ô có cùng value
    let filter = new Set();
    for (let m = 0; m < 9; m++)
      for (let n = 0; n < 9; n++)
        if (grid[m][n] === valueFilter) filter.add(m + "." + n);

    const highlight = new Set();
    // Tô sáng hàng
    for (let k = 0; k < 9; k++) {
      if (!filter.has(i + "." + k)) highlight.add(i + "." + k);
    }
    // Tô sáng toàn cột
    for (let k = 0; k < 9; k++) {
      if (!filter.has(k + "." + j)) highlight.add(k + "." + j);
    }
    // Tô sáng box 3x3
    const line = Math.floor(i / 3) * 3;
    const row = Math.floor(j / 3) * 3;
    for (let ln = line; ln < line + 3; ln++)
      for (let r = row; r < row + 3; r++) {
        if (!filter.has(ln + "." + r)) highlight.add(ln + "." + r);
      }

    this.setState({
      highlight: highlight,
      filter: filter
    });
  }

  // Khi click vào một square
  handleOnClickSquare(row, col) {
    this.highlightSquare(row, col);
    this.setState({
      chosen: [row, col]
    });
  }

  updateConflict() {
    const grid = this.state.grid;
    var conflict = new Set();
    for (let row = 0; row < 9; row++)
      for (let col = 0; col < 9; col++)
        if (grid[row][col] && !Array.isArray(grid[row][col])) {
          const valuesPossible = this.valuesPossible(row, col);
          if (!valuesPossible.has(grid[row][col]))
            conflict.add(row + "." + col);
        }
    this.setState({
      conflict: conflict
    });
  }

  // Khi click vào button choose value
  handClickChooseValue(value) {
    // Nếu chưa chọn square nào thì không làm gì hết
    if (!this.state.chosen) return;

    const row = this.state.chosen[0];
    const col = this.state.chosen[1];

    // Nếu như đây là square origin thì không làm gì hết
    if (this.state.gridOrigin.has(row + "." + col)) return;

    const grid = this.state.grid;

    // Nếu như bật note mode
    if (this.state.isNoteMode) {
      // Nếu chưa note lần nào
      if (
        !grid[row][col] ||
        grid[row][col] === "" ||
        typeof grid[row][col] === "string"
      )
        grid[row][col] = [];

      grid[row][col][value] = grid[row][col][value] ? false : true;

      this.highlightSquare(row, col);

      this.updateConflict();
      this.setState({
        grid: grid,
        filter: new Set()
      });
      return;
    }

    // Cập nhật grid
    if (grid[row][col] === value.toString()) grid[row][col] = "";
    else grid[row][col] = value.toString(); // Lưu ý: value phải type string
    // Tiến hành tô sáng lại
    this.highlightSquare(row, col);

    this.updateConflict();

    this.setState({
      grid: grid
    });

    // Kiểm tra xem đã win game hay chưa
    if (grid.toString() === this.solutionTypeString) {
      this.setState({
        chosen: null,
        filter: new Set(),
        highlight: new Set(),
        conflict: new Set()
      });
      alert("Win cmnr!");
    }
  }

  note() {
    const noteModeCurr = this.state.isNoteMode;
    this.setState({
      isNoteMode: !noteModeCurr
    });
  }

  // Khôi phục grid trở về grid orgin
  clear() {
    this.setState({
      grid: JSON.parse(JSON.stringify(this.puzzle)), // deep copy
      chosen: null,
      filter: new Set(),
      highlight: new Set(),
      conflict: new Set()
    });
  }

  // Hiện thị solution
  showSolution() {
    this.setState({
      grid: JSON.parse(JSON.stringify(this.solution)), // deep copy
      chosen: null,
      filter: new Set(),
      highlight: new Set(),
      conflict: new Set()
    });
  }

  // Xem value đúng (theo solution) tại square chosen
  viewSquareSolution() {
    const chosen = this.state.chosen;
    if (chosen) {
      const row = chosen[0];
      const col = chosen[1];
      this.handClickChooseValue(this.solution[row][col]);
    }
  }

  // Render button chọn value
  renderButtonChoose(value) {
    return (
      <button onClick={() => this.handClickChooseValue(value)}>{value}</button>
    );
  }

  render() {
    return (
      <div className="game">
        <div className="choose-level">
          <button onClick={() => this.generatePuzzle("easy")}>Dễ</button>
          <button onClick={() => this.generatePuzzle("medium")}>
            Trung Bình
          </button>
          <button onClick={() => this.generatePuzzle("hard")}>Khó</button>
        </div>

        <Board
          grid={this.state.grid}
          gridOrigin={this.state.gridOrigin}
          highlight={this.state.highlight}
          filter={this.state.filter}
          conflict={this.state.conflict}
          chosen={this.state.chosen}
          note={this.state.note}
          onClick={(row, col) => this.handleOnClickSquare(row, col)}
        />

        <div className="choose-number">
          {this.renderButtonChoose(1)}
          {this.renderButtonChoose(2)}
          {this.renderButtonChoose(3)}
          {this.renderButtonChoose(4)}
          {this.renderButtonChoose(5)}
          {this.renderButtonChoose(6)}
          {this.renderButtonChoose(7)}
          {this.renderButtonChoose(8)}
          {this.renderButtonChoose(9)}
        </div>

        <div className="control">
          <button onClick={() => this.showSolution()}>Show solution</button>
          <button onClick={() => this.clear()}>Clear all board</button>
          <button onClick={() => this.viewSquareSolution()}>Show</button>
          <ButtonNote
            isNoteMode={this.state.isNoteMode}
            onClick={() => this.note()}
          />
        </div>
      </div>
    );
  }
}

export default Sudoku;

class ButtonNote extends Component {
  render() {
    const style = {};
    if (this.props.isNoteMode) style.color = "red";
    return (
      <button style={style} onClick={this.props.onClick}>
        Note
      </button>
    );
  }
}
