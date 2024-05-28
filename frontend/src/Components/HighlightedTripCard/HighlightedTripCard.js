import React from 'react';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import './HighlightedTripCard.css';

const HighlightedTripCard = ({ trip }) => {
  return (
    <div className="featured-trip-card">
      <img src={trip.image} alt={trip.title} className="trip-image" />
      <div className="trip-info">
        <h3>{trip.title}</h3>
        <p>{trip.summary.destination}</p>
        <Stack spacing={1}>
            <Rating className="rating" name="half-rating-read" value={trip.rating} precision={0.1} readOnly />
        </Stack>
        <p>{trip.description}</p>
      </div>
    </div>
  );
};

export default HighlightedTripCard;
