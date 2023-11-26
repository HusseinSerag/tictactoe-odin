const cell = (function(){
    const createCell = (i) =>{
        let cellNumber = i ;
        
        let chosen = false;
        let marker;
        const getMarker = () => marker;
        const setMarker = (newMarker) =>{
            marker = newMarker
        }
        const getChosen = () => chosen;
        const setChosen  = (newValue) =>{
            chosen = newValue
        }
        
        const setCellNumber = (number) =>{
            cellNumber = number
        }
        const getCellNumber = () => cellNumber

        return {setCellNumber , getCellNumber , getChosen , setChosen , getMarker , setMarker}
    }
    return {createCell}
})();
const gameBoard = (function(){
    let gameFinished = false
    let board = []
    let winningConditions = [[0,1,2],
                            [3,4,5],
                            [6,7,8],
                            [0,3,6],
                            [1,4,7],
                            [2,5,8],
                            [0,4,8],
                            [2,4,6]]
    for(let i = 0 ; i<9 ; i++){
        board.push(cell.createCell(i))
    }
    const getGameFinished = () => gameFinished
    const setGameFinished = (newValue) =>{
        gameFinished = newValue
    }
    const getWinningConditions = () => winningConditions
    const getBoard = () => board
    const setBoard = updatedBoard => {
        board = updatedBoard
    }
    const chooseField = (player,target) =>{
        let newBoard = getBoard();
        if(newBoard[target.dataset.number].getChosen() == true){
            console.log('Chosen')
            return true
        }
        
       
        
     newBoard[target.dataset.number].setMarker(player.getMarker())
     newBoard[target.dataset.number].setChosen(true)
     setBoard(newBoard)
     
     return false
     }
     return {getBoard,chooseField , getWinningConditions , setBoard , getGameFinished , setGameFinished}

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
            if(gameBoard.getBoard()[i].getMarker() == activePlayer.getMarker())
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
    let activePlayer = player1
        const switchTurn = () =>{
        activePlayer = activePlayer == player1 ? player2 : player1;
        }
        const startOverActivePlayer = () =>{
            activePlayer = player1
        }
        const getActivePlayer = () => activePlayer
        
    const playRound = (target) =>{
        
        
        
            console.log(`${getActivePlayer().getName()}'s turn`);
           console.log(target)
           let value ;
           
            value = gameBoard.chooseField(getActivePlayer(),target)
            if(value == true){
                return
            }
            else{
                target.textContent = getActivePlayer().getMarker()
            }
           
            
            let result = checkWinner(getActivePlayer())
        if(result == true){
            console.log(`${getActivePlayer().getName()} won!`)
            getActivePlayer().winRound()
            gameBoard.setGameFinished(true)
            return 2
        }
        if(gameBoard.getBoard().every(cell => cell.getChosen() == true)){
            console.log('Draw!')
            gameBoard.setGameFinished(true)
            return 1
        }
            switchTurn()
            
        
        
    
}


return {playRound,player1,player2,startOverActivePlayer}
})();

const controllerDOM = (function(){
   let players = document.querySelectorAll('input[class^=player]')
   let button = document.querySelector('.start')
   let xoContainer = document.querySelector('.x-o-container')
   let restartBtn = document.querySelector('.start.restart')
   xoContainer.addEventListener('click', e=>{
    console.log(e.target)
   })

   
   const renderDisplay = () =>{
    for(let i = 0 ; i < gameBoard.getBoard().length ; i++){
        let cell  = document.createElement('div')
        cell.classList.add('cell')
        cell.dataset.number = i
        
        cell.addEventListener('click',e=>{
            if(gameBoard.getGameFinished() == false)
                value = controller.playRound(cell)
            
            
            
        })
        xoContainer.append(cell)
        
    }
   }
   restartBtn.addEventListener('click',()=>{
    Array.from(xoContainer.children).forEach(child =>{
        xoContainer.removeChild(child)
    })
    controller.startOverActivePlayer()
    gameBoard.setBoard([])
    gameBoard.setGameFinished(false)
    for(let i = 0 ; i<9 ; i++){
        gameBoard.getBoard().push(cell.createCell(i))
    }
    
    renderDisplay()
   })
   button.addEventListener('click',()=>{
    let player1 = players[0].value
    if(player1 == ''){
        player1 = 'Player 1'
    }
    controller.player1.setName(player1)

    let player2 = players[1].value
    if(player2 == ''){
        player2 = 'Player 2'
    }
   
    controller.player2.setName(player2)
    
    renderDisplay()
    
   })
  
   
   
})();
