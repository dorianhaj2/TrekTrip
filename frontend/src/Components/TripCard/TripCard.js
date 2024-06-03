import React from 'react';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import './TripCard.css';

function TripCard({ trip }) {

    const calculateAverageRating = (ratings) => {
        if (!ratings.length) return 0;
        const total = ratings.reduce((sum, rating) => sum + rating.rating, 0);
        return total / ratings.length;
      };
    
      const averageRating = calculateAverageRating(trip.ratings);

  return (
        <div className="card">
            <img src={trip.image} alt={trip.title} className="card-image" />
            <div className="card-content">
                <h2 className="card-title">{trip.title}</h2>
                <Stack spacing={1}>
                    <Rating className="rating" name="half-rating-read" value={averageRating} precision={0.1} readOnly />
                </Stack>
                <p className="card-description">{trip.description}</p>
            </div>
        </div>
  );
}

export default TripCard;
