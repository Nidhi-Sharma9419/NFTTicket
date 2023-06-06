// import React from 'react'
// import './header.css';
// import Web3Modal from 'web3modal';
// import { ethers } from "ethers";

// const Header = () => {

//   async function connectWallet(){
//     try {
//       let web3Modal = new Web3Modal( {
//           cacheProvider: false,
//           providerOptions,
//       });
//       const web3ModalInstance = await web3Modal.connect();
//       const web3ModalProvider = new ethers.providers.Web3Provider(web3ModalInstance);
//       console.log(web3ModalProvider);
//     } catch (error) { 

//       console.error(error);
      
//     }
//   }

//   return (
//     <div>
//     <div className="header">
//       <span className="heading-gradient absolute-center cur-po"><strong>NFTix</strong></span>
//     </div>
//     <div className='App-header'>
//       <h1>Web3Modal Connection!</h1>
//                 <button onClick={connectWallet}>
//                     Connect Wallet
//                 </button>
//     </div>
//     </div>
//   )
// }

// export default Header;