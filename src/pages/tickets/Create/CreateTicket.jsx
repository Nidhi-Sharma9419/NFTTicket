import { BigNumber, ethers } from "ethers";
import { useState, useEffect } from "react";
import { NFTStorage } from "nft.storage";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import MaticPrice from "../../../MyComponents/Helpers/Price/Matic";
import { nftaddress } from "../../../MyComponents/Helpers/config";
import { signers } from "../../../MyComponents/Helpers/Contracts";
import { positiveInt } from "../../../MyComponents/Helpers/Validation";
import Big from 'big.js';
var storageToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDZhMzVlOThGMEU0QTFhQTkzZUZFY2RENDJjZDMxRUY0OTg5ZjVhMjAiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY4NjA5MjQ2NjQ5MCwibmFtZSI6Ik5GVE1BUktFVCJ9.rJRQrjXUwJpJUYcuzT0wpebM-5lnE3lO43rNdHTLWhA";
const client = new NFTStorage({
  token: storageToken,
});

export default function CreateTicket() {
  const [err, setErr] = useState("");
  const [loadingState, setLoadingState] = useState(false);
  const [formInput, updateFormInput] = useState({
    name: "",
    description: "",
    price: "",
    priceMATIC: "0",
    purchaseLimit: "",
    amount: "",
    royaltyFee: "",
    maxResalePrice: "",
    maxResalePriceMATIC: "0",
  });
  const [eventName, setEventName] = useState("");
  const [eventPic, setEventPic] = useState("");
  const { eventId } = useParams();

  useEffect(() => {
    loadData();
    setLoadingState(true);
  }, []);

  const location = useLocation();
  const navigate = useNavigate();

  function pathMatchRoute(route) {
    if (route === location.pathname) {
      return true;
    }
  }

  async function loadData() {
    let eventData = "";
    try {
      const signedContracts = await signers();
      const { signedMarketContract, signer } = signedContracts;
      if (!Number.isInteger(parseInt(eventId))) {
        throw new Error("Event ID used to create ticket was not valid");
      }
      const data = await signedMarketContract.getEvent(eventId);
      const eventUri = await data.uri;
      const address = await signer.getAddress();
      if (!eventUri) {
        throw new Error("Could not find Event URI");
      } else if (data.owner != address) {
        throw new Error(
          "You do not own the event that you are trying to create a ticket for"
        );
      }

      const eventRequest = await axios.get(eventUri);
      eventData = eventRequest.data;
      setEventName(eventData.name);
      setEventPic(eventData.image);
    } catch (error) {
      console.log(error);
      error.data === undefined
        ? setErr((oldErr) => [...oldErr, error.message])
        : setErr((oldErr) => [...oldErr, error.data.message]);
    }
    setLoadingState(true);
    return;
  }

  async function getPlaceholderImage() {
    const imageOriginUrl = eventPic;
    const r = await fetch(imageOriginUrl);
    if (!r.ok) {
      throw new Error(`error fetching image: [${r.statusCode}]: ${r.status}`);
    }
    return r.blob();
  }

  async function uploadToIPFS() {
    const {
      name,
      description,
      price,
      priceMATIC,
      purchaseLimit,
      amount,
      royaltyFee,
      maxResalePrice,
      maxResalePriceMATIC,
    } = formInput;
    if (
      !name ||
      !price ||
      !amount ||
      !purchaseLimit ||
      !royaltyFee ||
      !maxResalePrice
    ) {
      console.log({
        name,
        price,
        amount,
        purchaseLimit,
        royaltyFee,
        maxResalePrice,
      });
      throw new Error("Please check you have completed all fields");
    }
    positiveInt([amount, purchaseLimit]);
    if (amount < 1) {
      throw new Error("Number of tickets to be created must be higher than 0");
    }
    if (!(royaltyFee >= 0 && price >= 0 && maxResalePrice >= 0)) {
      throw new Error("Please ensure all inputs are positive numbers");
    }

    const image = await getPlaceholderImage();

    /* first, upload metadata to IPFS */
    const data = {
      name,
      description,
      image,
      properties: {
        price: priceMATIC,
        eventId,
        purchaseLimit,
        royaltyFee,
        maxResalePrice: maxResalePriceMATIC,
      },
    };
    const metadata = await client.store(data);
    const url = `https://ipfs.io/ipfs/${metadata.ipnft}/metadata.json`;
    console.log("Metadata URL: ", url);
    return url;
  }

  const handleSubmit = (e) => {
    e.preventDefault(); 
    addTicket(); 
  };

  async function addTicket() {
    const {
      purchaseLimit,
      amount,
      priceMATIC,
      royaltyFee,
      maxResalePriceMATIC,
    } = formInput;
    const getContracts = await signers();
    const { signedMarketContract, signedTokenContract } = getContracts;

    try {
      setLoadingState(false);
      const url = await uploadToIPFS();
      const ticketPrice = ethers.utils.parseUnits(priceMATIC, "ether");
      const resalePrice = ethers.utils.parseUnits(maxResalePriceMATIC, "ether");

      let tokenId = -1;
      let nftTransaction = await signedTokenContract.createToken(url, amount);
      let nftTx = await nftTransaction.wait();
      nftTx.events.forEach((element) => {
        if (element.event === 'NFTTicketCreated') {
          tokenId = element.args.tokenId.toNumber();
        }
      });
      const marketTransaction = await signedMarketContract.createMarketTicket(
        eventId,
        tokenId, 
        nftaddress,
        purchaseLimit,
        amount,
        ticketPrice,
        royaltyFee,
        resalePrice
      );
      await marketTransaction.wait();

      navigate("/events-myevents");
    } catch (error) {
      console.log(error);
      error.data === undefined
        ? setErr(error.message)
        : setErr(error.data.message);
    }
    setLoadingState(true);
  }

  async function updatePrice(type, value) {
    const maticPrice = await MaticPrice(value);
    if (type == "ticket") {
      updateFormInput({ ...formInput, priceMATIC: maticPrice, price: value });
    } else {
      updateFormInput({
        ...formInput,
        maxResalePriceMATIC: maticPrice,
        maxResalePrice: value,
      });
    }
  }

  if (!loadingState) {
    return <h1 className="container px-20 display-1">Loading...</h1>;
  }

  if (!eventName && err.length > 0) {
    return <p className="container display-6 text-danger">{err}</p>;
  }

  return (
    <div className="container">
      <h1 className="">Create Ticket</h1>
      <form onSubmit={handleSubmit}>
        <p className="">{err}</p>
        <br />
        <label htmlFor="eventName">Ticket Name</label>
        <input
          type="text"
          className="form-input"
          id="ticketName"
          onChange={(e) =>
            updateFormInput({ ...formInput, name: e.target.value })
          }
          required={true}
        />

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          className="form-textarea"
          aria-label="description"
          rows="3"
          onChange={(e) =>
            updateFormInput({ ...formInput, description: e.target.value })
          }
          required={true}
        ></textarea>

        <label htmlFor="price">Price</label>
        <div className="flex">
          <span className="input-group-addon" id="pound">
            £
          </span>
          <input
            type="text"
            aria-label="price"
            aria-describedby="pound"
            onChange={(e) => {
              updatePrice("ticket", e.target.value);
            }}
            required={true}
          />
        </div>
        <div style={{ marginBottom: "20px" }} className="form-text">
          = {formInput.priceMATIC} MATIC
        </div>

        <label htmlFor="address">Purchase Limit</label>
        <input
          type="text"
          placeholder="Maximum tickets a buyer can own at once"
          className="form-input"
          id="limit"
          onChange={(e) =>
            updateFormInput({ ...formInput, purchaseLimit: e.target.value })
          }
          required={true}
        />

        <label htmlFor="image">Number of Tickets</label>
        <input
          type="text"
          className="form-input"
          id="amount"
          onChange={(e) =>
            updateFormInput({ ...formInput, amount: e.target.value })
          }
          required={true}
        />

        <label htmlFor="image">Royalty Fee</label>
        <div className="flex">
          <input
            type="text"
            className="form-input"
            placeholder="% fee received if buyer resells ticket"
            aria-label="royalty"
            aria-describedby="percent"
            onChange={(e) =>
              updateFormInput({ ...formInput, royaltyFee: e.target.value })
            }
            required={true}
          />
          <span className="input-group-addon" id="percent">
            %
          </span>
        </div>

        <label htmlFor="image">Max Resale Price</label>
        <div className="flex">
          <span className="input-group-addon" id="pound">
            £
          </span>
          <input
            type="text"
            className="form-input"
            aria-label="resle"
            aria-describedby="pound"
            onChange={(e) => updatePrice("resale", e.target.value)}
            required={true}
          />
        </div>
        <div className="form-text">= {formInput.maxResalePriceMATIC} MATIC</div>

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 mt-4 rounded"
        >
          Create Tickets
        </button>
      </form>
    </div>
  );
}
