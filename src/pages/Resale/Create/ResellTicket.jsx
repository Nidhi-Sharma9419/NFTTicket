import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import axios from "axios";

import MaticPrice from "../../../MyComponents/Helpers/Price/Matic";
import PoundPrice from "../../../MyComponents/Helpers/Price/Pound";
import { nftaddress } from "../../../MyComponents/Helpers/config";
import { signers, tokenContract } from "../../../MyComponents/Helpers/Contracts";

export default function ResellTicket() {
    const { ticketId } = useParams();

  const [err, setErr] = useState("");
  const [loadingState, setLoadingState] = useState(false);
  const [resalePrice, setResalePrice] = useState({ matic: "0", gbp: "" });
  const [royaltyFee, setRoyaltyFee] = useState("");
  const [maxPrice, setMaxPrice] = useState({ matic: "", gbp: "0" });

  useEffect(() => {
    loadResaleDetails();
    setLoadingState(true);
  }, []);

  const location = useLocation();
  const navigate = useNavigate();

  function pathMatchRoute(route) {
    if (route === location.pathname) {
      return true;
    }
  }

  async function loadResaleDetails() {
    try {
      if (!Number.isInteger(parseInt(ticketId))) {
        throw new Error("Ticket ID was not valid");
      }
      const signedContracts = await signers();
      const { signer } = signedContracts;
      const address = signer.getAddress();
      const qty = await tokenContract.balanceOf(address, ticketId);
      if (qty < 1) {
        throw new Error(`You do not own the Ticket ID: ${ticketId}`);
      }
      const ticketUri = await tokenContract.uri(ticketId);
      const ticketRequest = await axios.get(ticketUri);
      const ticketData = ticketRequest.data;
      const maxResalePrice = ticketData.properties.maxResalePrice;
      const gbpMaxPrice = await PoundPrice(maxResalePrice);
      setMaxPrice({ matic: maxResalePrice, gbp: gbpMaxPrice });
      setRoyaltyFee(ticketData.properties.royaltyFee);
    } catch (error) {
      console.log(error);
      error.data === undefined
        ? setErr(error.message)
        : setErr(error.data.message);
    }
  }

  async function listForResale() {
    try {
      setLoadingState(false);
      if (!resalePrice.gbp || !(resalePrice.gbp >= 0)) {
        throw new Error("Please enter a positive price");
      }

      if (resalePrice.gbp > maxPrice.gbp) {
        throw new Error("Resale price must be less than the max price");
      }
      const contracts = await signers();
      const { signedMarketContract, signedTokenContract } = contracts;

      let price = ethers.utils.parseUnits(resalePrice.matic, "ether");
      const approvalTransaction = await signedTokenContract.giveResaleApproval(
        ticketId
      );
      await approvalTransaction.wait();
      const resaleTransaction = await signedMarketContract.listOnResale(
        nftaddress,
        ticketId,
        price
      );
      await resaleTransaction.wait();
      setLoadingState(true);
      navigate("/resale");
    } catch (error) {
      setLoadingState(true);
      console.log(error);
      error.data === undefined
        ? setErr(error.message)
        : setErr(error.data.message);
    }
  }

  async function updatePrice(value) {
    const maticPrice = await MaticPrice(value);
    setResalePrice({ gbp: value, matic: maticPrice });
  }

  if (!loadingState) {
    return <h1 className="container text-6xl">Loading...</h1>;
  }

  if (!royaltyFee && err) {
    return <p className="container text-danger text-3xl">{err}</p>;
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-center m-4 text-4xl">
        Create Resale Listing for Ticket ID: #{ticketId}
      </h1>
      <label htmlFor="royalty" className="form-label text-xl">
        Royalty Fee
      </label>
      <div className="flex items-center mb-3">
        <input
          className="form-control mr-2"
          type="text"
          value={royaltyFee}
          aria-label="royalty"
          disabled
          readOnly
        />
        <span className="text-xl">%</span>
      </div>

      <label htmlFor="resale" className="form-label text-xl">
        Max Resale Price
      </label>
      <div className="flex items-center mb-3">
        <span className="text-xl">£</span>
        <input
          className="form-control ml-2"
          type="text"
          value={maxPrice.gbp}
          aria-label="resale"
          disabled
          readOnly
        />
      </div>
      <div style={{ marginBottom: "20px" }} className="text-xl">
        = {maxPrice.matic} MATIC
      </div>

      <label htmlFor="price" className="form-label text-xl">
        Choose Resale Price
      </label>
      <div className="flex items-center mb-3">
        <span className="text-xl">£</span>
        <input
          type="text"
          className="form-control ml-2"
          aria-label="price"
          onChange={(e) => {
            updatePrice(e.target.value);
          }}
          required
        />
      </div>
      <div style={{ marginBottom: "20px" }} className="text-xl">
        = {resalePrice.matic} MATIC
      </div>
      <button
        onClick={listForResale}
        className="btn btn-lg btn-primary"
      >
        List
      </button>
      {err && <p className="text-danger text-3xl">{err}</p>}
    </div>
  );
}
