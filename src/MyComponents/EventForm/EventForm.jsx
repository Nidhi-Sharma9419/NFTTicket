import React, { useState, useEffect } from 'react';
import './style.css';

export default function EventForm() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    address: '',
    code: '',
    image: null
  });
  const [submittedData, setSubmittedData] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleImageChange = (event) => {
    const imageFile = event.target.files[0];
    setFormData((prevFormData) => ({
      ...prevFormData,
      image: imageFile
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmittedData(formData);
    setFormData({
      name: '',
      description: '',
      date: '',
      address: '',
      code: '',
      image: null
    });
  };

  useEffect(() => {
    if (submittedData) {
      console.log(submittedData);
    }
  }, [submittedData]);

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Event Name</label>
        <input
          required='true'
          id="name"
          type="text"
          placeholder="Enter event name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />

        <label htmlFor="description">Description</label>
        <input
          required='true' v
          id="description"
          type="text"
          placeholder="Enter description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />

        <label htmlFor="date">Start Date</label>
        <input
          required='true'
          id="date"
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
        />

        <label htmlFor="address">Event Address</label>
        <input
          required='true'
          id="address"
          type="text"
          placeholder="Enter event address"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />

        <label htmlFor="code">Event Postcode</label>
        <input
          required='true'
          id="code"
          type="text"
          placeholder="Enter post code"
          name="code"
          value={formData.code}
          onChange={handleChange}
        />

        <label htmlFor="image">Event Picture</label>
        <input
          required='true'
          id="image"
          type="file"
          name="image"
          onChange={handleImageChange}
        />

        <button className='bg-black' type="submit">Create Event</button>
      </form>

      {submittedData && (
        <div>
          <h2>Submitted Data:</h2>
          <p>Name: {submittedData.name}</p>
          <p>Description: {submittedData.description}</p>
          <p>Date: {submittedData.date}</p>
          <p>Address: {submittedData.address}</p>
          <p>Postcode: {submittedData.code}</p>
          {submittedData.image && (
            <div>
              <h3>Image:</h3>
              <img
                src={URL.createObjectURL(submittedData.image)}
                alt="Submitted Event"
                style={{ maxWidth: '300px' }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
