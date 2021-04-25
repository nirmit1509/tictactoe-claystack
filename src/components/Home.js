import React from 'react';
import MaterialTable from 'material-table';
import { Button, CircularProgress, Tooltip } from '@material-ui/core';
import {headerCSS, cellCSS, SuccessAlert} from '../constants';

function Home({ web3, account, contract, games, isAdmin, updateList }) {

    const [bet, setBet] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

    const settleGameAmount = (event, game_id, bet) => {
        event.preventDefault();
        const price = web3.utils.toWei(bet.toString(), 'Ether')
        contract.methods.settleGame(game_id)
        .send({ from: account, value: 2*price }, (error, transactionHash) => {
        if(transactionHash) {
            SuccessAlert("Game settled..")
            updateList()
        }
        console.log("transaction hash is ",transactionHash);
        });
    }

    const playGameAmount = (event, game_id, bet) => {
        event.preventDefault();
        const price = web3.utils.toWei(bet.toString(), 'Ether')
        contract.methods.startPlay(game_id)
        .send({ from: account, value: price }, (error, transactionHash) => {
            if(transactionHash) {
                SuccessAlert("Game started..")
                updateList()
            }
            window.open(`/play/${game_id}`)
            console.log("transaction hash is ",transactionHash);
        });
    }

    const columns = [
        { title: "Game ID",  field: "gameId", headerStyle: headerCSS,  cellStyle: cellCSS },
        { title: "Player 1", field: "player1",     headerStyle: headerCSS,  cellStyle: cellCSS,
          render: row => 
          <Tooltip title={row.player1} placement="bottom-end">
            <div>{`${row.player1.slice(0, -25)}....${row.player1.slice(37, 42)}`}</div>
          </Tooltip>, 
        },
        { title: "Player 2", field: "player2",     headerStyle: headerCSS,  cellStyle: cellCSS,
            render: row => 
            <Tooltip title={row.player2} placement="bottom-end">
                <div>{`${row.player2.slice(0, -25)}....${row.player2.slice(37, 42)}`}</div>
            </Tooltip>, 
        },
        { title: "Bet_Amount(Eth)",  field: "betAmount",   headerStyle: headerCSS,  cellStyle: cellCSS },
        { title: "Winner",  field: "winner",     headerStyle: headerCSS,  cellStyle: cellCSS,
            render: row => 
            <Tooltip title={row.winner} placement="bottom-end">
                <div>{`${row.winner.slice(0, -25)}....${row.winner.slice(37, 42)}`}</div>
            </Tooltip>, 
        },
        { title: "Game_Over?",  field: "gameOver",   headerStyle: headerCSS,  cellStyle: cellCSS,
          render: row => <span>{row.gameOver ? 'Yes' : 'No'}</span> },
        { title: "Settled?",  field: "isSettled",   headerStyle: headerCSS,  cellStyle: cellCSS,
          render: row => <span>{row.isSettled ? 'Yes' : 'No'}</span> },
    ]; 

    if(isAdmin) {
        columns.push({
          headerStyle: headerCSS,     cellStyle: cellCSS,
          render: row => 
          <div> 
            { 
            (row.gameOver && !row.isSettled) ?
            <Button variant="contained" color="primary" onClick={e=>settleGameAmount(e, row.gameId, row.betAmount)}>
                Settle
            </Button>  
            :
            <Button variant="contained"  disabled>Settle</Button>
            }
          </div> 
        })
    }
    else {
        columns.push({
          headerStyle: headerCSS,     cellStyle: cellCSS,
          render: row => 
          <div> 
            { 
            (row.player1===account || row.gameOver)  ?
            <Button variant="contained" disabled>Start_Play</Button>  
            :
            <Button variant="contained" color="primary" onClick={e=>playGameAmount(e, row.gameId, row.betAmount)}>Start_Play</Button>
            }
          </div> 
        })
    }

    
    return (
        <div>
            <div className="initGame">
            <h5>Start Game </h5>
            {
                !loading
                ?
                <form 
                    onSubmit={(event) => {
                        event.preventDefault()
                        setLoading(true)
                        const price = web3.utils.toWei(bet.toString(), 'Ether')
                        contract.methods.initializeGame(bet)
                        .send({ from: account, value: price }, (error, transactionHash) => {
                            if(transactionHash) {
                                SuccessAlert("Game initialized..")
                            }
                            console.log("transaction hash is ",transactionHash);
                            setLoading(false);
                            updateList()
                        });
                    }} 
                    style={{display:'flex', flexDirection:'row', alignItems:'center'}}
                >
                    <input
                        id="betAmount"
                        type="number"
                        className="form-control"
                        placeholder="Bet Amount (in Ethers)"
                        onChange={e=>setBet(e.target.value)}
                        required 
                    />
                    <button type="submit" style={{marginLeft:'20px', whiteSpace:'nowrap'}} className="btn btn-primary">Initialize Game</button>
                </form>
                :
                <CircularProgress style={{display:'block', margin:'auto'}} />
            }
            </div>
            <br />
            <br />
            <h5>All Games History </h5>
            <MaterialTable 
                title="All Games listed: "
                data = {games}
                columns = {columns}
                options = {{
                    search: true,
                    sorting: true,
                    paging: true,
                    pageSizeOptions: [5],
                }}
            />
        </div>
    )
}

export default Home
