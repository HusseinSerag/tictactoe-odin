const gameBoard = (function(){

    let board = [0,0,0,0,0,0,0,0,0]
    let winningConditions = [[0,1,2],
                            [3,4,5],
                            [6,7,8],
                            [0,3,6],
                            [1,4,7],
                            [2,5,8],
                            [0,4,8],
                            [2,4,6]]

    const getWinningConditions = () => winningConditions
    const getBoard = () => gameBoard.board
    const setBoard = updatedBoard => {
        gameBoard.board = updatedBoard
    }
    const chooseField = (player) =>{
        let newBoard = getBoard()
        let row;
        
     
        do{
          row = parseInt(prompt('row')) 
        }
        while(newBoard[row] != 0)
        
     newBoard[row]= player.getMarker()
     setBoard(newBoard)
     for(let i = 0 ; i < getBoard().length ; i++){
         console.log(`| ${getBoard()[i]}`)
     }
     }
     return {getBoard,chooseField , getWinningConditions , setBoard}

})();


const Player = (function(){
    const createPlayer = (name) =>{
        let playerName = name;
        let points = 0;
        let marker;
        const winRound = () =>{
            points++
        }
        const setName = (name) =>{
            playerName = name
        }
        const getName = ()=>{
            return playerName
        }
        const getPoints = ()=>{
            return points
        }
        const setMarker = (newMarker) =>{
            marker = newMarker
        }
        const getMarker = () => marker
        return {winRound , setName , getPoints , getName , setMarker , getMarker}
    }
    return {createPlayer}
})();