import React from 'react';
import Button from "../../common/Button";
import { useLocation, useNavigate } from "react-router-dom";

import './topFold.css';
const TopFold = () => {

  const location = useLocation();
  const navigate = useNavigate();
  function pathMatchRoute(route) {
    if (route === location.pathname) {
      return true;
    }
  }
  return (
    <div className="topFold absolute-center">
      <div className="tf-left">
        <div className='tf-heading'>
          Discover Collect, & Sell <span className='heading-gradient'> Extraordinary</span> NFT Tickets
        </div>
        <div className='tf-description'>Collect you NFT Ticket and attend event , resell them.Make sure you buy the NFT Tickets you want. 
        </div>
        <div className='tf-left-btns'>
          <Button btnType='PRIMARY' btnText="EXPLORE"/>
         {/* <Button onClick={() => navigate("/events-create")} btnType='SECONDARY' btnText="Create" customClass='tf-left-secondary-btn'/> */}
         <button onClick={() => navigate("/events-create")} className="button secondary-btn undefined">
         Create
                </button>
          </div>
            <div className='tf-left-infoStats '>
            <div className='tf-is-infoItem absolute-center'>
              <div className='tf-infoItem-count'>200K+</div>   
              <div className='tf-infoItem-label'>Collections</div>
            </div>
            <div className='tf-is-infoItem absolute-center'>
              <div className='tf-infoItem-count'>10K+</div>   
              <div className='tf-infoItem-label'>Artists</div>
            </div>
            <div className='tf-is-infoItem absolute-center'>
              <div className='tf-infoItem-count'>423K+</div>   
              <div className='tf-infoItem-label'>Community</div>
            </div>
            
          </div>
      </div>
      
        <div className='tf-right'>
          <div className='tf-r-bg-blob'></div>
          <div className='tf-right-diamond'>
            <div className='tf-r-diamond-item absolute-center'>
              <img className='tf-r-diamond-img' alt="diamond-banner" src='https://i.seadn.io/gcs/files/ae46e44311f0b1d455adc82ebc8e0c78.png?auto=format&dpr=1&w=512'/>
            </div>
          </div>
        </div>
      </div>
    
  )
}

export default TopFold;