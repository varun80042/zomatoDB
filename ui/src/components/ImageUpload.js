import React, { useState } from 'react';
import axios from 'axios';
import '../style/App.css';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ImageUpload = () => {
    const [file, setFile] = useState(null);
    const [cuisine, setCuisine] = useState('');
    const [error, setError] = useState('');
    const [restaurants, setRestaurants] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const fetchRestaurants = async (page, cuisine) => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/restaurants', {
                params: {
                    cuisines: cuisine,
                    page: page,
                    per_page: 20
                }
            });
            setRestaurants(response.data.restaurants);
            setTotalPages(response.data.totalPages);
        } catch (err) {
            setError('Error fetching restaurants: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!file) {
            setError('Please upload an image.');
            return;
        }

        setIsLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://127.0.0.1:5000/predict', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const predictedCuisine = response.data.cuisine;
            setCuisine(predictedCuisine);
            setPage(1);
            fetchRestaurants(1, predictedCuisine);
        } catch (err) {
            setError('Error predicting cuisine: ' + err.message);
            setCuisine('');
            setRestaurants([]);
            setIsLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
            fetchRestaurants(newPage, cuisine);
        }
    };

    const toggleDropdown = (id) => {
        setOpenDropdown(openDropdown === id ? null : id);
    };

    return (
        <div className="image-upload">
            <button onClick={() => navigate('/')}>
                Back
            </button>
            &nbsp; &nbsp; &nbsp;
            <button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? 'Predicting...' : 'Predict Cuisine'}
            </button>
            <h1>Upload Image</h1>
            <input type="file" accept="image/*" onChange={handleFileChange} />

            {error && <p className="error">{error}</p>}

            {isLoading && <div className="loading">Predicting cuisine... Please wait.</div>}

            {!isLoading && cuisine && (
                <>
                    <p className="result">Predicted Cuisine: {cuisine}</p>
                    {restaurants.length > 0 && (
                        <div className="image-upload-restaurant-list">
                            <h3>Restaurants Offering {cuisine} Cuisine</h3>
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
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ImageUpload;
