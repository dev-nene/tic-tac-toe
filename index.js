function Gameboard () {
  const board = [];
  const rows = 3;
  const columns = 3;

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j =0; j < columns; j ++){
      board[i].push(Cell())
    }
  }

  const getBoard = () => board;

  const printBoard = () => {
    for (let i = 0; i < rows; i++) {
      let res = ""
      for (let j =0; j < columns; j ++){
        res += board[i][j].getValue();
        res += " ";
      }
      console.log(res);
      if(i === rows-1) return
      console.log("\n")
    }
    
  }

  const playTurn = (x, y, player) => {
    if (board[x][y].getValue() !== "") return;

    board[x][y].setValue(player.sign);
  }

  return {
    getBoard,
    printBoard,
    playTurn
  }

}

function Cell () {
  let value = "";

  const getValue = () => value;
  const setValue = (sign) => value = sign;

  return {
    getValue,
    setValue
  }
}

function gameController (Player1 = "Name1", Player2 = "Name2") {
  const board = Gameboard();
  const players = [{
    name: Player1,
    sign: "X",
  }, {
    name: Player2,
    sign: "O",
  }]

  let activePlayer = players[0];

  const getActivePlayer = () => activePlayer;

  const switchActivePlayer = () => activePlayer = activePlayer === players[0] ? players[1] : players[0];

  const printNewRound = () => {
    console.log(`${activePlayer.name} turns...`);
    board.printBoard();
  }

  const playRound = (x, y) => {
    board.playTurn(x, y, activePlayer);
    switchActivePlayer();
    printNewRound();
  }

  printNewRound();

  return {
    playRound,
    getActivePlayer,
  }
}

const game = gameController();