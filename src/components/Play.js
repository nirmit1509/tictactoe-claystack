import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';

function Play({ web3, account, contract, games, isAdmin, updateList }) {

    const {game_id} = useParams();
    const [board, setBoard] = useState([]);
    const [currGame, setCurrGame] = useState({});
    const [refresh, setRefresh] = useState(0);

     const marks = {
         "0": '',
         "1": 'O',
         "2": 'X',
     }

    async function fetchBoard() {
        let game_board = []
        game_board = await contract.methods.getBoard(game_id).call()
        setBoard(game_board);
        const game = await contract.methods.games(game_id).call()
        setCurrGame(game)
    }

    useEffect(() => {
        fetchBoard()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refresh]);

    const playMove = (event, pos) => {
        event.preventDefault();
        contract.methods.takeTurn(game_id, pos)
        .send({ from: account, }, (error, transactionHash) => {
            if(transactionHash) {
                console.log("transaction hash is ",transactionHash);
            }
            setRefresh(refresh+1)
        });
    }
    
    return (
        currGame && board
        ?
        <div>
            <p>Player 1: {currGame.player1} (O)</p>
            <p>Player 2: {currGame.player2} (X)</p>
            <p>Turn of : {currGame.lastMoveBy===currGame.player1 ? currGame.player2 : currGame.player1}</p>
            <br />
            <div class="container">
                {
                    !currGame.gameOver 
                    ?
                    <div class="play-area">
                        {
                            board.map((b, key) => {
                                return (
                                    <div key={key} id={`block_${key}`} class="block" onClick={e=>playMove(e, key)}>
                                        <span>{marks[b]}</span>
                                    </div>
                                )
                            })
                        }
                    </div>
                    :
                    <div>
                        <h2>Game Over</h2>
                        {
                            currGame.winner===currGame.player1
                            ?
                            <h4>Winner is Player 1 (O)</h4>
                            :
                            currGame.winner===currGame.player2
                            ?
                            <h4>Winner is Player 2 (X)</h4>
                            :
                            <h4>Match Drawn</h4>
                        }
                    </div>
                }
            </div>
            
        </div>
        :
        <div className="loading__gif">
            <img 
                src="https://i.gifer.com/ZZ5H.gif"  
                alt="logo..."  
            />
        </div>
    )
}

export default Play
