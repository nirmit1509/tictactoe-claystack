import React, { useState, useEffect } from 'react';
import '../css/MainContent.css';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Home from './Home';
import Play from './Play';
import Navbar from './Navbar'

function MainContent( { web3, contract, networkId, account, isAdmin } ) {


    const [loading, setLoading] = useState(true);
    const [games, setGames] = useState([]);
    const [count, setCount] = useState(0);


    async function fetchDetails() {
        setLoading(true);
            const gameCount = await contract.methods.gameCount().call();
            let temp = []
            for(let i=1; i<=gameCount; i++) {
                const game = await contract.methods.games(i).call()
                temp.push(game)
            }
            setGames(temp);
            console.log(temp);
        setLoading(false);
    }

    useEffect(() => {
        fetchDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [count]);

    const updateList = () => { setCount(count+1); }
    
    
    return (
        !loading 
        ?
        <div className="main__content">
            <div>
                <Navbar 
                    account = {account}
                    isAdmin = {isAdmin}
                />
            </div>
            <Router>
                <Switch>
                    <Route exact path="/home">
                        <Home 
                            web3 = {web3}
                            account={account} 
                            contract={contract}
                            games={games}
                            isAdmin={isAdmin} 
                            updateList={updateList}
                        /> 
                    </Route>
                    <Route exact path="/play/:game_id">
                        <Play
                            web3 = {web3}
                            account={account} 
                            contract={contract}
                            games={games}
                            updateList={updateList} 
                        />
                    </Route>
                    <Route path="*" >
                        <Redirect to="/home" />
                    </Route>
                </Switch>
            </Router>                
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

export default MainContent;