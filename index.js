const ROWS = 6;
const COLS = 7;
const THRESHOLD = 4;

function newGame() {
  return {
    winner: 0,
    playerToMove: 1,
    board: [[0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]]
  }
}

function findUnoccupiedRow(game, col) {
  const board = game.board;
  for (var i = board.length-1; i >= 0; i--) {
    if (board[i][col] === 0) return i;
  }
  return -1;
}

function inBounds(row, col)  {
  return row >= 0 && row < ROWS && col >= 0 && col < COLS;
}

function countInARow(game, row, col, dRow, dCol) {
  const board = game.board
  const player = game.playerToMove
  var sum = 1; //Count the slot that was just placed

  //Move forward through the line
  var rowIndex = row;
  var colIndex = col;
  while (true) {
    rowIndex += dRow;
    colIndex += dCol;
    if (!inBounds(rowIndex, colIndex)) {
      break;
    }
    
    if (board[rowIndex][colIndex] !== player) {
      break;
    }

    sum++;
  }

  //Move backward through the line
  rowIndex = row;
  colIndex = col;
  while (true) {
    rowIndex -= dRow;
    colIndex -= dCol;
    if (!inBounds(rowIndex, colIndex)) {
      break;
    }

    if (board[rowIndex][colIndex] !== player) {
      break;
    }

    sum++;
  }

  return sum;
}

function checkForWin(game, row, col) {
  //Check horizontal from position
  if (countInARow(game, row, col, 0, 1) >= THRESHOLD) {
    return true;
  }

  //Check vertical from position
  if (countInARow(game, row, col, 1, 0) >= THRESHOLD) {
    return true;
  }

  //Check upleft-downright diagonal
  if (countInARow(game, row, col, 1, 1) >= THRESHOLD) {
    return true;
  }

  //Check downleft-upright diagonal
  return countInARow(game, row, col, 1, -1) >= THRESHOLD;
}

function isDraw(game) {
  return game.board[0].reduce((draw, val) => {
    return draw && val !== 0;
  }, true);
}

function updateSlot(game, col) {
  var board = game.board;
  var winner = game.winner;
  var player = game.playerToMove;

  //Game is over, don't update
  if (winner !== 0) {
    return game;
  }

  var row = findUnoccupiedRow(game, col);
  if (row !== -1) { //If a piece can be placed in this column
    board[row][col] = player;

    if (checkForWin(game, row, col)) {
      winner = player;
    } else if (isDraw(game)) {
      winner = 3;
    }
    return {winner: winner, playerToMove: (player % 2) + 1, board: board};
  }
  return game;
}

function getStateFromActions(actions) {
  return actions.reduce((game, action) => {
    return updateSlot(game, action);
  }, newGame());
}

exports.newGame = newGame;
exports.updateSlot = updateSlot;
exports.getStateFromActions = getStateFromActions;
