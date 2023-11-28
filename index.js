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
    let board = []
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
    const setBoard = (newBoard) =>{
        board = newBoard
    }
    const clearBoard = () =>{
        board = []
        for(let i = 0 ; i<9 ; i++){
            board.push(cell.createCell(i))
        }
    }
    for(let i = 0 ; i<9 ; i++){
        board.push(cell.createCell(i))
    }
    return {getWinningConditions , getBoard , setBoard,clearBoard}
})();
const player = (() =>{
    let no_of_players = 1;
    function createPlayer(name){
        let playerNumber = no_of_players
        let points = 0;
        let userName;
        no_of_players++
        let avatar;
        let marker;
        if(playerNumber == 1){
            marker = 'X'
        }
        else{
            marker = 'O'
        }
        const getMarker = () => marker
        const setAvatar = (newAvatar) =>{
            if(newAvatar == undefined){
                if(playerNumber == 1){
                    avatar = './photos/kiwi-catscafe.gif'
                }
                else{
                    avatar = './photos/gaming-game-on.gif'
                }
            }
            else
            {
                avatar = newAvatar
            }
            
        }
        const resetPoints = () =>{
            points = 0
        }
        const getPlayerNumber = () => playerNumber
        const getAvatar = () => avatar
        const getName = () => userName
        const setName = (newName) => {
            if(newName == ''){
                userName = `Player ${playerNumber}`
            }
            else{
                userName = newName
            }
            
        } 
        const addPoints = () =>{
            points++
        }
        const getPoints = () =>points

        return{getName , setName , addPoints , getPoints , setAvatar , getAvatar , getPlayerNumber,getMarker,resetPoints}
    }
    return {createPlayer}
})();

