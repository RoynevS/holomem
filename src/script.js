import members from "./holo-members.json";
import "./styles/style.css";

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
      const randomIdol = members[Math.floor(Math.random() * members.length)];
      const fullName = `${randomIdol.firstName} ${randomIdol.lastName}`;
      if (!gameArray.includes(fullName))
        gameArray.push(fullName, randomIdol.image);
    }

    return gameArray;
  };

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
      [randomizedGameArray[i], randomizedGameArray[j]] = [
        randomizedGameArray[j],
        randomizedGameArray[i],
      ];
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
    const boardWithValues = board.map((row) =>
      row.map((card) => card.getValue())
    );
    console.log(boardWithValues);
  };

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

  const playRound = (updateScreen, lastPressedBtn, endScreen) => {
    let activeCardCounter = 0;
    const activeCards = [];

    const buttons = document.querySelectorAll(".card");
    buttons.forEach((button) => {
      if (button.classList.contains("active")) {
        activeCards.push(button);
        activeCardCounter++;
      }
    });

    if (activeCardCounter > 2) {
      lastPressedBtn.classList.remove("active");
    }

    if (activeCardCounter === 2) {
      const pair =
        activeCards[0].dataset.name === activeCards[1].dataset.name
          ? true
          : false;
      checkForPair(pair, activeCards, buttons, updateScreen, endScreen);
    }
  };

  const checkForPair = (
    pair,
    activeCards,
    buttons,
    updateScreen,
    endScreen
  ) => {
    if (!pair) {
      setTimeout(function () {
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
      updateScreen();
    }

    const classes = [];
    buttons.forEach((button) => classes.push(button.classList.value));
    if (classes.every((value) => value === "card permanent")) endScreen();
  };

  const checkWinner = () => {
    if (players[0].getScore() === players[1].getScore()) {
      return `It's a draw`;
    }
    if (players[0].getScore() > players[1].getScore()) {
      return `Congratulations ${players[0].getName()}, you win!`;
    }
    return `Congratulations ${players[1].getName()}, you win!`;
  };

  return {
    getActivePlayer,
    playRound,
    getBoard: board.getBoard,
    getGameArray: board.getGameArray,
    checkWinner,
  };
}

function screenController() {
  const game = gameController();
  const playerTurnDiv = document.querySelector(".active-player");
  const cardsDiv = document.querySelector(".card-container");
  const player1Score = document.querySelector(".player-1-section > .score");
  const player2Score = document.querySelector(".player-2-section > .score");
  const replayBtn = document.querySelector(".replay-btn");

  const setScreen = () => {
    const activePlayer = game.getActivePlayer();
    const board = game.getBoard();

    player1Score.textContent = 0;
    player2Score.textContent = 0;

    playerTurnDiv.textContent = `${activePlayer.getName()}'s turn...`;

    board.forEach((row) => {
      row.forEach((cell) => {
        const cellBtn = document.createElement("button");
        const cellText = cell.getValue();
        if (cellText.includes("../")) {
          const image = new Image();
          image.src = cellText;
          image.classList.add("image");
          cellBtn.appendChild(image);
        } else {
          const textPara = document.createElement("span");
          textPara.textContent = cellText;
          textPara.classList.add("card-text");
          cellBtn.appendChild(textPara);
        }
        cellBtn.classList.add("card");

        /*
         * first check if value of cell is even or odd to check for first name.
         * if even then it's first name and we keep it, else its the last name so
         * we subtract 1 to get the matching first name.
         */
        const index =
          game.getGameArray().indexOf(cell.getValue()) % 2 === 0
            ? game.getGameArray().indexOf(cell.getValue())
            : game.getGameArray().indexOf(cell.getValue()) - 1;
        const name = game.getGameArray()[index];
        cellBtn.dataset.name = name;
        cardsDiv.appendChild(cellBtn);
      });
    });
  };

  const updateScreen = () => {
    const activePlayer = game.getActivePlayer();
    playerTurnDiv.textContent = `${activePlayer.getName()}'s turn...`;
    activePlayer.getID() === 1
      ? (player1Score.textContent = activePlayer.getScore())
      : (player2Score.textContent = activePlayer.getScore());
  };

  const endScreen = () => {
    const modal = document.querySelector("dialog");
    const winner = game.checkWinner();
    const winnerText = document.createElement("p");
    winnerText.textContent = winner;
    modal.appendChild(winnerText);
    modal.showModal();
  };

  function clickHandlerBoard(e) {
    const selectedName = e.target.dataset.name;
    if (!selectedName) return;

    e.target.classList.add("active");
    game.playRound(updateScreen, e.target, endScreen);
  }

  cardsDiv.addEventListener("click", clickHandlerBoard);

  setScreen();
}

document.addEventListener("DOMContentLoaded", screenController);
