import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HighlightedTripCard from '../../Components/HighlightedTripCard/HighlightedTripCard';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../axios/axiosInstance';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [id, setId] = useState(null);
  const [activeUser, setActiveUser] = useState(null);
  const [loading, setLoading] = useState(true); // State to track loading status
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [userRole, setUserRole] = useState(null);
  const [topTrips, setTopTrips] = useState([]);

  const calculateAverageRating = (ratings) => {
    if (!ratings.length) return 0;
    const total = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    return total / ratings.length;
};

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/prijava');
    }
  }, [isLoggedIn, navigate]);

  const fetchData = async () => {
    try {
      const username = localStorage.getItem('username');
      
      const response = await axiosInstance.get(`/user/all`);
      
      const users = response.data;
      const activeUser = users.find(user => user.username === username);

      if (activeUser) {
        setActiveUser(activeUser);
        //console.log(activeUser)
        setId(activeUser.id); 
        localStorage.setItem('userId', activeUser.id);

        const userResponse = await axiosInstance.get(`/user/${activeUser.id}`); 

        setUser(userResponse.data);
        setLoading(false); 

        const tripsResponse = await axiosInstance.get(`/trip/all`);

        const userTrips = tripsResponse.data.filter(trip => trip.user.username === activeUser.username);

        const userTripsWithAverage = userTrips.map(trip => {
        const averageRating = calculateAverageRating(trip.ratings);
        return { ...trip, averageRating };
      });

      const sortedTrips = userTripsWithAverage.sort((a, b) => b.averageRating - a.averageRating).slice(0, 3);
      setTopTrips(sortedTrips);
      } else {
        console.error('Logged-in user not found');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setLoading(false); 
    }

    if(activeUser){
      try {
        const response = await axiosInstance.get(`/userRole/${activeUser.id}`);
        if (response.data) {
          setUserRole(response.data);
          //console.log(response.data)
        } else {
          setUserRole(null);
        }
      } catch (error) {
       
        console.error('Error fetching user role:', error);
      }
    }
  };

  useEffect(() => {
    fetchData(); 
  }, [activeUser]); 

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : user ? (
        <div className="profile-page">
          <div className="profile-info">
            <div className="profile-details">
              <h1>{user.username}</h1>
              {/* Assuming user.profilePicture is the URL of the user's profile picture */}
              <div className='profile-photo'>
                <img
                  src={user.profilePicture ? user.profilePicture : 'https://static.vecteezy.com/system/resources/previews/036/280/651/non_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg'}
                  alt="Profile"
                  className="profile-pic"
                />
              </div>
              <div className="profile-buttons">
                <Link to='/uredi-profil'>
                  <button>Uredi profil</button>
                </Link>
                <Link to='/dodaj-put'>
                  <button>Dodaj put</button>
                </Link>
              </div>
            </div>
            <div className="about-me">
              <h2>O meni</h2>
              <p>{user.description}</p>
            </div>
          </div>
          <div className="my-trips">
            <h2>Moja putovanja</h2>
            <div className="trip-cards">
              {topTrips.map((trip) => (
                <Link key={trip.id} to={`/putovanja/${trip.id}`}>
                  <HighlightedTripCard trip={trip} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p>No user data available</p>
      )}
      <div>
      {userRole ? (
        <div>
          <p>Role ID: {userRole.id}</p>
          <p>Role Name: {userRole.name}</p>
        </div>
      ) : (
        <p>No user role found for ID {id}</p>
      )}
    </div>
    </div>
  );
};

export default Profile;
