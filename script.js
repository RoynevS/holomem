function createPlayer(name) {
  let score = 0;
  const getName = () => name;
  const getScore = () => score;
  const increaseScore = () => score++;

  return {
    getName,
    getScore,
    increaseScore,
  };
}

function gameboard() {
  const rows = 6;
  const columns = 8;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(card());
    }
  }

  const getBoard = () => board;

  const printBoard = () => {
    const boardWithValues = board.map(row => row.map(card => card.getValue()));
    console.log(boardWithValues);
  }

  return { getBoard, printBoard };
}

function card() {
  let value = 0;

  const getValue = () => value;

  return { getValue };
}

const newBoard = gameboard();
console.log(newBoard.printBoard());