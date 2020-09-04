//variables
let currentPosition = 0, movementCalc = 20, difficultyLvl, gameSquares, snakeLength = 1, obs = [],
positions = [], width = 20, height = 20, score = 0, dif = 0, gameState = false, timerId;

//event listners & initition on page load
document.addEventListener('DOMContentLoaded', () => {

    //event Listners
        //create game grid
        for(let i = 0; i < 400; i++){
            document.getElementById('game-area').innerHTML += `<div id=\"container-${i}\" class=\"game-squares\"></div>`;
        };  
        
        //clicking play/pause button reads and sets difficulty
        document.getElementById('start').addEventListener('click', () => {
            //run function and save value to variable, nodelist passed as function argument
            difficultyLvl = readDifficulty(document.getElementsByName('difficulty'));
            console.log(difficultyLvl);
            if(difficultyLvl === 'easy'){
                dif = 200;
            }else if(difficultyLvl === 'medium'){
                dif = 150;
            }else if(difficultyLvl === 'hard'){
                dif = 125;
            };
    
            !gameState ? gameState = true : gameState = false;

            //create snake reset variables
            startSnake();
            //start game movement and set interval
            runGame();
        });

        document.addEventListener('keydown', (e) => {
            if(e.keyCode === 40){
                movementCalc = width;
            }else if(e.keyCode === 39){
               movementCalc = 1;
            }else if(e.keyCode === 37){
                movementCalc = -1;
            }else if(e.keyCode === 38){
                movementCalc = -width;
            }
        })
    //initition on page load
        //create node list of grid squares
        gameSquares = document.querySelectorAll('.game-squares');        

//returns difficulty, nodelist passed in via function argument
function readDifficulty(radios){
   
    //loop over argument(node list) and check for checked value;
    for(let i = 0; i < radios.length; i++){
        if(radios[i].checked){
            //return checked vaule
            return radios[i].value;
        }
    }
}

//create the snake
function startSnake() {
    //set snake length
    snakeLength = 1;
    //clear Position array on game start;
    positions = [];
    //set game starting point;
    currentPosition = 0;
    //reset movement direction
    movementCalc = 20;
    //assign start point to variable
    let startPoint = document.getElementById(`container-${currentPosition}`);

    //put in obstacles
    if(difficultyLvl === 'hard'){
        obstacles(); 
    }

    //place a score point on to grid;
    scorePoints();
   

    //find starting square in the grid and assign snake
    gameSquares.forEach(square => {
        if(square.id === startPoint.id){
            square.classList.add('snake');
        }
    })
}

function runGame(){
    //run game if gameState is true
    if(gameState){
        //assign interval to timerId variable
        timerId = setInterval(movement, dif);
     }else{
         //clear interval
        clearInterval(timerId);
        alert(`ENDGAME! Your score was ${score}`);
        //remove all snake squares & score points
        gameSquares.forEach(sq => {
            sq.classList.remove('snake');
            sq.classList.remove('score-point');
            sq.classList.remove('obs');
        });
        //reset score & score display
        score = 0;
        document.getElementById('score-value').innerHTML = score;
     }
}

//move snake
function movement(){
    //variables assign next square to variable
    let pos;
    let point = gameSquares[currentPosition + movementCalc];

    //pushes square onto snake array
    positions.push(gameSquares[currentPosition]);
    
    //out of grid right
    if(currentPosition % width === width - 1 && movementCalc === 1){
        //conatines position
        pos = currentPosition - width + 1;
        //update point variable
        point = gameSquares[pos];
        //updates currentPosition
        currentPosition = pos; 

    //out of grif left               
    }else if((currentPosition + width - 1) % width  === width - 1 && movementCalc === -1){
        //container position
        pos = currentPosition + width - 1;
        //updte point variable
        point = gameSquares[pos];
        //update current position
        currentPosition = pos;

    //out of grid bottom & top
    }else if(!point){
        //Out bottom, In top;
        if(movementCalc === width){
            //asigns currentPosition the relative square at the top of the grid
            currentPosition = currentPosition % height;
            //update point variable
            point = gameSquares[currentPosition];
        //Out top, In bottom
        }else if(movementCalc === -width){
            //asigns currentPosition the relative square at the bottom of the grid
            currentPosition = width * height - height + currentPosition;
            //update point variable
            point = gameSquares[currentPosition];
        }

    //normal grid movement
    }else{
        //updates currentPosition, increments by movementCalc variable
        currentPosition += movementCalc;
    }

    if(point.classList.contains('score-point')){
        //remove old score point after collecting
        point.classList.remove('score-point');
        //add another point
        scorePoints();
        //Update score
        addToScore();
        //increase snake;
        elongateSnake();
    }

    //if square contains snake game ends
    if(point.classList.contains('snake') || point.classList.contains('obs')){
        gameState = false;
        runGame();
    }else if(!point.classList.contains('snake')){    
        //adds to the next square
        point.classList.add('snake');

        //removes snake class from gameSquare using positions array
            //logs position of every movement inside position array, 
            /*using the position array as a reference, the'snake' class is removed from the nth(snakeLength) 
            square of the game grid*/
        positions[positions.length - snakeLength].classList.remove('snake');
        
        //remove any grid squares from array that are over snakeLength
        if(positions.length > snakeLength){ positions.splice(0, 1) };
    } 
};

//create score points
function scorePoints(){
    //create a new score point
    let gamePoint = gameSquares[Math.floor(Math.random() * (height * width))];
    //make sure square recieving score point is empty
    if(gamePoint.classList.contains('snake') || gamePoint.classList.contains('obs')){
        //if square is taken remove and recall
        gamePoint.classList.remove('score-point');
        return scorePoints();
    }
    //if square is free assign score point
    gamePoint.classList.add('score-point');console.log(gamePoint)
};

//update score
function addToScore(){
    //increment score variable
    score++;
    //update score display
    document.getElementById('score-value').innerHTML = score;
};

//elongate snake
function elongateSnake(){
    //increment snake length
    snakeLength++
}

//hard mode obstacles
function obstacles(){
    obs = [42, 43, 62, 63, 56, 57, 76, 77, 322, 323, 342, 343, 336, 337, 
        356, 357, 148, 149, 150, 151, 248, 249, 250, 251];
    gameSquares.forEach(sq => {
        for(let i = 0; i < obs.length; i++){
            if(sq.id === `container-${obs[i]}`){
                sq.classList.add('obs');
            }
        }
    })
}

})

//grid = 20 x 20 = 400