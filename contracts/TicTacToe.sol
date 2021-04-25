// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0;

contract TicTacToe {

    // admin will be the one to deploy this contract and also address used to store bet amount while game continues
    address payable public admin = payable(msg.sender);

    struct Game {
        uint gameId;
        address payable player1;
        address payable player2;
        uint8[] gameBoard;            // [0, 0, 0, 0, 0 , 0, 0, 0, 0]  which represents all boxes are empty at first
        uint betAmount;
        uint movesCount;              // will be initialized to 0 at time of initialization
        address lastMoveBy;           // will be initialized to the one initializing game, so that second player get first turn
        address payable winner;
        bool gameOver;                  // initialized with false
        bool isSettled;                 // initialized with false
    }

    uint public gameCount = 0;
    mapping(uint => Game) public games;

    // This function takes betAmount in ether and initialize a new game
    function initializeGame (uint _bet) public payable {
        require(admin!=msg.sender, "Contract Owner cannot start or play a game.");
        require(_bet > 0, "Invalid bet amount.");
        gameCount ++;
        games[gameCount] = Game(gameCount, payable(msg.sender), payable(address(0)), new uint8[](9), 
                                _bet, 0, msg.sender, payable(address(0)), false, false );
        admin.transfer(msg.value); // bet money is transferred to admin (contract deployer)
    }

    // This view function returns the game board for particular game ID
    function getBoard(uint _gameId) public view returns(uint8[] memory board) {
        require(_gameId<=gameCount, "Invalid Game ID.");
        Game memory g = games[_gameId];
        return g.gameBoard;
    }

    // This function takes gameId as argument and starts tic-tac-toe game
    function startPlay (uint _gameId) public payable {
        require(admin!=msg.sender, "Contract Owner cannot start or play a game.");
        require(_gameId<=gameCount, "Invalid Game ID.");
        Game storage g = games[_gameId];
        require(g.player1!=msg.sender, "You are already player 1.");
        require(g.movesCount==0, "Game already Begin");
        require(g.gameOver==false, "Game already concluded!");
        g.player2 = payable(msg.sender);
        admin.transfer(msg.value);
    }

    function takeTurn (uint _gameId, uint8 pos) public {
        require(_gameId<=gameCount, "Invalid Game ID.");
        Game storage g = games[_gameId];
        require(g.gameOver==false, "Game already concluded!");
        require(msg.sender == g.player1 || msg.sender == g.player2, "Not a valid player.");
        require(g.lastMoveBy!=msg.sender, "Cannot take 2 turn consecutively.");
        require(g.gameBoard[pos]==0, "Position Already Taken.");
        address payable player = g.player1==msg.sender ? g.player1 : g.player2;
        uint8 playerMove = g.player1==msg.sender ? 1 : 2;
        g.gameBoard[pos] = playerMove;
        g.movesCount = g.movesCount + 1;
        g.lastMoveBy = msg.sender;
        // check winner only if moveCount > 5, since it is the min chances reqd to decide a winner
        if(g.movesCount >=5) {
            if(isWinner(g.gameId, playerMove)) {
                g.winner = player;
                g.gameOver = true;
            }
        }
        // if movecount is already 9 and no winner is declared, then the game end in a draw
        if(g.movesCount==9) {
            g.gameOver = true;
        }
    }

    // This private function checks whether the player who run the last move is winner or not ?
    function isWinner(uint _gameId, uint8 _playerMove) private view returns(bool) {
        uint8[3][8] memory winningFilters = [
            [0,1,2],[3,4,5],[6,7,8],  // rows
            [0,3,6],[1,4,7],[2,5,8],  // columns
            [0,4,8],[6,4,2]           // diagonals
        ];

        require(_gameId<=gameCount, "Invalid Game ID.");
        Game storage g = games[_gameId];
        uint8[] memory _board = g.gameBoard;

        
        for (uint8 i = 0; i < winningFilters.length; i++) {
            uint8[3] memory filter = winningFilters[i];
            if( _board[filter[0]]==_playerMove && _board[filter[1]]==_playerMove && _board[filter[2]]==_playerMove ) {
                return true;
            }
        }
        return false;
    }

    // This function allows admin to return the bet amount once the game is over and to settle the ethers conditionally
    function settleGame(uint _id) public payable {
        require(admin==msg.sender, "Only Contract Owner can settle game");
        require(_id<=gameCount, "Invalid Game ID.");
        Game storage g = games[_id];
        require(g.gameOver==true, "Cannot settle unfinished Game.");
        require(g.isSettled==false, "Game already settled.");
        if(g.winner!=address(0)) {
            (g.winner).transfer(msg.value);
        }
        else {
            (g.player1).transfer((msg.value)/2);
            (g.player2).transfer((msg.value)/2);
        }
        g.isSettled = true;
    }
}