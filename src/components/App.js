import React, { useState, useEffect } from 'react';
import '../css/App.css';
import TicTacToeContract from '../abis/TicTacToe.json';
import getWeb3 from '../getWeb3';
import ReactNotifications from 'react-notifications-component';
import MainContent from './MainContent';

function App() {

    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState('');
    const [networkId, setNetworkId] = useState('');
    const [ticTacToeContract, setTicTacToeContract] = useState(null);
    // const [contractAddress, setContractAddress] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    
    async function establishConnection() {
      const web = await getWeb3();
      setWeb3(web);
      const accounts = await web.eth.getAccounts();
      setAccount(accounts[0]);
      const nwId = await web.eth.net.getId();
      setNetworkId(nwId);
      const networkData = TicTacToeContract.networks[nwId];

      window.ethereum.on('accountsChanged', function (accounts) {
        setAccount(accounts[0]);
        window.location.reload();
      })

      if(networkData) {
          const contract = new web.eth.Contract(TicTacToeContract.abi, networkData.address);
          // setContractAddress(contract._address)
          const admin = await contract.methods.admin().call()
          if(admin===accounts[0]) {
            setIsAdmin(true);
          }
          setTicTacToeContract(contract);
      } 
      else {
          window.alert('Your Contracts not deployed to detected network.')
      }
  }

  useEffect(() => {
      establishConnection();
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);  

  return (
    ticTacToeContract
    ?
    <div className="app">
        <ReactNotifications />
        <MainContent 
            web3 = {web3}
            account = {account}
            networkId = {networkId}
            contract = {ticTacToeContract}
            isAdmin = {isAdmin}
        />
    </div>
    :
    <div className="app__loading__gif">
        <img 
          src="https://i.gifer.com/ZZ5H.gif"  
          alt="logo..."    
        />
    </div>
  );
}

export default App;