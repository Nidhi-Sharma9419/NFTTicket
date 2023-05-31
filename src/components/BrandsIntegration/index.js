import React from 'react'
import './brandsIntegration.css';

const BrandsIntegration = () => {
  return (
    <div className='brands-integration absolute-center'>
      <img src={require('../../assets/metamask-logo.png')} className='bi-logos' alt='brand-logos'/>
    </div>
  )
}

export default BrandsIntegration;