/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  //
  for (let y = 0; y < HEIGHT; y++) {
    board.push(Array.from({length: WIDTH}));
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.getElementById("board");//retrives board element from HTML
  const top = document.createElement("tr");//creates the top row 
  top.setAttribute("id", "column-top");//sets that top row to have an id of column-top
  top.addEventListener("click", handleClick);//adds a click listener to the top row

  // creates the cells for the board by iterating over each column with respect to the top row
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td"); //creates table cell element 
    headCell.setAttribute("id", x);// sets this element to have the id of x, which means the cells now have the id of WIDTH -1 to 0
    top.append(headCell);//appends cell to top row
  }
  htmlBoard.append(top);// appends top to the board

  //create cell elements for the other rows, looping over HEIGHT first.
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");//creating the row elements 
    for (let x = 0; x < WIDTH; x++) {        //looping through the rows, with respect to WIDTH 
      const cell = document.createElement("td");//creating table cells for each cell in each row
      cell.setAttribute("id", `${y}-${x}`);// setting the attribute of the cells to an id used to show position of row and column
      row.append(cell);// appends the cell to the row
    }
    htmlBoard.append(row);// appends row to the board
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
    for(let y = HEIGHT-1; y>=0; y--){
      if(!board[y][x]){
        return y;
      }
    }
    return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  const piece = document.createElement('div');
  piece.classList.add('piece');
  piece.classList.add(`p${currPlayer}`);
  
  const spot = document.getElementById(`${y}-${x}`);
  spot.append(piece);

}

/** endGame: announce game end */


function endGame(msg) {
  setTimeout(()=>{
    alert(msg);
    window.location.reload();
  }, 300)
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board

  placeInTable(y, x);
  board[y][x] = currPlayer;

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);

  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  if (board.every(row => row.every(cell => cell))) {// checks every row is filled, then checks if every cell is filled. if true, tie.
    return endGame('Tie!');
  }
  // switch players
  // TODO: switch currPlayer 1 <-> 2
  currPlayer = currPlayer === 1 ? 2 : 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      // below the code is testing for possible variations for a win based off chip position and matches it with the above code that tests for if the chips are currPlayer
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {// if any are true, return true and runs endgame
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
