import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

import { marketContract } from "../../MyComponents/Helpers/Contracts";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [err, setErr] = useState("");
  const [loadingState, setLoadingState] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    try {
      const data = await marketContract.getAllEvents();
      const allEvents = await Promise.all(
        data.map(async (i) => {
          const eventUri = await i.uri;
          if (!eventUri) {
            throw new Error(
              `Event URI does not exist for Event Id ${i.eventId.toNumber()}`
            );
          }
          const eventRequest = await axios.get(eventUri);
          const eventData = eventRequest.data;
          const soldOut =
            i.ticketTotal.toNumber() - i.ticketsSold.toNumber() == 0;
          let currEvent = {
            eventId: i.eventId.toNumber(),
            name: eventData.name,
            description: eventData.description,
            imageUri: eventData.image,
            location: eventData.location,
            startDate: eventData.eventDate,
            soldOut,
            owner: i.owner,
          };
          return currEvent;
        })
      );
      setEvents(allEvents);
      setLoadingState(true);
    } catch (error) {
      console.log(error);
      error.data === undefined
        ? setErr(error.message)
        : setErr(error.data.message);
      setLoadingState(true);
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
    return (
      <div className="container">
        <p className="display-1">Loading...</p>
      </div>
    );
  }

  if (err) {
    return (
      <div className="container text-center">
        <h1>All Events</h1>
        <p className="text-danger display-6">{err}</p>
      </div>
    );
  }

  if (loadingState && !events.length) {
    return (
      <div className="container">
        <p className="display-4">No Events In the Marketplace</p>
      </div>
    );
  }

  return (
    <div className="container justify-content-center text-center align-items-center">
   <h1 class="py-2 p-4 text-4xl font-bold " >
   <span className='heading-gradient'> All Events</span>
</h1>


      <div className="row justify-content-center align-items-center" >
        {events.map((event) => (
          <div key={event.eventId} className="col-7 col-md-5 col-lg-3 my-10 ">
            <div className="card border border-secondary shadow rounded-l overflow-hidden m-3 pt-3 w-100">
              <img src={event.imageUri} style={{transform: "translate(0px,-25px)"}}/>
              <div className="card-body">
                <div style={{ height: "60px", overflow: "auto" }}>
                  <h5 className="card-title text-center">
                    <span className="fw-bold text-primary">{event.name}</span> -
                    ID: #{event.eventId}
                  </h5>
                </div>
                <div style={{ height: "64px", overflow: "auto" }}>
                  <p>{event.description}</p>
                </div>
                <div style={{ height: "40px", overflow: "auto" }}>
                  <p>
                    <i className="bi bi-calendar3"></i> {event.startDate}
                  </p>
                </div>
                <div style={{ height: "40", overflow: "auto" }}>
                  <p>
                    <i className="bi bi-geo-alt-fill"></i> {event.location}
                  </p>
                </div>
              </div>
              {!event.soldOut ? (
                <button
                  onClick={() => {
                    navigate(`/events/${event.eventId}`);
                  }}
                  className="card-footer bg-primary btn btn-primary "
                >
                  Book Now
                </button>
              ) : (
                <button className="card-footer btn btn-secondary " disabled>
                  Sold Out
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
