import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import tripsData from '../Trips/tripsData';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import './Trip.css';

const Trip = () => {
    /*const { id } = useParams(); // Get the trip ID from URL parameters
    const [trip, setTrip] = useState(null); // State to hold trip data

    useEffect(() => {
        // Fetch the trip data based on the ID
        fetch(`/api/trips/${id}`)
            .then(response => response.json())
            .then(data => setTrip(data))
            .catch(error => console.error('Error fetching trip:', error));
    }, [id]); // Trigger useEffect whenever the trip ID changes

    // If trip data is not yet loaded, display loading message
    if (!trip) {
        return <div>Loading...</div>;
    }*/
    /*console.log('Location:', location);
    if (!location.state || !location.state.trip) {
        return <div>Error: Trip data not found</div>;
    }
    const { trip } = location.state;*/

    const { id } = useParams();
    const [trip, setTrip] = useState(null);

    useEffect(() => {
        console.log('Fetching trip data for ID:', id);
        const selectedTrip = tripsData.find(trip => trip.id === parseInt(id));
        console.log('Selected trip:', selectedTrip);
        setTrip(selectedTrip);
    }, [id]);

    console.log('Current trip state:', trip);

    if (!trip) {
        console.log('Trip data is not available yet.');
        return <div>Loading...</div>;
    }

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
                        <p className="author">Autor: {trip.author}</p>
                    </div>
                    <div className='trip-days'>
                        {trip.details.map(detail => (
                            <div key={detail.day} className="trip-detail">
                                <h2>{detail.day}. dan: {detail.title}</h2>
                                <p>{detail.description}</p>
                            </div>
                        ))} 
                    </div>
                </div>
                <div className='trip-details'>
                    <Stack spacing={1}>
                        <Rating className="rating" name="half-rating-read" value={trip.rating} precision={0.1} size='large'/>
                    </Stack>  
                    <div className="trip-summary">
                        <p><strong>Država:</strong></p><span>{trip.summary.country}</span>
                        <p><strong>Odredište:</strong></p><span>{trip.summary.destination}</span>
                        <p><strong>Mjesec:</strong></p><span>{trip.summary.month}</span>
                        <p><strong>Trajanje:</strong></p><span>{trip.summary.duration}</span>
                        <p><strong>Cijena:</strong></p><span>{trip.summary.price}</span>
                    </div>   
                </div>             
            </div>
            <div className="comments-section">
                <h2>Komentari</h2>
                {trip.comments.map((comment, index) => (
                    <div key={index} className="comment">
                        <p><strong>{comment.author}:</strong> {comment.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Trip;
