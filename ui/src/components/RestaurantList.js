import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style/App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { motion, AnimatePresence } from 'framer-motion';

const RestaurantList = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [country, setCountry] = useState('');
    const [avgCost, setAvgCost] = useState('');
    const [cuisines, setCuisines] = useState('');
    const [name, setName] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [openDropdown, setOpenDropdown] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchRestaurants();
    }, [country, avgCost, cuisines, name, currentPage]);

    const fetchRestaurants = () => {
        axios.get('http://127.0.0.1:5000/restaurants', {
            params: {
                page: currentPage,
                per_page: 20,
                country: country,
                avg_cost: avgCost,
                cuisines: cuisines,
                name: name
            }
        })
        .then(response => {
            setRestaurants(response.data.restaurants);
            setTotalPages(response.data.totalPages);
        })
        .catch(error => console.error('Error fetching data:', error));
    };

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const toggleDropdown = (id) => {
        setOpenDropdown(openDropdown === id ? null : id);
    };

    return (
        <div className="restaurant-list">
            <button onClick={() => navigate('/')}>
                Back
            </button>
            <h1>Restaurant List</h1>
            <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="country">Country:</label>
                <input
                    type="text"
                    id="country"
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="avgCost">Max Average Cost for Two:</label>
                <input
                    type="number"
                    id="avgCost"
                    value={avgCost}
                    onChange={e => setAvgCost(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="cuisines">Cuisines:</label>
                <input
                    type="text"
                    id="cuisines"
                    value={cuisines}
                    onChange={e => setCuisines(e.target.value)}
                />
            </div>

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
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    &lt;
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    &gt;
                </button>
            </div>
        </div>
    );
};

export default RestaurantList;
