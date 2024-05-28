import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HighlightedTripCard from '../../Components/HighlightedTripCard/HighlightedTripCard';
import './Profile.css'

const Profile = () => {
    /*const { user } = useContext(AuthContext);*/
    /*const [topTrips, setTopTrips] = useState([]);
  
    useEffect(() => {
        if (user) {
            fetch(`/api/trips?user_id=${user.id}`)
            .then(response => response.json())
            .then(data => {
              setTrips(data);
              // Sort trips by rating and get the top 3
              const sortedTrips = data.sort((a, b) => b.rating - a.rating).slice(0, 3);
              setTopTrips(sortedTrips);
            })
            .catch(error => console.error('Error fetching trips:', error));
        }
      }, [user]);
  
    if (!user) {
      return <div>Loading...</div>;
    }

  return (
    <div className="profile-page">
        <div className="profile-info">
          <h1>Profil</h1>
          <div className="profile-details">
            <img src={user.profilePicture} alt="Profile" className="profile-pic" />
            <h2>{profile.username}</h2>
            <div className="profile-buttons">
              <button>Uredi profil</button>
              <button>Dodaj put</button>
            </div>
          </div>
          <div className="about-me">
            <h2>O meni</h2>
            <p>{profile.about}</p>
          </div>
        </div>
        <div className="my-trips">
          <h2>Moja putovanja</h2>
          <div className="trips-grid">
            {topTrips.map((trip) => (
                <Link key={trip.id} to={`/putovanja/${trip.id}`}>
                    <HighlightedTripCard trip={trip} />
                </Link>
            ))}
        </div>
        </div>
    </div>
  );*/
}

export default Profile