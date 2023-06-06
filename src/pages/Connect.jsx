import React from 'react'

import Web3Modal from 'web3modal';
import { ethers } from "ethers";


//const ethersProviders = ethers.providers;

const providerOptions = {

}

export default function Connect (){

async function connectWallet(){
    try {
        let web3Modal = new Web3Modal( {
        cacheProvider: false,
        providerOptions,
    });
    const web3ModalInstance = await web3Modal.connect();
    const web3ModalProvider = new ethers.providers.Web3Provider(web3ModalInstance);
    console.log(web3ModalProvider);
    } catch (error) { 

    console.error(error);

    }
}

return (

    
    <div className='App-header'>
        <h1>Web3Modal Connection!</h1>
                <button onClick={connectWallet}>
                    Connect Wallet
                </button>
    </div>
    
)
}

//export default Connect;