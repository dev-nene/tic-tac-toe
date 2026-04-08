function Gameboard() {
  const board = [];
  const rows = 3;
  const columns = 3;

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const playTurn = (x, y, player) => {
    if (board[x][y].getValue() !== null) return false;

    board[x][y].setValue(player.sign);
    return true;
  };

  return {
    getBoard,
    playTurn,
  };
}

function Cell() {
  let value = null;

  const getValue = () => value;
  const setValue = (sign) => (value = sign);

  return {
    getValue,
    setValue,
  };
}

function gameController(Player1 = "Name1", Player2 = "Name2") {
  const board = Gameboard();

  const players = [
    {
      name: Player1,
      sign: "X",
    },
    {
      name: Player2,
      sign: "O",
    },
  ];

  let activePlayer = players[0];

  const getActivePlayer = () => activePlayer;

  const switchActivePlayer = () =>
    (activePlayer = activePlayer === players[0] ? players[1] : players[0]);

  const checkWin = () => {
    const b = board.getBoard();
    const boardVal = [];
    let k = 0;
    for (let i = 0; i < 3; i++) {
      boardVal[i] = [];
      for (let j = 0; j < 3; j++) {
        boardVal[i].push(b[i][j].getValue());
        if (boardVal[i][j] !== null) k++;
      }
    }

    /* DIAGONAL */
    if (
      boardVal[0][0] &&
      boardVal[0][0] === boardVal[1][1] &&
      boardVal[0][0] === boardVal[2][2]
    )
      return boardVal[0][0];
    if (
      boardVal[0][2] &&
      boardVal[0][2] === boardVal[1][1] &&
      boardVal[0][2] === boardVal[2][0]
    )
      return boardVal[0][2];

    /* HORIZONTAL */
    if (
      boardVal[0][0] &&
      boardVal[0][0] === boardVal[0][1] &&
      boardVal[0][0] === boardVal[0][2]
    )
      return boardVal[0][0];
    if (
      boardVal[1][0] &&
      boardVal[1][0] === boardVal[1][1] &&
      boardVal[1][0] === boardVal[1][2]
    )
      return boardVal[1][0];
    if (
      boardVal[2][0] &&
      boardVal[2][0] === boardVal[2][1] &&
      boardVal[2][0] === boardVal[2][2]
    )
      return boardVal[2][0];

    /* VERTICAL */
    if (
      boardVal[0][0] &&
      boardVal[0][0] === boardVal[1][0] &&
      boardVal[0][0] === boardVal[2][0]
    )
      return boardVal[0][0];
    if (
      boardVal[0][1] &&
      boardVal[0][1] === boardVal[1][1] &&
      boardVal[0][1] === boardVal[2][1]
    )
      return boardVal[0][1];
    if (
      boardVal[0][2] &&
      boardVal[0][2] === boardVal[1][2] &&
      boardVal[0][2] === boardVal[2][2]
    )
      return boardVal[0][2];

    /* TIE */
    if (k === 9) return "Tie";
  };

  const resetGame = () => {
    const b = board.getBoard();
    
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        b[i][j].setValue(null);
      }
    }

    activePlayer = players[0];
  }

  const playRound = (x, y) => {
    const movePlayer = board.playTurn(x, y, activePlayer);
    if (!movePlayer) {
      return "Invalid move, try again!";
    }

    let win = checkWin();
    if (win) {
      return win;
    }

    switchActivePlayer();
  };

  return {
    playRound,
    getActivePlayer,
    getBoard: board.getBoard,
    resetGame,
  };
}

function ScreenController(p1, p2) {
  const playerTurnDiv = document.querySelector(".turn");
  const boardDiv = document.querySelector(".board");
  const startButton = document.querySelector(".start");

  let game = gameController(p1, p2);

  const drawBoard = () => {
    boardDiv.textContent = "";

    const board = game.getBoard();

    board.forEach((row, x) => {
      const cellRow = document.createElement("div");
      row.forEach((cell, y) => {
        const cellItem = document.createElement("button");
        cellItem.textContent = cell.getValue();
        cellItem.classList.add("cell");
        cellItem.dataset.x = x;
        cellItem.dataset.y = y;
        cellRow.appendChild(cellItem);
      });
      boardDiv.appendChild(cellRow);
    });
  };

  const updateScreen = () => {
    const activePlayer = game.getActivePlayer();

    playerTurnDiv.textContent = `Player ${activePlayer.name}'s turn...`;

    drawBoard();
  };

  const placeSign = (e) => {
    const x = Number(e.target.dataset.x);
    const y = Number(e.target.dataset.y);
    if (x === undefined || y === undefined) return;

    const outcome = game.playRound(x, y);
    if (outcome) {
      if (outcome === "Tie") {
        playerTurnDiv.textContent = `It's a Tie`;
        boardDiv.classList.add("disabled");
      } else if (outcome === "X" || outcome === "O") {
        playerTurnDiv.textContent = `${game.getActivePlayer().name} wins with ${outcome}`;
        boardDiv.classList.add("disabled");
      } else {
        playerTurnDiv.textContent = outcome;
      }
      drawBoard();
      return; /* END GAME */
    }
    updateScreen();
  };

  boardDiv.addEventListener("click", placeSign);

  startButton.addEventListener("click", () => {
    game.resetGame();
    boardDiv.classList.remove("disabled");
    updateScreen();
  })

  updateScreen();
}

function loadPlayers(onSave) {
  const dialogEl = document.querySelector("dialog");
  const player1 = document.querySelector("#player1");
  const player2 = document.querySelector("#player2");
  const closeBtn = document.querySelector(".closeBtn");
  const saveBtn = document.querySelector(".saveBtn");


  dialogEl.showModal();

  closeBtn.addEventListener("click", () => {
    dialogEl.close();
  });

  saveBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const p1 = player1.value;
    player1.value = "";
    const p2 = player2.value;
    player2.value = "";

    dialogEl.close();
    onSave(p1,p2);
  });
}

function startGame  () {
  loadPlayers((p1, p2) => {
    ScreenController(p1, p2)
  })
}


startGame();
