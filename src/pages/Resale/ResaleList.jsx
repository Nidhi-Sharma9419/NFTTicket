import { useLocation, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import axios from "axios";

import PoundPrice from "../../MyComponents/Helpers/Price/Pound";

import { signers, tokenContract } from "../../MyComponents/Helpers/Contracts";

export default function ResaleList() {
  const [err, setErr] = useState("");
  const [resaleTickets, setResaleTickets] = useState([]);
  const [loadingState, setLoadingState] = useState(false);

  useEffect(() => {
    loadListings();
  }, []);

  async function loadListings() {
    try {
      const signedContracts = await signers();
      const { signedMarketContract } = signedContracts;
      const data = await signedMarketContract.getMyResaleListings();

      const allListings = await Promise.all(
        data.map(async (i) => {
          let tokenId = i.tokenId.toNumber();
          const ticketUri = await tokenContract.uri(tokenId);
          const ticketRequest = await axios.get(ticketUri);
          const ticketData = ticketRequest.data;

          let eventId = ticketData.properties.eventId;
          const currEvent = await signedMarketContract.getEvent(eventId);
          const eventUri = currEvent.uri;
          const eventRequest = await axios.get(eventUri);
          const eventData = eventRequest.data;
          let price = ethers.utils.formatUnits(
            i.resalePrice.toString(),
            "ether"
          );
          let gbpPrice = await PoundPrice(price);
          let currListing = {
            resaleId: i.resaleId.toNumber(),
            eventId,
            eventName: eventData.name,
            imageUri: eventData.image,
            location: eventData.location,
            startDate: eventData.eventDate,
            ticketName: ticketData.name,
            tokenId,
            price,
            gbpPrice,
          };
          return currListing;
        })
      );
      setResaleTickets(allListings);
      setLoadingState(true);
    } catch (error) {
      setLoadingState(true);
      console.log(error);
      error.data === undefined
        ? setErr(error.message)
        : setErr(error.data.message);
    }
  }

  const location = useLocation();
  const navigate = useNavigate();
  function pathMatchRoute(route) {
    if (route === location.pathname) {
      return true;
    }
  }

  if (!loadingState) {
    return <h1 className="container text-7xl mx-auto">Loading...</h1>;
  }
  if (err) {
    return <p className="container text-danger text-4xl mx-auto">{err}</p>;
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-center text-4xl mt-8">Your Resale Listings</h1>
      {resaleTickets.length < 1 ? (
        <>
          <p className="text-center text-2xl mt-8">
            You have not listed any tickets for resale
          </p>
          <p className="text-center font-bold mt-4">
              <a  onClick={() => navigate("/tickets")} className="text-blue-500">
                My Tickets <i className="bi bi-arrow-right-circle-fill"></i>
              </a>
          </p>
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {resaleTickets.map((ticket) => (
            <div
              key={ticket.resaleId}
              className="bg-white shadow border border-gray-300 rounded-lg"
            >
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <img src={ticket.imageUri} className="w-24 h-24 object-cover mx-auto" />
                  </div>
                  <div className="flex-1 ml-4">
                    <h3 className="text-xl font-bold text-primary">
                      {ticket.eventName}
                    </h3>
                    <p className="text-sm text-gray-500">ID: {ticket.eventId}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <h5 className="text-sm text-gray-600">
                    <i className="bi bi-calendar3"></i> {ticket.startDate}
                  </h5>
                  <h5 className="text-sm text-gray-600">
                    <i className="bi bi-geo-alt-fill"></i> {ticket.location}
                  </h5>
                </div>
              </div>
              <div className="px-4 py-3 border-t border-gray-300">
                <h4 className="text-base font-bold">
                  <i className="bi bi-ticket-fill"></i> {ticket.ticketName}
                </h4>
                <h5 className="text-sm mt-1">ID: #{ticket.tokenId}</h5>
                <div className="mt-4">
                  <h5 className="text-primary font-bold">
                    Resale Price: £{ticket.gbpPrice}
                  </h5>
                  <p className="text-sm text-gray-500">= {ticket.price} MATIC</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
