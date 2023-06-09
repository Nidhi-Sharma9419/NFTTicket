import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import "./App.css";
//import Header from './components/Header';
import Header from "./MyComponents/header";
import { signers } from "./MyComponents/Helpers/Contracts";
import Home from "./pages/Home";
import Events from "./pages/Events/Events";
import CreateEvent from "./pages/Events/CreateEvent";
import MyEvents from "./pages/Events/MyEvents";
import Validate from "./pages/Events/Validate";
import EventDetails from "./pages/Events/EventDetails";
import LoadEvent from "./pages/Events/LoadEvent";
import TicketDetails from "./pages/tickets/TicketDetails";
import CreateTicket from "./pages/tickets/Create/CreateTicket";
import ResaleList from "./pages/Resale/ResaleList";
import EventResale from "./pages/Resale/EventResale";
import ResellTicket from "./pages/Resale/Create/ResellTicket";
import BookTickets from "./pages/BookTickets";
import Web3Modal from "web3modal";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import Resale from "./pages/Resale";
import Connect from "./pages/Connect";
import MyTickets from "./pages/tickets/MyTickets";

const App = () => {
  const [web3Provider, setWeb3Provider] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState("");



  const providerOptions = {
    coinbasewallet: {
      package: CoinbaseWalletSDK,
      options: {
        appName: "Web3Modal Demo",
        infuraId: {
          1: "https://mainnet.infura.io/v3/9aa8dd8ca6ea43058bfd66e6980ef75b",
        },
      },
    },
  };

   useEffect(() => {
    checkSigner();

    // Handle wallet account change event
    window.ethereum.on("accountsChanged", (accounts) => {
      if (accounts.length > 0) {
        checkSigner();
      } else {
        setWeb3Provider(null);
        setWalletAddress("");
        setWalletBalance("");
        setLoggedIn(false);
      }
    });

    // Handle chain change event
    window.ethereum.on("chainChanged", () => {
      checkSigner();
    });

    // Clean up the event listeners when component unmounts
    return () => {
      window.ethereum.removeAllListeners("accountsChanged");
      window.ethereum.removeAllListeners("chainChanged");
    };
  }, []);

  async function checkSigner() {
    try {
      
      const signedContracts = await signers();
      const { signer, signedProvider } = signedContracts;


      const address = await signer.getAddress();
      const balance = await signer.getBalance();

      setWeb3Provider(signedProvider);
      setWalletAddress(address);
      setWalletBalance(balance.toString());
      setLoggedIn(true);
    } catch (error) {
      setWeb3Provider(null);
      setWalletAddress("");
      setWalletBalance("");
      setLoggedIn(false);
      console.error(error);
    }
  }
  

  return (
    <div className="max-width">
      <Router>
        <Header
          web3Provider={web3Provider}
          loggedIn={loggedIn}
          walletAddress={walletAddress}
          walletBalance={walletBalance}
          checkSigner={checkSigner}
        />

        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/connect" element={<Connect />}></Route>
          <Route path="/events" element={<Events />}></Route>
          <Route path="/events/:eventId" element={<EventDetails />}></Route>
          <Route path="/events-create" element={<CreateEvent />}></Route>
          <Route path="/events-myevents" element={<MyEvents />}></Route>
          <Route path="/events-myevents/:eventId" element={<LoadEvent />}></Route>
          <Route path="/events-validate/:eventId" element={<Validate />}></Route>
          <Route path="/book-tickets" element={<BookTickets />}></Route>
          <Route path="/resale-tickets" element={<Resale />}></Route>
          <Route path="/tickets" element={<MyTickets />}></Route>
          <Route path="/tickets/:tokenId" element={<TicketDetails />}></Route>
          <Route path="/tickets-create/:eventId" element={<CreateTicket />}></Route>
          <Route path="/resale" element={<ResaleList />}></Route>
          <Route path="/resale/:tokenId" element={<EventResale />}></Route>
          <Route path="/resale-create/:ticketId" element={<ResellTicket />}></Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
