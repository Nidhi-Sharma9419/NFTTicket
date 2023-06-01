import React from 'react'
import './infoSection.css';
import InfoItem from './InfoItem';
import { INFO_ITEMS } from '../../data/infoItems';
const InfoSection = () => {
  return (
    <div className='info-section'>
      <div className='is-heading absolute-center'>
        <span className='heading-gradient'>Create Events and Sell you NFT Tickets</span>
      </div>
      <div className='is-items-container'>
        {INFO_ITEMS.map((_infoItem)=>(
          <InfoItem item={_infoItem}/>
        ))}
      </div>
    </div>
  )
}

export default InfoSection;