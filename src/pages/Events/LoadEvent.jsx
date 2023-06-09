import { useLocation, useNavigate, useParams  } from "react-router-dom";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";

import {
  signers,
  tokenContract,
  marketContract,
} from "../../MyComponents/Helpers/Contracts";
import { nftmarketaddress, nftaddress } from "../../MyComponents/Helpers/config";
import PoundPrice from "../../MyComponents/Helpers/Price/Pound";
// import { validate } from "superstruct";

export default function LoadEvent() {
  const [event, setEvent] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loadingState, setLoadingState] = useState(false);
  const [err, setErr] = useState("");
  const  { eventId } = useParams();

  useEffect(() => {
    loadData();
  }, []);

  const location = useLocation();
  const navigate = useNavigate();
  function pathMatchRoute(route) {
    if (route === location.pathname) {
      return true;
    }
  }

  async function loadData() {
    const success = await loadEvent();
    if (success) {
      await loadTickets();
    }
    setLoadingState(true);
  }

  async function loadEvent() {
    try {
      if (!Number.isInteger(parseInt(eventId))) {
        throw new Error(`Event ID '${eventId}' is not valid`);
      }

      const signedContracts = await signers();
      const { signer, signedMarketContract } = signedContracts;
      const address = await signer.getAddress();

      const data = await signedMarketContract.getEvent(eventId);
      if (data.owner != address) {
        throw new Error(`You do not not own the Event ID #${eventId}`);
      }
      const eventUri = await data.uri;
      if (!eventUri) {
        throw new Error("Could not find Event URI");
      }
      const eventRequest = await axios.get(eventUri);
      const eventData = eventRequest.data;

      const currEvent = {
        eventId: data.eventId.toNumber(),
        name: eventData.name,
        description: eventData.description,
        imageUri: eventData.image,
        location: eventData.location,
        startDate: eventData.eventDate,
      };

      setEvent(currEvent);
      return true;
    } catch (error) {
      console.log(error);
      error.data === undefined
        ? setErr(error.message)
        : setErr(error.data.message);
      return false;
    }
  }

  async function loadTickets() {
    try {
      const data = await marketContract.getEventTickets(eventId);
      const eventTickets = await Promise.all(
        data.map(async (i) => {
          const tokenId = i.tokenId.toNumber();
          const tokenUri = await tokenContract.uri(tokenId);
          const ticketRequest = await axios.get(tokenUri);
          const ticketData = ticketRequest.data;

          let price = ethers.utils.formatUnits(i.price.toString(), "ether");
          let gbpPrice = await PoundPrice(price);
          let maxResalePrice = ticketData.properties.maxResalePrice;
          let maxResalePriceGBP = await PoundPrice(maxResalePrice);
          let qty = await tokenContract.balanceOf(nftmarketaddress, tokenId);
          let supply = i.totalSupply.toNumber();
          let _ticket = {
            tokenId,
            name: ticketData.name,
            description: ticketData.description,
            price,
            gbpPrice,
            limit: i.purchaseLimit.toNumber(),
            royaltyFee: ticketData.properties.royaltyFee,
            maxResalePrice,
            maxResalePriceGBP,
            supply,
            remaining: qty.toNumber(),
            add: 0,
          };
          return _ticket;
        })
      );
      setTickets(eventTickets);
    } catch (error) {
      console.log(error);
      error.data === undefined
        ? setErr(error.message)
        : setErr(error.data.message);
    }
  }

  async function addTickets(id, qty) {
    setLoadingState(false);
    try {
      const contracts = await signers();
      const { signedMarketContract, signedTokenContract } = contracts;

      const mintTokensTransaction = await signedTokenContract.addTokens(
        id,
        qty
      );
      await mintTokensTransaction.wait();

      const addTokenToMarketTransaction =
        await signedMarketContract.addMoreTicketsToMarket(nftaddress, id, qty);
      await addTokenToMarketTransaction.wait();
      window.location.reload();
    } catch (error) {
      console.log(error);
      error.data === undefined
        ? setErr(error.message)
        : setErr(error.data.message);
    }
    setLoadingState(true);
  }

  if (!loadingState) {
    return (
      <div className="container">
        <h1 className="text-6xl">Loading...</h1>
      </div>
    );
  }

  if (err) {
    return (
      <div className="container">
        <p className="text-danger text-3xl">{err}</p>
      </div>
    );
  }

  return (
    event && (
      <div className="container flex justify-center items-center">
        <section>
          <div className="container flex justify-center items-center border-b border-secondary">
            <div className="row justify-center items-center">
              <div className="col-auto text-center card shadow border border-dark rounded-l overflow-scroll m-3 pt-3">
                <img src={event.imageUri} />
                <div className="card-body">
                  <div style={{ maxHeight: "60px", overflow: "auto" }}>
                    <h3 className="card-title text-center">
                      <span className="font-bold text-primary">{event.name}</span>{" "}
                      - ID: #{event.eventId}
                    </h3>
                  </div>
                  <div style={{ maxHeight: "55px", overflow: "auto" }}>
                    <p className="">{event.description}</p>
                  </div>
                  <div style={{ maxHeight: "40px", overflow: "auto" }}>
                    <p className="">
                      <i className="bi bi-calendar3"></i> {event.startDate}
                    </p>
                  </div>
                  <div style={{ maxHeight: "65px", overflow: "auto" }}>
                    <p className="">
                      <i className="bi bi-geo-alt-fill"></i> {event.location}
                    </p>
                  </div>
                  <button
                    style={{ backgroundColor: "#eee8a9" }}
                    className="btn font-bold text-primary"
                    // onClick={() => {
                    //   validate(`/events/validate/${event.eventId}`);
                    // }}
                  >
                    Validate Tickets{" "}
                    <i className="bi bi-arrow-right-circle-fill"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className="container flex justify-center items-center">
            <h1 className="text-center m-3">Tickets</h1>
            <div className="row justify-center items-center">
              {tickets.length > 0 &&
                tickets.map((ticket) => (
                  <div
                    key={ticket.tokenId}
                    className="col-12 border-b border-dark flex justify-between m-3"
                  >
                    <div className="w-50 text-center">
                      <h3>
                        <span className="font-bold">{ticket.name}</span>
                        {` - ID: #${ticket.tokenId} `}
                      </h3>
                      <div style={{ height: "55px", overflow: "auto" }}>
                        {ticket.description && <h6>{ticket.description}</h6>}
                      </div>
                      <div>
                        <h4 className="text-primary font-bold">
                          Price: £{ticket.gbpPrice}
                        </h4>
                        <p className="text-secondary">= {ticket.price} MATIC</p>
                      </div>
                    </div>
                    <div className="w-50 flex justify-center items-center text-center">
                      <div className="flex justify-between">
                        <div className="w-48">
                          <div>
                            <h6> Royalty Fee: {ticket.royaltyFee}%</h6>
                            <h6> Purchase Limit: {ticket.limit}</h6>
                          </div>
                          <div className="my-4">
                            <h6>
                              {" "}
                              Max Resale Price: £{ticket.maxResalePriceGBP}
                            </h6>
                            <h6 className="text-secondary">
                              = {ticket.maxResalePrice} MATIC
                            </h6>
                          </div>
                        </div>
                        <div className="text-center p-2 m-2 bg-primary w-52">
                          <p className="text-sm text-light font-bold">
                            Tickets Supplied: {ticket.supply}
                          </p>
                          {ticket.remaining > 0 ? (
                            <p className="text-sm text-cream font-bold">
                              Tickets Remaining: {ticket.remaining}
                            </p>
                          ) : (
                            <p className="text-sm text-light font-bold">
                              Tickets Remaining: {ticket.remaining}
                            </p>
                          )}
                          <div className="input-group mb-2">
                            <span
                              className="input-group-text hidden md:block"
                              id="qty"
                            >
                              Add More
                            </span>
                            <input
                              className="form-control"
                              type="text"
                              aria-label="qty"
                              placeholder="Qty"
                              onChange={(e) => (ticket.add = e.target.value)}
                            />
                          </div>
                          <button
                            onClick={() => {
                              ticket.add > 0
                                ? addTickets(ticket.tokenId, ticket.add)
                                : alert("Please select quantity");
                            }}
                            style={{ backgroundColor: "#eee8a9" }}
                            className="btn btn-sm text-primary"
                          >
                            Add Tickets
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              {tickets.length < 1 && (
                <h1 className="text-3xl text-center text-secondary">
                  No tickets available for this event
                </h1>
              )}
            </div>
          </div>
        </section>
        <div className="text-center">
          <button
            onClick={() => {
              navigate.push(`/tickets-create/${event.eventId}`);
            }}
            className="btn btn-primary"
          >
            Create New Tickets
          </button>
        </div>

        {err && <p className="text-danger text-3xl">{err}</p>}
      </div>
    )
  );
}
