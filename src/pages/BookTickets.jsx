import React from 'react';
import { Link } from 'react-router-dom';

export default function BookTickets() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl mb-4">Your Tickets</h1>
      <h2 className="text-lg text-gray-600 mb-8">Right Now! You don't have any tickets</h2>
      <Link to="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        NFTix
      </Link>
    </div>
  );
}
