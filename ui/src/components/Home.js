import React from 'react';
import { Link } from 'react-router-dom';
import '../style/App.css';

const Home = () => {
    return (
        <div className="home">
            <h1>
            <span style={{ color: '#fd253d', fontStyle: 'italic' }}>zomato</span>DB
            </h1>
            <p>
            Zomato Restaurant Listing & Searching
            </p>
            <div className="home-links">
                <Link to="/restaurant-list">Go to Restaurant List</Link>
                <Link to="/search-location">Search by Location</Link>
                <Link to="/upload-image">Upload an Image</Link>
            </div>
        </div>
    );
};

export default Home;
