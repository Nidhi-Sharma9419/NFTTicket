import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import PoundPrice from "../../MyComponents/Helpers/Price/Pound";
import { nftaddress } from "../../MyComponents/Helpers/config";
import { marketContract, tokenContract, signers } from "../../MyComponents/Helpers/Contracts";

export default function EventResale() {
  const [event, setEvent] = useState();
  const [ticket, setTicket] = useState();
  const [resaleTickets, setResaleTickets] = useState([]);
  const [loadingState, setLoadingState] = useState(false);
  const [err, setErr] = useState("");

  const { tokenId } = useParams();

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
    if (!Number.isInteger(parseInt(tokenId))) {
      setErr(`Ticket ID '${tokenId}' is not valid`);
    } else {
      await loadEvent();
      await loadResaleTickets();
    }
    setLoadingState(true);
  }

  async function loadEvent() {
    try {
      const ticketUri = await tokenContract.uri(tokenId);
      const ticketRequest = await axios.get(ticketUri);
      const ticketData = ticketRequest.data;

      let eventId = ticketData.properties.eventId;
      const thisEvent = await marketContract.getEvent(eventId);

      const eventUri = thisEvent.uri;
      const eventRequest = await axios.get(eventUri);
      const eventData = eventRequest.data;

      const currEvent = {
        eventId,
        name: eventData.name,
        imageUri: eventData.image,
      };
      const currTicket = {
        tokenId,
        name: ticketData.name,
        description: ticketData.description,
      };
      setEvent(currEvent);
      setTicket(currTicket);
    } catch (error) {
      console.log(error);
      error.data === undefined
        ? setErr(error.message)
        : setErr(error.data.message);
    }
  }

  async function loadResaleTickets() {
    try {
      const data = await marketContract.getResaleTickets(tokenId);
      const tickets = await Promise.all(
        data.map(async (i) => {
          let price = ethers.utils.formatUnits(i.resalePrice.toString(), "ether");
          let gbpPrice = await PoundPrice(price);
          let _ticket = {
            resaleId: i.resaleId.toNumber(),
            seller: i.seller,
            price,
            gbpPrice,
          };
          return _ticket;
        })
      );
      setResaleTickets(tickets);
    } catch (error) {
      console.log(error);
      error.data === undefined
        ? setErr(error.message)
        : setErr(error.data.message);
    }
  }

  async function buyTicket(resaleId, price) {
    try {
      setLoadingState(false);
      const signedContracts = await signers();
      const { signedMarketContract } = signedContracts;

      const ticketPrice = ethers.utils.parseUnits(price, "ether");
      const transaction = await signedMarketContract.buyResaleTicket(nftaddress, resaleId, {
        value: ticketPrice,
      });
      await transaction.wait();
      setLoadingState(true);
      navigate("/tickets");
    } catch (error) {
      console.log(error);
      error.data === undefined
        ? setErr(error.message)
        : setErr(error.data.message);
    }
    setLoadingState(true);
  }

  if (!loadingState) {
    return <h1 className="container text-7xl mx-auto">Loading...</h1>;
  }

  if (!resaleTickets.length) {
    return err ? (
      <p className="container text-danger text-3xl">{err}</p>
    ) : (
      <h1 className="container text-center text-3xl">
        No resale tickets available for the Ticket ID: {tokenId}
      </h1>
    );
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-center mt-8 text-3xl">Resale Listings</h1>
      <div className="flex justify-center items-center mt-8">
        <div className="bg-cream p-3 shadow">
          <h3 className="text-center text-3xl">
            <span className="text-primary font-bold">{event.name}</span> - ID: #{event.eventId}
          </h3>
          <img
            style={{ height: "22vh", overflow: "auto" }}
            src={event.imageUri}
            alt="Event Image"
            className="w-auto h-auto"
          />
        </div>
      </div>
      <div className="text-center mt-10">
        <h2>
          <i className="bi bi-ticket-fill"></i>{" "}
          <span className="font-bold">{ticket.name}</span> - ID: #{ticket.tokenId}
        </h2>
        <h6>{ticket.description}</h6>
      </div>
      {resaleTickets.map((_ticket) => (
        <div
          key={_ticket.resaleId}
          className="flex justify-center items-center mt-8"
        >
          <div className="card shadow border border-dark rounded-l overflow-scroll m-3 pt-3">
            <div className="card-body">
              <div className="flex">
                <div className="flex-1">
                  <h4>Seller Address:</h4>
                  <p>{_ticket.seller}</p>
                </div>
                <div className="flex-1 text-center">
                  <h4 className="text-primary font-bold">
                    Resale Price: £{_ticket.gbpPrice}
                  </h4>
                  <p className="text-secondary">= {_ticket.price} MATIC</p>
                  <button
                    onClick={() => {
                      buyTicket(_ticket.resaleId, _ticket.price);
                    }}
                    className="btn btn-primary"
                  >
                    Buy Ticket
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      {err && <p className="text-danger text-center text-3xl">{err}</p>}
    </div>
  );
}
