const gameBoard = ( () => {
    let gameStatus = true; 
    const board = ["", "", "", "", "", "", "", "", ""]; 
    const winningBoards = [ //arrays of indices for winning tictactoe grids
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    const playerOne = "X"; 
    const playerTwo = "O";
    let playerOneTurn = true;  
    
    const reset = () => {
        gameStatus = true; 
        playerOneTurn = true; 
        for(let i = 0; i < board.length; i++) {
            board[i] = ""; 
        }
    }
    const checkWin = () => {
        //check win for current player
        //if win is found, mark board invalid and return true, otherwise false
        let curPlayer = playerOneTurn ? playerOne : playerTwo;
        for(let i = 0; i < winningBoards.length; i++) {
            if(board[winningBoards[i][0]] === board[winningBoards[i][1]] &&
                board[winningBoards[i][0]] === board[winningBoards[i][2]] &&
                board[winningBoards[i][0]] === curPlayer) {
                    gameStatus = false; 
                    console.log("WINNER"); 
                    return true; 
            }
        }
        return false; 
    }
    const checkDraw = () => {
        //if draw, mark board invalid, return true, otherwise false
        for(let i = 0; i < board.length; i++) {
            if(board[i] === "") {
                return false; 
            }
        }
        console.log("DRAW"); 
        gameStatus = false; 
        return true; 
    }
    const recordMove = (gridIndex) => {
        if(board[gridIndex] != "") {
            console.log("grid cell already has player icon, exiting board.recordMove()"); 
            return false; 
        }
        board[gridIndex] = playerOneTurn ? playerOne : playerTwo; 
        return true;  
    }
    const isGameValid = () => {
        return gameStatus; 
    }
    const getBoardArray = () => {
        return board.slice(); //return clone of array 
    }
    const curPlayer = () => {
        return playerOneTurn ? playerOne : playerTwo; 
    }
    const switchPlayerTurn = () => {
        playerOneTurn = !playerOneTurn; 
    }
    return {reset, checkWin, checkDraw, recordMove, isGameValid, getBoardArray, curPlayer, switchPlayerTurn}
})(); 

const displayController = ( () => {
    let gridCells = document.querySelectorAll(".grid-cell");
    const playerText = document.querySelector(".player-info-text"); 

    const renderBoard = (boardArray) => {
        for(let i = 0; i < boardArray.length; i++) {
            gridCells[i].textContent = boardArray[i]; 
        }
    }

    const playerMoveText = (curPlayer) => {
        //use current player to post player turn text
        playerText.textContent = curPlayer + ", make your move!"; 
    }

    const winnerText = (curPlayer) => {
        playerText.textContent = curPlayer + " wins!"; 
    }

    const drawText = () => {
        playerText.textContent = "It's a DRAW!"; 
    }

    return {renderBoard, playerMoveText, winnerText, drawText}
})(); 



function playerMove(e) {
    console.log("player move func"); 
    //console.log(e.target.getAttribute("data-index"))

    let gridCellIndex = parseInt(e.target.getAttribute("data-index")); 

    //record move on board object
    //verify that the grid isn't already filled out with a move
    //enter correct player icon onto the correct grid element
    if(!gameBoard.isGameValid() || !gameBoard.recordMove(gridCellIndex)) {
        console.log("Game is over/invalid or user just tried to click an already marked cell, exiting playerMove func"); 
        return; 
    }

    //render the new board and player info sections
    displayController.renderBoard(gameBoard.getBoardArray()); 

    //check for a win or draw, if found enter win message and lock the game board somehow until reset
    if(gameBoard.checkWin()) {
        //enter win message
        displayController.winnerText(gameBoard.curPlayer()); 
        return; 
    } else if(gameBoard.checkDraw()) {
        //enter draw message
        displayController.drawText(); 
        return; 
    }

    gameBoard.switchPlayerTurn(); //change player turns
    displayController.playerMoveText(gameBoard.curPlayer()); 
}

function resetBoard(e) {
    console.log("in resetBoard()");
    //reset the board object
    gameBoard.reset(); 
    //render the new board and player info section
    displayController.renderBoard(gameBoard.getBoardArray());
    displayController.playerMoveText(gameBoard.curPlayer()); 
}



const gridCells = document.querySelectorAll(".grid-cell"); 
const resetButton = document.querySelector(".reset");

gridCells.forEach((cell) => {
    cell.addEventListener("click", playerMove);
});

resetButton.addEventListener("click", resetBoard); 
