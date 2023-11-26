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
    const getBoard = () => board
    const setBoard = updatedBoard => {
        board = updatedBoard
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


const controller = (function(){
    let playerCount = 1
    let player1 = Player.createPlayer(`Player ${playerCount}`)
    player1.setMarker('X')
    playerCount++;
    let player2 = Player.createPlayer(`Player ${playerCount}`)
    player2.setMarker('O')

    const checkWinner = (activePlayer) =>{
        let activePlayerPosition = []
        for(let i = 0 ; i < gameBoard.getBoard().length ; i++){
            if(gameBoard.getBoard()[i] == activePlayer.getMarker())
            activePlayerPosition.push(i) 
        }
        let result = gameBoard.getWinningConditions().some(element =>{
            isAllEqual = element.every(number =>{
                for(let i = 0 ; i < gameBoard.getBoard().length ; i++){

                    if(activePlayerPosition[i] == number){
                        return true
                    }
                }
               return false
            })
            if(isAllEqual == true){
                return true
            }
            else{
                return false
            }
        })
        if(result){
            
            return result
        }
        else 
        return false
    }

    const playRound = () =>{
        let activePlayer = player1
        const switchTurn = () =>{
        activePlayer = activePlayer == player1 ? player2 : player1;
        }
        const getActivePlayer = () => activePlayer
        while(true){
            console.log(`${getActivePlayer().getName()}'s turn`);
            gameBoard.chooseField(getActivePlayer())
            result = checkWinner(getActivePlayer())
        if(result == true){
            console.log(`${getActivePlayer().getName()} won!`)
            getActivePlayer().winRound()
            break
        }
        if(gameBoard.getBoard().every(cell => cell !=0)){
            console.log('Draw!')
            break
        }
            switchTurn()
        }
        
    
}

const playGame = (numberOfGames=3,player1Name,player2Name) =>{
    for(i = 0 ; i < numberOfGames ; i++)
    {
        console.log(`Game number ${i+1}`)
        if(player1Name == ''){
            player1Name = 'Player 1'
        }
        if(player2Name == ''){
            player2Name = 'Player 2'
        }
        player1.setName(player1Name)
        player2.setName(player2Name)
        playRound()
        gameBoard.setBoard([0,0,0,0,0,0,0,0,0])
    }

    console.log(player1.getPoints() , player2.getPoints())
    
}
return {playRound,playGame}
})();

const controllerDOM = (function(){
   let players = document.querySelectorAll('input[class^=player]')
   let button = document.querySelector('.start')
   button.addEventListener('click',()=>{
    let player1 = players[0].value
    let player2 = players[1].value
    controller.playGame(1,player1,player2)
   })
  
   

})();
