import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="nba-navbar">
      <div className="nav-logo">
        <span>🏀</span> NBA :)
      </div>
      <div className="nav-links">
        <Link to="/" className="nav-item">EQUIPOS</Link>
        <Link to="/favoritos" className="nav-item">MIS FAVORITOS</Link>
      </div>
    </nav>
  );
};

export default Navbar;