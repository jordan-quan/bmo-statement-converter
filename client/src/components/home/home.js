import React from 'react';
import './home.css';
import {
  Link
} from "react-router-dom";

const Home = () => {
  return (
    <div className="home-content">
      <p>Select an application to get started:</p>
      <div className="splitters">
        <Link to="/form" className="button" href="">BMO Table</Link>
      </div>
    </div>
  );
}


export default Home;
