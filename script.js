const testValues = [
  {
    firstName: "Sora",
    lastName: "Tokino",
  },
  {
    firstName: "Roboco",
    lastName: "Roboco San",
  },
  {
    firstName: "Miko",
    lastName: "Sakura",
  },
  {
    firstName: "Suisei",
    lastName: "Hoshimachi",
  },
  {
    firstName: "AZKi",
    lastName: "AZKi",
  },
  {
    firstName: "Rosenthal",
    lastName: "Aki",
  },
  {
    firstName: "Haato",
    lastName: "Akai",
  },
  {
    firstName: "Aqua",
    lastName: "Minato",
  },
  {
    firstName: "Shion",
    lastName: "Murasaki",
  },
  {
    firstName: "Fubuki",
    lastName: "Shirakami",
  },
  {
    firstName: "Matsuri",
    lastName: "Natsuiro",
  },
  {
    firstName: "Ayame",
    lastName: "Nakiri",
  },
  {
    firstName: "Choco",
    lastName: "Yuzuki",
  },
  {
    firstName: "Subaru",
    lastName: "Oozora",
  },
  {
    firstName: "Mio",
    lastName: "Ookami",
  },
  {
    firstName: "Okayu",
    lastName: "Nekomata",
  },
  {
    firstName: "Korone",
    lastName: "Inugami",
  },
  {
    firstName: "Pekora",
    lastName: "Usada",
  },
  {
    firstName: "Flare",
    lastName: "Shiranui",
  },
  {
    firstName: "Noel",
    lastName: "Shirogane",
  },
  {
    firstName: "Marine",
    lastName: "Houshou",
  },
  {
    firstName: "Kanata",
    lastName: "Amane",
  },
  {
    firstName: "Watame",
    lastName: "Tsunomaki",
  },
  {
    firstName: "Towa",
    lastName: "Tokoyami",
  },
  {
    firstName: "Luna",
    lastName: "Himemori",
  },
  {
    firstName: "Kiara",
    lastName: "Takanashi",
  },
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


  const getGameArray = () => {
    const gameArray = [];

    while (gameArray.length < 48) {
      const randomIdol = testValues[Math.floor(Math.random() * testValues.length)];
      if (!gameArray.includes(randomIdol.firstName)) {
        gameArray.push(randomIdol.firstName, randomIdol.lastName);
      }
    }

    // Randomly shuffles the elements of the array
    // Using Fisher-Yates algorithm
    for (let i = gameArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gameArray[i], gameArray[j]] = [gameArray[j], gameArray[i]];
    }

    console.log(gameArray);
    return gameArray;
  }

  const idolArray = getGameArray()

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(card(idolArray[counter]));
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


function gameController() {
  const players = [createPlayer("Player 1"), createPlayer("Player 2")];

  const board = gameboard();

  let activePlayer = players[0];

  const switchPlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().getName()}'s turn.`);
  };

  const playRound = () => {
    switchPlayer();
    printNewRound();
  };
  
  printNewRound();

  return {
    getActivePlayer,
    playRound,
  };
}

const game = gameController();