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

  const printBoard = () => {
    for (let i = 0; i < rows; i++) {
      let res = "";
      for (let j = 0; j < columns; j++) {
        res += board[i][j].getValue();
        res += " ";
      }
      console.log(res);
      if (i === rows - 1) return;
      console.log("\n");
    }
  };

  const playTurn = (x, y, player) => {
    if (board[x][y].getValue() !== null) return false;

    board[x][y].setValue(player.sign);
    return true;
  };

  return {
    getBoard,
    printBoard,
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

  const printNewRound = () => {
    console.log(`${activePlayer.name} turns...`);
    board.printBoard();
  };

  const checkWin = () => {
    const b = board.getBoard();
    const boardVal = [];
    let k = 0;
    for (let i = 0; i < 3; i++) {
      boardVal[i] = [];
      for (let j = 0; j < 3; j++) {
        boardVal[i].push(b[i][j].getValue());
        if(boardVal[i][j] !== null) k++;
      }
    }

    /* DIAGONAL */
    if (boardVal[0][0] && boardVal[0][0] === boardVal[1][1] && boardVal[0][0] === boardVal[2][2]) return boardVal[0][0]

    if (boardVal[0][2] && boardVal[0][2] === boardVal[1][1] && boardVal[0][2] === boardVal[2][0]) return boardVal[0][2]
        
    /* HORIZONTAL */
    if (boardVal[0][0] && boardVal[0][0] === boardVal[0][1] && boardVal[0][0] === boardVal[0][2]) return boardVal[0][0] 

    if (boardVal[1][0] && boardVal[1][0] === boardVal[1][1] && boardVal[1][0] === boardVal[1][2]) return boardVal[1][0]
    
    if (boardVal[2][0] && boardVal[2][0] === boardVal[2][1] && boardVal[2][0] === boardVal[2][2]) return boardVal[2][0]

    /* VERTICAL */
    if (boardVal[0][0] && boardVal[0][0] === boardVal[1][0] && boardVal[0][0] === boardVal[2][0]) return boardVal[0][0]

    if (boardVal[0][1] && boardVal[0][1] === boardVal[1][1] && boardVal[0][1] === boardVal[2][1]) return boardVal[0][1]


    if (boardVal[0][2] && boardVal[0][2] === boardVal[1][2] && boardVal[0][2] === boardVal[2][2]) return boardVal[0][2]

    /* TIE */
    if (k === 9) return "Tie"
  }

  const playRound = (x, y) => {
    const movePlayer = board.playTurn(x, y, activePlayer);
    if(!movePlayer) {
      console.log("Invalid move, try again!")
      printNewRound();
      return;
    };

    let win = checkWin();
    if(win) {
      console.log(win)
      board.printBoard();
      /* RESET GAME ? START */
      return;
    }

    switchActivePlayer();
    printNewRound();
  };

  printNewRound();

  return {
    playRound,
    getActivePlayer,
  };
}

const game = gameController();