const gameController = (function(){
    let RoundEnded = false
    let player1 = player.createPlayer()
    let player2 = player.createPlayer()
    let activePlayer = player1
    const setRoundEnded = (newValue) =>{
        RoundEnded = newValue
    }
    const getRoundEnded = () => RoundEnded
    const getActivePlayer = () => activePlayer
    const setActivePlayer = (newActivePlayer) => {
        activePlayer = newActivePlayer
        SwitchScreen.switchDiv.textContent = `${activePlayer.getName()}'s turn`
    }
    const switchActivePlayer = () =>{
        if(getActivePlayer() == player1){
            activePlayer = player2
        }
        else{
            activePlayer = player1
        }
        SwitchScreen.switchDiv.textContent = `${activePlayer.getName()}'s turn`
        
    }
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
    
    const playTurn = (cell) =>{
        if(gameBoard.getBoard()[cell.dataset.number].getChosen() == true){
            return
        }
        gameBoard.getBoard()[cell.dataset.number].setChosen(true) 
        gameBoard.getBoard()[cell.dataset.number].setMarker(getActivePlayer().getMarker())
        cell.textContent = getActivePlayer().getMarker()
        let result = checkWinner(getActivePlayer())
        if(result == true){
            increaseWinnerScore(getActivePlayer())
            SwitchScreen.switchDiv.textContent = `${getActivePlayer().getName()} won!`
            RoundEnded = true
            SwitchScreen.createResetBoard()
            
            return
        }
        if(gameBoard.getBoard().every(cell => cell.getChosen() == true)){
            RoundEnded = true
            SwitchScreen.createResetBoard()
            SwitchScreen.switchDiv.textContent = `Draw!`
            return
        }
        switchActivePlayer()
    }
    const increaseWinnerScore = (winner) =>{
        winner.addPoints()
        if(winner.getPlayerNumber() == 1){
            SwitchScreen.player1Score.textContent = winner.getPoints()
            
        }
        else if(winner.getPlayerNumber() == 2){
            SwitchScreen.player2Score.textContent = winner.getPoints()
        }
    }
    return {player1,player2 ,increaseWinnerScore,  getActivePlayer , setActivePlayer , switchActivePlayer,playTurn , getRoundEnded , setRoundEnded}
})();
const SwitchScreen = (function(){

    let mainContainer = document.querySelector('.container')
    let title = document.querySelector('.title')
    let playerContainer = document.querySelector('.player-container')
    let gameContainer = document.querySelector('.game-container')
    let player1Avatar = document.querySelector('.avatar1 > img')
    let player2Avatar = document.querySelector('.avatar2 > img')
    let player1Score = document.querySelector('.player-1-name + .score')
    let player2Score = document.querySelector('.player-2-name + .score')
    let switchDiv = document.querySelector('.switchDiv')
    let xoContainer = document.querySelector('.xo-container')
    let switchPlayers = document.querySelector('.switchPlayers')
    
    const createResetBoard = () =>{
        
        let resetBoardButton = document.createElement('button')
        resetBoardButton.classList.add('restart')
        
        resetBoardButton.textContent = 'Another Round'
        resetBoardButton.addEventListener('click',()=>{
            gameBoard.clearBoard()
            gameController.setRoundEnded(false)
            gameController.setActivePlayer(gameController.player1)
            renderXOGame()
            resetBoardButton.parentElement.removeChild(resetBoardButton)
        })
        gameContainer.appendChild(resetBoardButton)
    }
    const removeContainerChildren = (container) =>{
        Array.from(container.children).forEach(child =>{
            container.removeChild(child)
        });
    }
    const StartScreen = () =>{
        removeContainerChildren(mainContainer)
        gameController.setRoundEnded(false)
        let startButton = document.createElement('button')
        startButton.textContent = 'Start'
        startButton.classList.add('start')
        
        startButton.addEventListener('click', ()=>{
            
           
            
            getPlayerNameInput()
            determineChosenAvatar()
            renderChosenAvatar()
            gameController.setActivePlayer(gameController.player1)
            renderXOGame()
            gameScreen()
        })
        mainContainer.appendChild(title)
        mainContainer.appendChild(playerContainer)
        mainContainer.append(startButton)


    }
    const renderChosenAvatar = ()=>{
        player1Avatar.setAttribute('src' , gameController.player1.getAvatar())
        player2Avatar.setAttribute('src' , gameController.player2.getAvatar())
    }
    const determineChosenAvatar = () => {
        let radioForm = document.querySelectorAll('input[type=radio]')
        let player1Avatar = []
        let player2Avatar = []
        radioForm.forEach(form => {
            if(form.getAttribute('name') == 'player1Icon'){
                player1Avatar.push(form)
            }
            else{
                player2Avatar.push(form)
            }
            })
        player1Avatar.forEach(avatar =>{
            if(avatar.checked == true){
                gameController.player1.setAvatar(avatar.value)
                console.log(avatar.value)
            }
            
        })
        let allIsUnchecked = player1Avatar.every(avatar => !avatar.checked);
            if(allIsUnchecked){
                gameController.player1.setAvatar()
            }
        player2Avatar.forEach(avatar =>{
            if(avatar.checked == true){
                gameController.player2.setAvatar(avatar.value)
            }
        })
        allIsUnchecked = player2Avatar.every(avatar => !avatar.checked);
        if(allIsUnchecked){
            gameController.player2.setAvatar()
        }
            
    }
    const renderNameInput = () =>{
        let player1Name = document.querySelector('.player-1-name')
        let player2Name = document.querySelector('.player-2-name')
        player1Name.textContent = gameController.player1.getName()
        player2Name.textContent = gameController.player2.getName()
    }
    const gameScreen = () =>{
        removeContainerChildren(mainContainer)
        
        let returnButton = document.createElement('button')
        returnButton.textContent = 'return'
        returnButton.classList.add('return')
        returnButton.addEventListener('click' , ()=>{
            gameController.player1.resetPoints()
            gameController.player2.resetPoints()
            player1Score.textContent = gameController.player1.getPoints()
            player2Score.textContent = gameController.player2.getPoints()
            let resetButton = document.querySelector('.restart')
            if(resetButton != undefined){
                resetButton.parentElement.removeChild(resetButton)
            }
            gameBoard.clearBoard()

            StartScreen()
        })
        
        gameContainer.append(returnButton)
        mainContainer.appendChild(gameContainer)
        renderNameInput()
        
    }
    
    const getPlayerNameInput = () =>{
        let playerInputs = document.querySelectorAll('input[type=text]')
        let player1Input = playerInputs[0].value
        let player2Input = playerInputs[1].value
        gameController.player1.setName(player1Input)
        gameController.player2.setName(player2Input)


    }
    const renderXOGame = () =>{
        Array.from(xoContainer.children).forEach(child=>{
            xoContainer.removeChild(child)
        })
        for(let i = 0 ; i < gameBoard.getBoard().length ; i++)
        {
            let cell = document.createElement('div');
            cell.classList.add('cell')
            cell.dataset.number = i
            xoContainer.append(cell)
            cell.addEventListener('click',e=>{
                if(gameController.getRoundEnded()== false)
                gameController.playTurn(cell)
            })

        }

    }
    return {StartScreen , gameScreen , getPlayerNameInput,player1Score,player2Score,switchDiv,renderXOGame,switchPlayers,createResetBoard}
})();

SwitchScreen.StartScreen()
 document.querySelector('button').addEventListener('click', ()=>{
   
})

