import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../style/App.css';
import { motion, AnimatePresence } from 'framer-motion';

const LocationSearch = () => {
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [radius, setRadius] = useState('');
    const [restaurants, setRestaurants] = useState([]);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [openDropdown, setOpenDropdown] = useState(null);

    const navigate = useNavigate();

    const handleSearch = () => {
        setError('');

        axios.get('http://127.0.0.1:5000/search_by_location', {
            params: {
                latitude: latitude,
                longitude: longitude,
                radius: radius,
                page: page,
                per_page: 20
            }
        })
        .then(response => {
            setRestaurants(response.data.restaurants);
            setTotalPages(response.data.totalPages);
        })
        .catch(error => setError('Error fetching data: ' + error.message));
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
            handleSearch();
        }
    };

    const toggleDropdown = (id) => {
        setOpenDropdown(openDropdown === id ? null : id);
    };

    return (
        <div className="location-search">
            <button onClick={() => navigate('/')}>
                Back
            </button>
            <h2>Search Restaurants by Location</h2>
            <div className="form-group">
                <label htmlFor="latitude">Latitude:</label>
                <input
                    type="text"
                    id="latitude"
                    value={latitude}
                    onChange={e => setLatitude(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="longitude">Longitude:</label>
                <input
                    type="text"
                    id="longitude"
                    value={longitude}
                    onChange={e => setLongitude(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="radius">Radius (km):</label>
                <input
                    type="text"
                    id="radius"
                    value={radius}
                    onChange={e => setRadius(e.target.value)}
                />
            </div>
            <button onClick={handleSearch}>Search</button>
            {error && <p className="error">{error}</p>}
            {restaurants.length > 0 && (
                <>
                    <ul>
                        {restaurants.map(restaurant => (
                            <motion.li 
                                key={restaurant.Restaurant_ID} 
                                className="restaurant-card"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div
                                    className="restaurant-card-header"
                                    onClick={() => toggleDropdown(restaurant.Restaurant_ID)}
                                >
                                    <Link to={`/restaurant/${restaurant.Restaurant_ID}`}>
                                        {restaurant.Restaurant_Name}, {restaurant.City}
                                    </Link>
                                    <i className={`fas fa-chevron-down ${openDropdown === restaurant.Restaurant_ID ? 'open' : ''}`}></i>
                                </div>
                                <AnimatePresence>
                                    {openDropdown === restaurant.Restaurant_ID && (
                                        <motion.div 
                                            className="restaurant-card-dropdown"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <p><strong>Name:</strong> {restaurant.Restaurant_Name}</p>
                                            <p><strong>Address:</strong> {restaurant.Address}</p>
                                            <p><strong>Rating:</strong> {restaurant.Aggregate_Rating} ({restaurant.Votes} ratings)</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.li>
                        ))}
                    </ul>
                    <div className="pagination">
                        <button 
                            onClick={() => handlePageChange(page - 1)} 
                            disabled={page === 1}
                        >
                            &lt;
                        </button>
                        <span>Page {page} of {totalPages}</span>
                        <button 
                            onClick={() => handlePageChange(page + 1)} 
                            disabled={page === totalPages}
                        >
                            &gt;
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default LocationSearch;
