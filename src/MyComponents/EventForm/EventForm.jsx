import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { signers } from "../Helpers/Contracts";
import { isValidImage } from "../Helpers/Validation";
import { useLocation, useNavigate } from "react-router-dom";
import { Buffer } from "buffer";
const ipfsClient = require("ipfs-http-client");
var processId = "2Qqta2eVmqpYQh6TFS3WtgV1spA"
var processSecret = "411bf5dd4489022a0e8cd045238c1172"
const auth =
  'Basic ' +
  Buffer.from(processId + ":" + processSecret
  ).toString("base64");
const client = ipfsClient.create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  apiPath: "/api/v0",
  headers: {
    authorization: auth,
  },
});


export default function EventForm() {
  const [loadingState, setLoadingState] = useState(true);
  const [eventPic, setEventPic] = useState(null);
  const [err, setErr] = useState("");
  const [eventDate, setEventDate] = useState(formatDate(Date.now()));
  const [formInput, updateFormInput] = useState({
    name: "",
    description: "",
    address: "",
    postcode: "",
  });
  const location = useLocation();
  const navigate = useNavigate();
  function pathMatchRoute(route) {
    if (route === location.pathname) {
      return true;
    }
  }

  function formatDate(date) {
    const oldDate = new Date(date);
    const newDate =
      oldDate.getFullYear() +
      "/" +
      (oldDate.getMonth() + 1) +
      "/" +
      oldDate.getDate() +
      ", 23:59:59";
    return new Date(newDate);
  }
  async function uploadToPictureToIPFS() {
    const placeholderUrl =
      "https://nfticketing.infura-ipfs.io/ipfs/QmZcjqFN4iEHSpXU3ou1LLMFNhiP1uXcpBobDJFgHfuABP";
    //Upload Event Picture
    if (!eventPic) {
      return placeholderUrl;
    }
    try {
      const added = await client.add(eventPic, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      return `https://nft-ticket-market.infura-ipfs.io/ipfs/${added.path}`;
    } catch (error) {
      console.log(error);
      error.data === undefined
        ? setErr(error.message)
        : setErr(error.data.message);
    }
  }

  async function uploadToIPFS() {
    const { name, description, address, postcode } = formInput;
    if (
      !name ||
      !description ||
      !address ||
      !postcode ||
      !eventDate ||
      eventPic == "Please upload a JPEG, PNG or GIF file"
    ) {
      throw new Error("Please check you have completed all fields");
    }

    const fileUrl = await uploadToPictureToIPFS();
    /* first, upload metadata to IPFS */
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
      location: `${address}, ${postcode}`,
      eventDate: new Date(eventDate).toLocaleDateString(),
    });

    try {
      const added = await client.add(data);
      const url = `https://nft-ticket-market.infura-ipfs.io/ipfs/${added.path}`;
      /* after metadata is uploaded to IPFS, return the URL to use it in the transaction */
      console.log("Event URL: ", url);
      return url;
    } catch (error) {
      console.log(error);
      error.data === undefined
        ? setErr(error.message)
        : setErr(error.data.message);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault(); 
    addEvent(); 
  };

  async function addEvent() {
    setLoadingState(false);
    const signedContracts = await signers();
    const { signedMarketContract } = signedContracts;
    /* create the event  */
    try {
      formatDate(eventDate);
      const url = await uploadToIPFS();
      const transaction = await signedMarketContract.createEvent(
        url,
        Math.floor(new Date(eventDate).getTime() / 1000)
      );
      await transaction.wait();
      setLoadingState(true);
      navigate("/events-myevents");
    } catch (error) {
      console.log(error);
      error.data === undefined
        ? setErr(error.message)
        : setErr(error.data.message);
      setLoadingState(true);
    }
  }

  function handleFileInput(file) {
    if (isValidImage(file.name)) {
      setEventPic(file);
      setErr("");
    } else {
      setEventPic(null);
      setErr("Please upload a JPEG, PNG or GIF file");
    }
  }

  if (!loadingState) {
    return <h1 className="container display-1">Loading...</h1>;
  }


  return (
    <div className="container">
       
      <form onSubmit={handleSubmit}>
      <p className="">{err}</p>
        <br />
      <label htmlFor="eventName">Event Name</label>
        <input
          required={true}
          id="eventName"
          type="text"
          placeholder="Enter event name"
          name="eventName"
          onChange={(e) =>
            updateFormInput({ ...formInput, name: e.target.value })
          }
        />

        <label htmlFor="description">Description</label>
        <input
          required={true}
          v
          id="description"
          type="text"
          placeholder="Enter description"
          name="description"
          onChange={(e) =>
            updateFormInput({ ...formInput, description: e.target.value })
          }
        />

        <label htmlFor="date">Start Date</label>
        <DatePicker
          id="date"
          selected={eventDate}
          onChange={(date) => setEventDate(formatDate(date))}
          required={true}
        />

        <label htmlFor="address">Event Address</label>
        <input
          required={true}
          id="address"
          type="text"
          placeholder="Enter event address"
          name="address"
          onChange={(e) =>
            updateFormInput({ ...formInput, address: e.target.value })
          }
        />

        <label htmlFor="postcode">Event Postcode</label>
        <input
          required={true}
          id="postcode"
          type="text"
          placeholder="Enter post code"
          name="postcode"
          onChange={(e) =>
            updateFormInput({ ...formInput, postcode: e.target.value })
          }
        />

        <label htmlFor="image">Event Picture</label>
        <input
          required={true}
          id="image"
          type="file"
          name="image"
          onChange={(e) => handleFileInput(e.target.files[0])}
        />
        <div>
          {/**If there is a file uploaded then show a preview of it */}
          {eventPic && (
            <img
              className="rounded mt-4"
              width="350"
              src={URL.createObjectURL(eventPic)}
            />
          )}
        </div>

        <button className="bg-black" type="submit">
          Create Event
        </button>
      </form>

    
    </div>
  );
}