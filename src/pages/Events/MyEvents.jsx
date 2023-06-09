import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { signers } from "../../MyComponents/Helpers/Contracts";



export default function MyEvents() {

  const [events, setEvents] = useState([]);
  const [loadingState, setLoadingState] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    try {
      const signedContracts = await signers();
      const { signedMarketContract } = signedContracts;
      console.log(signedMarketContract)
      const data = await signedMarketContract.getMyEvents();
      console.log(data)
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
          let ticketRemaining =
            i.ticketTotal.toNumber() - i.ticketsSold.toNumber();
          let currEvent = {
            eventId: i.eventId.toNumber(),
            name: eventData.name,
            description: eventData.description,
            imageUri: eventData.image,
            location: eventData.location,
            startDate: eventData.eventDate,
            ticketTotal: i.ticketTotal.toNumber(),
            ticketRemaining,
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
    return <h1 className="container display-1">Loading...</h1>;
  }

  if (err) {
    return (
      <div className="container text-center">
        <h1 className="bg-gray-200 p-4 text-3xl font-bold text-gray-800">
          Your Events
        </h1>

        <p className="text-danger display-6">{err}</p>
      </div>
    );
  }

  if (!events.length) {
    return (
      <div className="container text-center">
        <h1 className="bg-gray-200 p-4 text-3xl font-bold text-gray-800">
          Your Events
        </h1>
        <p className="display-6">You have created no events</p>
        <p className="fw-bold">
          <a onClick={() => navigate("/events-create")} className="mr-6">
            Create Event <i className="bi bi-arrow-right-circle-fill"></i>
          </a>
        </p>
      </div>
    );
  }

  return (

    <div className="container justify-content-center text-center align-items-center">
      <h1 className="m-4 bg-gray-200 border-2 rounded-full p-4 text-3xl font-bold text-gray-800">Your Events</h1>
      <div className="row justify-content-center align-items-center">
        
        {events.map((event) => (
          <div key={event.eventId} className="col-7 col-md-5 col-lg-4 ">
            <div className="card border border-secondary shadow rounded-l overflow-scroll m-3 w-100">
              <div className="card-header mb-2">
                <a onClick={() => navigate(`/events-myevents/${event.eventId}`)}>
                  View Event Details <i className="bi bi-eye-fill"></i>
                </a>
              </div>
              <img src={event.imageUri} />
              <div className="card-body">
                <div style={{ height: "60px", overflow: "auto" }}>
                  <h5 className="card-title text-center">
                    <span className="fw-bold text-primary">{event.name}</span> -
                    ID: #{event.eventId}
                  </h5>
                </div>
                <div style={{ height: "65px", overflow: "auto" }}>
                  <p className="">{event.description}</p>
                </div>
                <div style={{ height: "40px", overflow: "auto" }}>
                  <p className="">
                    <i className="bi bi-calendar3"></i> {event.startDate}
                  </p>
                </div>
                <div style={{ height: "40", overflow: "auto" }}>
                  <p className="">
                    <i className="bi bi-geo-alt-fill"></i> {event.location}
                  </p>
                </div>
                <button onClick={() => navigate(`/events-validate/${event.eventId}`)} >
                  Validate Event's Tickets{" "}
                  <i className="bi bi-arrow-right-circle-fill"></i>
                </button>
              </div>
              <div className="card-footer bg-primary">
                <p className="small text-light fw-bold">
                  Tickets Supplied: {event.ticketTotal}
                </p>
                {event.ticketRemaining > 0 ? (
                  <p className="small text-cream fw-bold">
                    Tickets Remaining: {event.ticketRemaining}
                  </p>
                ) : (
                  <p className="small text-light fw-bold">
                    Tickets Remaining: {event.ticketRemaining}
                  </p>
                )}
                <button

                  className="btn fw-bold text-primary bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => {
                    navigate(`/tickets-create/${event.eventId}`);
                  }}
                >
                  Create Tickets
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        className="btn btn-lg btn-primary bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
        onClick={() => {
          navigate("/events-create");
        }}
      >
        Create Event
      </button>
    </div>
  );
}
