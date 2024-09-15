import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import RestaurantList from './components/RestaurantList';
import RestaurantDetail from './components/RestaurantDetail';
import LocationSearch from './components/LocationSearch';
import ImageUpload from './components/ImageUpload';
import Home from './components/Home'; 
import './style/App.css';

const App = () => {
    return (
        <Router>
                <Routes>
                    <Route path="/" element={<Home />} />  {}
                    <Route path="/restaurant-list" element={<RestaurantList />} />
                    <Route path="/restaurant/:id" element={<RestaurantDetail />} />
                    <Route path="/search-location" element={<LocationSearch />} />
                    <Route path="/upload-image" element={<ImageUpload />} />
                </Routes>
        </Router>
    );
};

export default App;
