Requirements:
1. NodeJs
2. NPM package manager
3. Truffle module installed globally
4. Ganache Tool (Private blockchain for free accounts with fake ethers)
5. MetaMask chrome extension to confirm transactions.


NOTES/ASSUMPTIONS before playing:
1. In case of 2 players P1 and P2, if P1 initializes the game then P2 will have the first turn.
2. No player can take 2 turns consecutively. It will raise error in metamask wallet before confirmation.
3. The Contract deployer aka Admin can neither start a play nor initialize one.
4. Admin will store all the bet amount and it will be settled once game is over.
5. After marking a box and confirming transaction if you can't see your mark, just refresh. It might be due to frontend code state update issue.

READ 'Contract_description.md' in order to get details of Smart Contract and its logic.

Ps: Smart Contract is written in a self-explanatory fashion.



Approach on how winner is decided:

It is a normal tic tac toe game, so if a player gets any row, column or diagonal with his mark before the other player, he is declared winner. In case the total moves by both player reaches 9 and no one won till that point, the game is over and is declared a DRAW.



How to run this code ?

1. git clone this repository and cd into the folder.

2. Run 'npm install' in order to install all dependencies from package.json file.

3. Open Ganache Desktop app and confirm that port used is same as that defined in truffle-config.js

4. truffle compile
This command will compile the solidity smart contracts in 'contracts' folder of this directory.

5. truffle migrate --reset
This command will deploy smart contracts using Ganache Accounts. --reset flag will override abis if already generated.

6. npm start
This will start the development server and will listen on port 3005 on your local computer as configured in package.json file.

7. Import your Ganache accounts into MetaMask and connect those accounts with this application.




PROJECT SCREENSHOTS:

1. Smart Contract deployed using 'truffle migrate'


2. Initial balance of accounts after deploying contract


3. Connecting Admin to TicTacToe application interface using MetaMask extension after importing the account.


4. Similarly connected 2 players into MetaMask.


5. Player 1 starting game with a bet of 5 Ethers.


6. Details updated after initializing game.


7. Player 2 now click on Start_Play to start the game by betting same bet money.


8. Game has been started with empty board and player 2 will take the first turn.


9. Account balance after betting money and before starting play. After this both players will take one turn at a time, until a winner is declared.


10. Player 2 takes the winning turn of this game.


11. Player 2 is declared winner.


12. Admin will now settle the game by returning the bet amount to winner.


13. Final Account balance after play ends.
