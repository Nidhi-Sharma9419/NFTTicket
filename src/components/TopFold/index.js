import React from 'react';
import Button from "../../common/Button";

import './topFold.css';
const TopFold = () => {
  return (
    <div className="topFold absolute-center">
      <div className="tf-left">
        <div className='tf-heading'>
          Discover collect, & sell <span className='heading-gradient'> Extraordinary</span> NFTs 
        </div>
        <div className='tf-description'>Coolect you NFT Ticket and attend event , resell them.Make sure you buy the NFT Tickets you want. 
        </div>
        <div className='tf-left-btns'>
          <Button btnType='PRIMARY' btnText="EXPLORE"/>
          <Button btnType='SECONDARY' btnText="Create" customClass='tf-left-secondary-btn'/>
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
        <div className='tf-right'>
          <div className='tf-right-diamond'>
            <div className='yf-r-diamond-item'>
              <img className='tf-r-diamond-img' alt="diamond-banner" src='https://i.seadn.io/gcs/files/df4f6e53f79c13c6ca6fc54381c455b5.png?auto=format&dpr=1&w=512'/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopFold;