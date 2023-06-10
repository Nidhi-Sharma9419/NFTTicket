import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import PriceFeedABI from "./artifacts/contracts/PriceFeed.sol/PriceFeed.json";

const priceFeedAddress = "0x5fb1616F78dA7aFC9FF79e0371741a747D2a7F22"; 

function App() {
  const [latestPrice, setLatestPrice] = useState("");
  useEffect(() => {
    const fetchPrice = async () => {
        try {
            const provider = new ethers.providers.JsonRpcProvider();
            const priceFeedContract = new ethers.Contract(priceFeedAddress, PriceFeedABI.abi, provider);
            const price = await priceFeedContract.getLatestPrice();
            setLatestPrice(price.toString());
        } catch (error) {
            console.error("Error fetching price:", error);
        }
      };
      fetchPrice();
    }, []);
    return (
        <div>
            <h1>Chainlink Price Feed</h1>
            <p>Latest Price: {latestPrice}</p>
        </div>
    );
}export default App;