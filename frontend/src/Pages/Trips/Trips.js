import React from 'react';
import TripCard from '../../Components/TripCard/TripCard';
import { Link } from 'react-router-dom';
import tripsData from './tripsData';
import './Trips.css'

const Trips = () => {
    
  return (
    <div className="App">
        <div className="filters">
            <button>Trajanje</button>
            <button>Ocjena</button>
            <button>Cijena</button>
        </div>
        <div className="destinations">
            {tripsData.map((trip) => (
                <Link key={trip.id} to={`/putovanja/${trip.id}`}>
                    <TripCard trip={trip} />
                </Link>
            ))}
        </div>
    </div>
  )
}

export default Trips