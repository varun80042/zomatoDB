import React, { useEffect, useState} from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../style/App.css';

const RestaurantDetail = () => {
    const { id } = useParams(); 
    const [restaurant, setRestaurant] = useState(null);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://127.0.0.1:5000/restaurant/${id}`)
            .then(response => setRestaurant(response.data))
            .catch(error => setError('Error fetching data: ' + error.message));
    }, [id]);

    if (error) {
        return <p className="error">{error}</p>;
    }

    if (!restaurant) {
        return <p>Loading...</p>;
    }

    return (
        <div className="restaurant-detail">
            <button onClick={() => navigate(-1)}>
                Back
            </button>
            <h1>{restaurant.Restaurant_Name}</h1>
            <p><strong>Address:</strong> {restaurant.Address}</p>
            <p><strong>City:</strong> {restaurant.City}</p>
            <p><strong>Country:</strong> {restaurant.Country_Name}</p>
            <p><strong>Cuisines:</strong> {restaurant.Cuisines}</p>
            <p><strong>Average Cost for Two:</strong> {restaurant.Avg_Cost_for_Two}</p>
            <p><strong>Currency:</strong> {restaurant.Currency}</p>
            <p><strong>Has Table Booking:</strong> {restaurant.Has_Table_Booking ? 'Yes' : 'No'}</p>
            <p><strong>Has Online Delivery:</strong> {restaurant.Has_Online_Delivery ? 'Yes' : 'No'}</p>
            <p><strong>Is Delivering Now:</strong> {restaurant.Is_Delivering_Now ? 'Yes' : 'No'}</p>
            <p><strong>Switch to Order Menu:</strong> {restaurant.Switch_to_Order_Menu ? 'Yes' : 'No'}</p>
            <p><strong>Price Range:</strong> {restaurant.Price_Range}</p>
            <p><strong>Aggregate Rating:</strong> {restaurant.Aggregate_Rating}</p>
            <p><strong>Rating Color:</strong> {restaurant.Rating_Color}</p>
            <p><strong>Rating Text:</strong> {restaurant.Rating_Text}</p>
            <p><strong>Votes:</strong> {restaurant.Votes}</p>
            <p><strong>Latitude:</strong> {restaurant.Latitude}</p>
            <p><strong>Longitude:</strong> {restaurant.Longitude}</p>
        </div>
    );
};

export default RestaurantDetail;
