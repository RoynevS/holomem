const testValues = [
  "a", 
  "b", 
  "c", 
  "d", 
  "e", 
  "f", 
  "g", 
  "h", 
  "i", 
  "j", 
  "k", 
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "ö",
  "ä",
  "ü",
];


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
  let counter = 0;
  const rows = 6;
  const columns = 8;
  const board = [];

  const getRandomArray = () => {
    const gameArray = []

    while (gameArray.length < 24) {
      const randomIdol = testValues[Math.floor(Math.random() * testValues.length)];
      if (!gameArray.includes(randomIdol)) gameArray.push(randomIdol);
    }

    const fullArray = gameArray.concat([...gameArray]);

    for (let i = fullArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [fullArray[i], fullArray[j]] = [fullArray[j], fullArray[i]];
    }

    return fullArray;
  };

  const gameArray = getRandomArray();

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(card(gameArray[counter]));
      counter++;
    }
  }


  const getBoard = () => board;


  const printBoard = () => {
    const boardWithValues = board.map(row => row.map(card => card.getValue()));
    console.log(boardWithValues);
  }

  return { getBoard, printBoard };
}


function card(value) {
  const getValue = () => value;

  return { getValue };
}

const newBoard = gameboard();
newBoard.printBoard();
