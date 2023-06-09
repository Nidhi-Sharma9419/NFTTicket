import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import image from "../NFTix.svg";
import { ethers } from "ethers";
import './myStyle.css'

export default function Header({
  web3Provider,
  loggedIn,
  walletAddress,
  walletBalance,
  checkSigner,
}) {

  function truncateWalletAddress(address) {
    const truncatedAddress = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    return truncatedAddress;
  }

  function truncateBalance(balance, decimalPlaces) {
    let res = ethers.utils.formatEther(balance);
    res = (+res).toFixed(decimalPlaces);
    return res;
  }

  async function connectWallet() {
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        await checkSigner();
      }
    } catch (error) {
      console.error(error);
    }
  }

  const location = useLocation();
  const navigate = useNavigate();
  function pathMatchRoute(route) {
    if (route === location.pathname) {
      return true;
    }
  }


  return (
    <div className="bg-zinc-900 border-b shadow-sm sticky top-0 z-50">
      <header className="flex justify-between items-center px-3 max-w-6xl mx-auto">
        <div>
          <img
            src={image}
            style={{transform: "scale(2)"}}
            alt="NFTix"
            className="flex items-center justify-between h-16 px-4 cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>
        <div>
          <ul className="flex space-x-5">
            {web3Provider === null ? (
              <li
                className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px]
                    border-b-transparent ${pathMatchRoute("/connect") &&
                  "text-black border-b-red-500"
                  }`}
                onClick={connectWallet}
              >
                <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">
                  Connect Wallet
                </button>
              </li>
            ) : (
              <>
                <li 
                  className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${pathMatchRoute("/") && "text-black border-b-red-500"
                    }`}
                  onClick={() => navigate("/")}
                >
                  Home
                </li>
                <li
                  className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px]
                border-b-transparent ${pathMatchRoute("/events") && "text-black border-b-red-500"
                    }`}
                  onClick={() => navigate("/events")}
                >
                  All Events
                </li>

                <li
                  className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] hover:text-red
                border-b-transparent ${pathMatchRoute("/events-myevents") && "text-black border-b-red-500"
                    }`}
                  onClick={() => navigate("/events-myevents")}
                >
                  Manage Events
                </li>
                <li
                  className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px]
                border-b-transparent ${pathMatchRoute("/book-tickets") &&
                    "text-black border-b-red-500"
                    }`}
                  onClick={() => navigate("/book-tickets")}
                >
                  My Tickets
                </li>
                <li
                  className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px]
                border-b-transparent ${pathMatchRoute("/resale-tickets") &&
                    "text-black border-b-red-500"
                    }`}
                  onClick={() => navigate("/resale-tickets")}
                >
                  Resale
                </li>
                <li
                  className="cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px]
                border-b-transparent"
                >
                  {truncateWalletAddress(walletAddress)} - {truncateBalance(walletBalance, 4)}
                </li>
              </>
            )}
          </ul>
        </div>
      </header>
    </div>
  );
}
