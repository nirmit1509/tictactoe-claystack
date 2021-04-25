Smart Contract :  TicTacToe


admin - 

This address literal is the one that deploys the contract, store bet amount while game is not over and once game is over, it settles the bet amount among the game participants.


games mapping - 

This mapping stores all the games in the system identified by a unique gameId.


function initializeGame - 

This function takes betAmount as argument and initialize a new Game in system.
Player1 deposits bet amount to admin.
NOTE: Admin (Contract Deployer) cannot initialize a game.



function getBoard - 

This function takes gameId as argument and returns that particular game board.



function startPlay - 

This function takes gameId as argument and starts the already defined Game in system by resetting player2 with the one who calls it.
Player2 deposits bet amount to admin.
NOTE: Admin (Contract Deployer) cannot start to play a game. Also, player1 who initialized this game cannot be player2 as well (obviously, but condition handled). A player cannot start a game that is already in play.



function takeTurn - 

This function takes 2 arguments : gameId and position (0-8) of the game board to be filled.
This function handles various cases like a player cannot take 2 turns consecutively, whether the function caller is among the two players of this game, whether position is already occupied or not. It also prevents from taking a turn in case game already ended.
This fucntion internally checks the game winner after 5 moves have been played, since there is no logical way to find a winner in Tic Tac Toe game before this no. of moves.



function settleGame - 

This function can only be invoked by Admin adn takes gameId as argument. This function is used to settle game after the game is over. It gives twice the bet amount to winner in case there is a winner or simply return the bet amount deposited earlier in case of Draw.



NOTE: 'msg.value' takes value from metamask wallet and the exact amount to be returned is given from React Code while invoking function. So, in case, you try to run this contract on Remix IDE, please ensure to give proper value of ethers.