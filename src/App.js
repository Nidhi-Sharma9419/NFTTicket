import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from 'react'
import './App.css';
//import Header from './components/Header';
import Header from './MyComponents/header';

import Home from "./pages/Home"
import Events from "./pages/Events"
import BookTickets from "./pages/BookTickets";
import Resale from "./pages/Resale";


const App = () => {
  return (
   
    <div className='max-width'>
      
      <Router>
      <Header/>
     
   
      <Routes>
        
      <Route path="/" element={<Home />}></Route>
          <Route path="/events" element={<Events />}></Route>
          <Route path="/book-tickets" element={<BookTickets />}></Route>
          <Route path="/resale-tickets" element={<Resale />}></Route>
        
      </Routes>
    </Router>
    </div>
  )
}

export default App