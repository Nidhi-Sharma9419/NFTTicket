import React, { useState, useEffect } from 'react';
import './style.css';

export default function TicketForm() {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        limit: '',
        numTickets: '',
        royalty: '',
        resale: ''
    });
    const [submittedData, setSubmittedData] = useState(null);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmittedData(formData);
        setFormData({
            name: '',
            description: '',
            price: 0,
            limit: '',
            numTickets: '',
            royalty: '',
            resale: ''
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
                <label htmlFor="name">Ticket Name</label>
                <input
                    required='true'
                    id="name"
                    type="text"
                    placeholder="Enter ticket name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                />

                <label htmlFor="description">Description</label>
                <input
                    required='true'
                    id="description"
                    type="text"
                    placeholder="Enter description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                />

                <label htmlFor="price">Price</label>
                <input
                    required='true'
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                />

                <label htmlFor="limit">Purchase Limit</label>
                <input
                    required='true'
                    id="limit"
                    type="number"
                    placeholder="Enter purchase limit"
                    name="limit"
                    value={formData.limit}
                    onChange={handleChange}
                />

                <label htmlFor="num-tickets">Number of Tickets</label>
                <input
                    required
                    id="num-tickets"
                    type="number"
                    placeholder="Enter number of tickets"
                    name="numTickets"
                    value={formData.numTickets}
                    onChange={handleChange}
                />

                <label htmlFor="royalty">Royalty Fee</label>
                <input
                    required
                    id="royalty"
                    type="number"
                    placeholder="Enter royalty fee"
                    name="royalty"
                    value={formData.royalty}
                    onChange={handleChange}
                />

                <label htmlFor="resale">Max Resale Price</label>
                <input
                    required
                    id="resale"
                    type="number"
                    placeholder="Enter max resale price"
                    name="resale"
                    value={formData.resale}
                    onChange={handleChange}
                />

                <button className='bg-black' type="submit">Create Ticket</button>
            </form>

            {submittedData && (
                <div>
                    <h2>Submitted Data:</h2>
                    <p>Name: {submittedData.name}</p>
                    <p>Description: {submittedData.description}</p>
                    <p>Price: {submittedData.price}</p>
                    <p>Purchase Limit: {submittedData.limit}</p>
                    <p>Number of Tickets: {submittedData.numTickets}</p>
                    <p>Royalty Fee: {submittedData.royalty}</p>
                    <p>Max Resale Price: {submittedData.resale}</p>
                </div>
            )}
        </div>
    );
}
