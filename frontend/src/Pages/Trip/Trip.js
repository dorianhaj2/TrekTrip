import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import axiosInstance from '../../axios/axiosInstance';
import tripService from '../../Services/tripService';
import { useTranslation } from 'react-i18next';
import './Trip.css';

const Trip = () => {
    const {t} = useTranslation();
    const { id } = useParams();
    const [trip, setTrip] = useState(null);
    const [userRating, setUserRating] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasRated, setHasRated] = useState(false); // State to track if user has already rated
    const [activeUserId, setActiveUserId] = useState(null); // State to store current active user's ID


    useEffect(() => {
        const fetchTripData = async () => {
            try {
                console.log('Fetching trip data for ID:', id);
                const response = await tripService.getTripById(id);
                console.log('Received trip data:', response.data);
                setTrip(response.data);

                const username = localStorage.getItem('username');

                if (username) {
                const usersResponse = await axiosInstance.get(`/user/all`);
                const users = usersResponse.data;
                const activeUser = users.find(user => user.username === username);
                if (activeUser) {
                    setActiveUserId(activeUser.id);
                    console.log(activeUser.id)

                    // Check if the user has already rated this trip
                    console.log(activeUserId)
                    const existingRating = response.data.ratings.find(rating => rating.user.id === activeUser.id);
                    if (existingRating) {
                        setUserRating(existingRating.rating);
                        setHasRated(true); // User has already rated
                    }
                }
            }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching trip:', error);
                setError('Error fetching trip data.');
                setLoading(false);
            }
        };

        fetchTripData();
    }, [id]);

    const handleRatingChange = async (event, newValue) => {
        setUserRating(newValue);
        try {
            await axiosInstance.post(`/rating`, { tripId: id, rating: newValue, userId: activeUserId });
            console.log('Rating added/updated successfully');
            // Refetch trip data to get updated ratings
                const response = await tripService.getTripById(id);
            setTrip(response.data);
            setHasRated(true); // Update state to reflect user has rated
        } catch (error) {
            console.error('Error adding/updating rating:', error);
        }
    };

    const calculateAverageRating = (ratings) => {
        if (!ratings.length) return 0;
        const total = ratings.reduce((sum, rating) => sum + rating.rating, 0);
        console.log(total / ratings.length)
        return total / ratings.length;
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

   if (!trip) {
        return <div>Trip data not found</div>;
    }

    const averageRating = calculateAverageRating(trip.ratings);

    return (
        <div className="trip-page">
            {/* Render trip details using the fetched data */}
            <div className="main-image" style={{ backgroundImage: `url(${trip.image})` }}>
                <div className="overlay"></div>
            </div>
            <div className="trip">
                <div className='trip-intro'>
                    <div className='trip-title'>
                        <h1>{trip.title}</h1>
                        <p className="author">{t('trip.author')}: {trip.user.username}</p>
                    </div>
                    
                </div>
                <div className='trip-details'>
                    <Stack spacing={1}>
                        <Rating
                            className="rating"
                            name="half-rating"
                            value={averageRating}
                            precision={0.1}
                            size='large'
                            onChange={handleRatingChange}
                            readOnly={!activeUserId || hasRated} // Disable rating if user is not logged in or has already rated
                        />
                        <p>Average Rating: {averageRating.toFixed(1)}</p>
                    </Stack> 
                    <div className="trip-summary">
                        <p><strong>{t('trip.country')}:</strong></p><span>{trip.locations.length > 0 ? trip.locations[0].country.name : 'Unknown Country'}</span>
                        <p><strong>{t('trip.destination')}:</strong></p><span>{trip.locations.map(location => location.destination).join(', ')}</span>
                        <p><strong>{t('trip.month')}:</strong></p><span>{trip.tripMonth}</span>
                        <p><strong>{t('trip.duration')}:</strong></p><span>{trip.lengthInDays} dana</span>
                        <p><strong>{t('trip.price')}:</strong></p><span>{trip.price} €</span>
                    </div>   
                </div>             
            </div>
            <div className="comments-section">
                <h2>{t('trip.comments')}</h2>
            </div>
        </div>
    );
}

export default Trip;
