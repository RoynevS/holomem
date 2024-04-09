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


function createPlayer(name, id) {
  let score = 0;
  const getID = () => id;
  const getName = () => name;
  const getScore = () => score;
  const increaseScore = () => score++;

  return {
    getName,
    getScore,
    increaseScore,
    getID,
  };
}


function gameboard() {
  let counter = 0;
  const rows = 6;
  const columns = 8;
  const board = [];


  const createGameArray = () => {
    const gameArray = [];

    while (gameArray.length < 48) {
      const randomIdol = testValues[Math.floor(Math.random() * testValues.length)];
      if (!gameArray.includes(randomIdol.firstName)) {
        gameArray.push(randomIdol.firstName, randomIdol.lastName);
      }
    }

    return gameArray;
  }


  const gameArray = createGameArray();


  const getGameArray = () => gameArray;


  const randomizeGameArray = () => {
    const randomizedGameArray = [...getGameArray()];

    /*
     * Randomly shuffles the elements of the array
     * Using Fisher-Yates algorithm
     */
    for (let i = randomizedGameArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [randomizedGameArray[i], randomizedGameArray[j]] = [randomizedGameArray[j], randomizedGameArray[i]];
    }

    return randomizedGameArray;
  };


  const idolArray = randomizeGameArray();

  // fill board array with cells
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

  return { 
    getBoard, 
    printBoard, 
    getGameArray,
  };
}


function card(value) {
  const getValue = () => value;

  return { getValue };
}


function gameController() {
  const players = [createPlayer("Player 1", 1), createPlayer("Player 2", 2)];

  const board = gameboard();

  let activePlayer = players[0];


  const switchPlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };


  const getActivePlayer = () => activePlayer;


  const playRound = (updateScreen, lastPressedBtn) => {
    let activeCardCounter = 0;
    const activeCards = [];

    const buttons = document.querySelectorAll(".card");
    buttons.forEach(button => {
      if (button.classList.contains("active")) {
        activeCards.push(button);
        activeCardCounter++;
      };
    });

    if (activeCardCounter > 2) {
      lastPressedBtn.classList.remove("active");
    }
    
    if (activeCardCounter === 2) {
      const pair = activeCards[0].dataset.name === activeCards[1].dataset.name ? true : false;
      checkForPair(pair, activeCards, buttons, updateScreen);
    }
  };


  const checkForPair = (pair, activeCards, buttons,updateScreen) => {
    if (!pair) {
      setTimeout(function() {
        for (card of activeCards) {
          card.classList.remove("active");
        }
        switchPlayer();
        updateScreen();
      }, 2000);
    } else if (pair) {
      for (card of activeCards) {
        card.classList.remove("active");
        card.classList.add("permanent");
      }
      getActivePlayer().increaseScore();
      updateScreen()
    }

    const classes = [];
    buttons.forEach(button => classes.push(button.classList.value));
    if (classes.every(value => value === "card permanent")) endGame();
  };


  const endGame = () => {
    console.log(`${getActivePlayer().getName()} wins!`);
  };
  

  return {
    getActivePlayer,
    playRound,
    getBoard: board.getBoard,
    getGameArray: board.getGameArray,
  };
}


function screenController() {
  const game = gameController();
  const playerTurnDiv = document.querySelector(".active-player");
  const cardsDiv = document.querySelector(".card-container");
  const player1Score = document.querySelector(".player-1-section > .score");
  const player2Score = document.querySelector(".player-2-section > .score");
  

  const setScreen = () => {
    const activePlayer = game.getActivePlayer();
    const board = game.getBoard();

    player1Score.textContent = 0;
    player2Score.textContent = 0;

    playerTurnDiv.textContent = `${activePlayer.getName()}'s turn...`;

    board.forEach(row => {
      row.forEach((cell) => {
        const cellBtn = document.createElement("button");
        const textPara = document.createElement("span");
        textPara.textContent = cell.getValue();
        textPara.classList.add("card-text");
        cellBtn.appendChild(textPara);
        cellBtn.classList.add("card");

        /*
         * first check if value of cell is even or odd to check for first name.
         * if even then it's first name and we keep it, else its the last name so
         * we subtract 1 to get the matching first name.
         */
        const index = game.getGameArray().indexOf(cell.getValue()) % 2 === 0 ? game.getGameArray().indexOf(cell.getValue()) : game.getGameArray().indexOf(cell.getValue()) - 1
        const name = game.getGameArray()[index];
        cellBtn.dataset.name = name;
        cardsDiv.appendChild(cellBtn);
      })
    })
  };


  const updateScreen = () => {
    const activePlayer = game.getActivePlayer();
    playerTurnDiv.textContent = `${activePlayer.getName()}'s turn...`;
    activePlayer.getID() === 1 ? 
      player1Score.textContent = activePlayer.getScore() : 
      player2Score.textContent = activePlayer.getScore();
  };


  function clickHandlerBoard(e) {
    const selectedName = e.target.dataset.name;
    if (!selectedName) return;

    e.target.classList.add("active");
    game.playRound(updateScreen, e.target);
  }

  
  cardsDiv.addEventListener("click", clickHandlerBoard);
  

  setScreen();
}

screenController();