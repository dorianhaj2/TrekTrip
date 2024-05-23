import React from 'react';
import './TripCard.css';

function TripCard({ trip }) {
  return (
    <div className="card">
      <img src={trip.image} alt={trip.title} className="card-image" />
      <div className="card-content">
        <h2 className="card-title">{trip.title}</h2>
        <p className="card-description">{trip.description}</p>
        <div className="card-rating">{'⭐'.repeat(trip.rating)}</div>
      </div>
    </div>
  );
}

export default TripCard;
