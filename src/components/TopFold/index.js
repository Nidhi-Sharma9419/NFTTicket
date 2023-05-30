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
        <div className='tf-description'>Coolect you NFT Ticket and attend event , resell them.Make sure you buy the NFT Tickets you want. </div>
        <div className='tf-left-btns'>
          <Button btnType='PRIMARY' btnText="EXPLORE"/>
          <Button btnType='SECONDARY' btnText="Create" customClass='tf-left-secondary-btn'/>
             <div className='tf-is-infoItem'>
              <div className='tf-infoItem-count'>200K+</div>   
              <div className='tf-infoItem-count'>200K+</div>
             </div>
        </div>
      </div>
      <div className='tf-right'></div>
    </div>
  )
}

export default TopFold;