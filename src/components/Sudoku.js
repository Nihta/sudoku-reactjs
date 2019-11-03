import React, { Component } from "react";
import "./sudoku.css";

class SudokuGenerator {
  constructor(grid) {
    this.grid = grid;
    this.nums = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    this.chars = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
  }
  // Xóa trộn array
  shuffleArray(array) {
    for (let i = array.length; i; i--) {
      let j = Math.floor(Math.random() * i);
      [array[i - 1], array[j]] = [array[j], array[i - 1]];
    }
  }
  // Xáo trộn grid sudoku
  shuffleGrid() {
    var nums,
      chars,
      shuffledNums,
      shuffledChars,
      index1,
      index2,
      index3,
      index,
      rotate,
      numMap,
      charMap,
      tempGrid,
      grid;
    grid = this.grid;
    nums = this.nums.slice();
    chars = this.chars.slice();
    index1 = [0, 1, 2];
    index2 = [3, 4, 5];
    index3 = [6, 7, 8];
    // shuffle symbols
    shuffledNums = nums.slice();
    shuffledChars = [];
    this.shuffleArray(shuffledNums);
    for (let num of shuffledNums) {
      shuffledChars.push(chars[parseInt(num, 10) - 1]);
    }
    numMap = new Map();
    charMap = new Map();
    for (let i = 0; i < 9; i++) {
      numMap.set(nums[i], shuffledNums[i]);
    }
    for (let i = 0; i < 9; i++) {
      charMap.set(chars[i], shuffledChars[i]);
    }
    tempGrid = "";
    for (let c of grid) {
      if (numMap.has(c)) {
        tempGrid += numMap.get(c);
      } else {
        tempGrid += charMap.get(c);
      }
    }
    grid = tempGrid;
    // shuffle rows
    this.shuffleArray(index1);
    this.shuffleArray(index2);
    this.shuffleArray(index3);
    index = index1.concat(index2).concat(index3);
    tempGrid = "";
    for (let i of index) {
      tempGrid += grid.slice(i * 9, i * 9 + 9);
    }
    grid = tempGrid;
    // shuffle cols
    this.shuffleArray(index1);
    this.shuffleArray(index2);
    this.shuffleArray(index3);
    index = index1.concat(index2).concat(index3);
    tempGrid = "";
    for (let i = 0; i < 9; i++) {
      for (let j of index) {
        tempGrid += grid.slice(i * 9, i * 9 + 9)[j];
      }
    }
    grid = tempGrid;
    // shuffle blockRows
    this.shuffleArray(index1);
    tempGrid = "";
    for (let i of index1) {
      tempGrid += grid.slice(i * 3 * 9, i * 3 * 9 + 27);
    }
    grid = tempGrid;
    // shuffle blockCols
    this.shuffleArray(index1);
    tempGrid = "";
    for (let i = 0; i < 9; i++) {
      for (let j of index1) {
        tempGrid += grid.slice(i * 9, i * 9 + 9).slice(j * 3, j * 3 + 3);
      }
    }
    grid = tempGrid;
    // rotate left | none | right
    tempGrid = "";
    rotate = [-1, 0, 1][Math.floor(Math.random() * 3)];
    if (rotate === 0) {
    } else if (rotate === -1) {
      for (let i = 8; i >= 0; i--) {
        for (let j = 0; j <= 8; j++) {
          tempGrid += grid[j * 9 + i];
        }
      }
      grid = tempGrid;
    } else {
      for (let i = 0; i <= 8; i++) {
        for (let j = 8; j >= 0; j--) {
          tempGrid += grid[j * 9 + i];
        }
      }
      grid = tempGrid;
    }
    return grid;
  }

  generate() {
    var numSet = new Set(this.nums);
    var charSet = new Set(this.chars);
    var map = new Map();
    for (let i = 0; i <= 8; i++) {
      map.set(this.chars[i], this.nums[i]);
    }
    var pattern = this.shuffleGrid();
    var puzzle = [];
    for (let i = 0; i <= 8; i++) {
      let row = [];
      for (let j = 0; j <= 8; j++) {
        if (numSet.has(pattern[9 * i + j])) {
          row.push(pattern[9 * i + j]);
        } else {
          row.push(null);
        }
      }
      puzzle.push(row);
    }
    var solution = [];
    for (let i = 0; i <= 8; i++) {
      let row = [];
      for (let j = 0; j <= 8; j++) {
        if (charSet.has(pattern[9 * i + j])) {
          row.push(map.get(pattern[9 * i + j]));
        } else {
          row.push(pattern[9 * i + j]);
        }
      }
      solution.push(row);
    }
    return [puzzle, solution];
  }
}
const sudokus = {
  // 589213468
  easy:
    "CD58GA92FGBFC49851H912EFDG3IA342G56HB546H3AIG687915C4B4GIA3B6HEAF259HGCDEC8G64BA9",
  medium:
    "I468C21EGAB8G4ECIFE73AI6B846IBCGHD1E81EDBIGF3GCD56AIBH4F9B5GHCACEA98467B2HGF1CED9",
  hard:
    "51CIH4F7BFI42EGH3AHGB6ACED93DGEFAIBHA5HD2I7FC9BF37H4AEBH174E3IFDFI8CBA57GCEAI6BHD"
};

class Square extends Component {
  render() {
    return (
      <td style={this.props.style} onClick={this.props.onClick}>
        {this.props.value}
      </td>
    );
  }
}

// Render hàng 9 square dựa vào this.props.arrRow
class Row extends Component {
  setStyleSquare(row, col) {
    const styleSquare = {
      origin: {
        backgroundColor: "rgba(178, 190, 195, 0.25)"
      },
      chosen: {
        backgroundColor: "#badc58"
      },
      highlight: {
        backgroundColor: "rgba(52, 168, 83, 0.2)"
      },
      filter: {
        backgroundColor: "rgba(52, 168, 83, 0.5)"
      },
      conflict: {
        backgroundColor: "#ff7979"
      }
    };

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
        value={val}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <tr>
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

// Board render ra row
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
    const sudokuInit = new SudokuGenerator(sudokus.easy).generate();
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
      filter: new Set(), // Đặt là
      highlight: new Set(), // null
      conflict: new Set() // sẽ gây lỗi
    };
  }

  // Tạo trò chơi mới với level
  generatePuzzle(level) {
    let dataInput;
    if (level === "easy") dataInput = sudokus.easy;
    else if (level === "medium") dataInput = sudokus.medium;
    else if (level === "hard") dataInput = sudokus.hard;
    const sudokuInit = new SudokuGenerator(dataInput).generate();
    this.puzzle = sudokuInit[0];
    this.solution = sudokuInit[1];
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
      conflict: new Set()
    });
  }

  // Tìm những values có thể điền vào square (xét 20 square liên quan tới nó)
  valuesPossibleSquare(row, col) {
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
      if (valuesPossible.has(grid[row][k])) {
        valuesPossible.delete(grid[row][k]);
      }
    }
    // Check cột
    for (let k = 0; k < 9; k++) {
      if (k === row)
        // Không xét chính nó
        continue;
      if (valuesPossible.has(grid[k][col])) {
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
        if (valuesPossible.has(grid[m][n])) {
          valuesPossible.delete(grid[m][n]);
        }
      }
    }

    return valuesPossible;
  }

  // Thay đổi state filter và hightlight
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

  handleOnClickSquare(row, col) {
    this.highlightSquare(row, col);
    this.setState({
      chosen: [row, col]
    });
  }

  renderChoose(value) {
    return (
      <button onClick={() => this.handClickChooseValue(value)}>{value}</button>
    );
  }

  // Khi điền một value vào square
  handClickChooseValue(value) {
    // Nếu chưa chọn square nào thì không làm gì hết
    if (!this.state.chosen) return;
    const row = this.state.chosen[0];
    const col = this.state.chosen[1];

    // Nếu như đây là square origin thì không làm gì hết
    if (this.state.gridOrigin.has(row + "." + col)) return;

    // Cập nhật grid
    const grid = this.state.grid;
    if (grid[row][col] === value.toString()) grid[row][col] = "";
    else grid[row][col] = value.toString(); // Lưu ý: value phải type string

    this.highlightSquare(row, col);

    // Cập nhật conflic
    var conflict = new Set();
    for (let i = 0; i < 9; i++)
      for (let j = 0; j < 9; j++)
        if (grid[i][j]) {
          const valuesPossible = this.valuesPossibleSquare(i, j);
          if (!valuesPossible.has(grid[i][j])) conflict.add(i + "." + j);
        }

    this.setState({
      grid: grid,
      conflict: conflict
    });

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

  clear() {
    this.setState({
      grid: JSON.parse(JSON.stringify(this.puzzle)), // deep copy
      chosen: null,
      filter: new Set(),
      highlight: new Set(),
      conflict: new Set()
    });
  }

  showSolution() {
    this.setState({
      grid: JSON.parse(JSON.stringify(this.solution)), // deep copy
      chosen: null,
      filter: new Set(),
      highlight: new Set(),
      conflict: new Set()
    });
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
          onClick={(row, col) => this.handleOnClickSquare(row, col)}
        />

        <div className="choose-number">
          {this.renderChoose(1)}
          {this.renderChoose(2)}
          {this.renderChoose(3)}
          {this.renderChoose(4)}
          {this.renderChoose(5)}
          {this.renderChoose(6)}
          {this.renderChoose(7)}
          {this.renderChoose(8)}
          {this.renderChoose(9)}
        </div>

        <div className="control">
          <button onClick={() => this.showSolution()}>Show đáp án</button>
          <button onClick={() => this.clear()}>Clear all</button>
        </div>
      </div>
    );
  }
}

export default Sudoku;
