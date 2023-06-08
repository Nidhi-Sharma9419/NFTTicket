import Web3Modal from "web3modal";
import { nftaddress, nftmarketaddress } from "./config";
import NFT from "../../assets/ABI/NFTTICKET.json";
import Market from "../../assets/ABI/TICKETMARKET.json";
import { ethers } from "ethers";


// Create a provider for the Sepolia testnet
// Replace the RPC endpoint URL with the actual one for the Sepolia network
const rpcEndpoint = 'https://rpc.sepolia.org';

// Replace the chain ID with the correct one for the Sepolia network
const chainId = 11155111;

// Create a provider for the Sepolia network
const provider = new ethers.providers.JsonRpcProvider(rpcEndpoint, { chainId });

// Obtain the token contract instance
export const tokenContract = new ethers.Contract(nftaddress, NFT, provider);
export const marketContract = new ethers.Contract(nftmarketaddress, Market, provider);
export const signers = async () => {
  const web3Modal = new Web3Modal();
  const connection = await web3Modal.connect();
  const signedProvider = new ethers.providers.Web3Provider(connection);

  // Gets the address of the wallet connected to Metamask
  const signer = signedProvider.getSigner();

  // Used to access contract functions that require a signature for a transaction
  const signedTokenContract = new ethers.Contract(nftaddress, NFT, signer);
  const signedMarketContract = new ethers.Contract(nftmarketaddress, Market, signer);

  return { signedMarketContract, signer, signedProvider, signedTokenContract };
};
