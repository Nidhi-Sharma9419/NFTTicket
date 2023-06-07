import React from 'react';

import Web3Modal from 'web3modal';
import { ethers } from "ethers";
//import { Web3Provider } from 'ethers';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';




//const ethersProviders = ethers.providers;
//const provider = new ethers.providers.JsonRpcProvider('https://example-rpc-provider.com');
//import { EthereumProvider } from '@walletconnect/ethereum-provider'



export default function Connect (){
    
    const providerOptions = {
        coinbasewallet:{
            package: CoinbaseWalletSDK,
            options:{
                appName: 'Web3Modal Demo',
                infuraId: {1: 'https://mainnet.infura.io/v3/9aa8dd8ca6ea43058bfd66e6980ef75b'}
            }
        }
    }    

async function connectWallet(){
   
    try {
        let web3Modal = new Web3Modal( {
        cacheProvider: false,
        providerOptions,
    });
    const web3ModalInstance = await web3Modal.connect();
    const web3ModalProvider = new ethers.BrowserProvider(web3ModalInstance);
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



// import { EthereumProvider } from '@walletconnect/ethereum-provider'

// export default function Connect() {
// const [provider, setProvider] = useState(undefined)

// async function onInitializeProviderClient() {
//     const client = await EthereumProvider.init({
//     projectId: 'YOUR_PROJECT_ID',
//     showQrModal: true,
//     qrModalOptions: { themeMode: 'light' },
//     chains: [1],
//     methods: ['eth_sendTransaction', 'personal_sign'],
//     events: ['chainChanged', 'accountsChanged'],
//     metadata: {
//         name: 'My Dapp',
//         description: 'My Dapp description',
//         url: 'https://my-dapp.com',
//         icons: ['https://my-dapp.com/logo.png']
//       }
//     })

//     setProvider(client)
//   }

//   useEffect(() => {
//     onInitializeProviderClient()
//   }, [])

//   return provider ? (
//     <button onClick={() => provider.connect()}>Connect Wallet</button>
//   ) : (
//     'Loading...'
//   )
// }