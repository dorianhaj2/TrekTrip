import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { Link } from 'react-router-dom';
import HighlightedTripCard from '../../Components/HighlightedTripCard/HighlightedTripCard';
import axiosInstance from '../../axios/axiosInstance';
import './Home.css';

const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-continents.json";

const Home = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topTrips, setTopTrips] = useState([]);

  useEffect(() => {
      const fetchTrips = async () => {
          try {
              const response = await axiosInstance.get(`/trip/all`);
              setTrips(response.data); 
              setLoading(false);
              console.log(response.data)
          } catch (error) {
              console.error('Error fetching trips:', error);
              setError(error.message);
              setLoading(false);
          }
      };

      fetchTrips();

  }, [trips]);

  useEffect(() => {
    const calculateAverageRating = (ratings) => {
      if (!ratings.length) return 0;
      const total = ratings.reduce((sum, rating) => sum + rating.rating, 0);
      return total / ratings.length;
    };

    const tripsWithAverageRating = trips.map(trip => {
      const averageRating = calculateAverageRating(trip.ratings);
      return { ...trip, averageRating };
    });

    const sortedTrips = tripsWithAverageRating.sort((a, b) => b.averageRating - a.averageRating);
    
    const topThreeTrips = sortedTrips.slice(0, 3);

    setTopTrips(topThreeTrips);
  }, [trips]);

  if (loading) {
      return <div>Loading...</div>;
  }

  if (error) {
      return <div>Error: {error}</div>;
  }

  const handleContinentClick = (continent) => {
    // Handle continent click, you can navigate to a different view or filter trips
    console.log(`Continent clicked: ${continent}`);
  };

  return (
    <div className="homepage">
      <header className="homepage-header">
        <h1>Pronađite svoju sljedeću pustolovinu</h1>
        <p>Vaš pouzdani kompas kroz labirint putovanja, osvjetljavajući skrivene dragulje i stvarajući avanture po narudžbi s preciznošću i strašću</p>
        <ComposableMap
          width={800}
          height={300}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map(geo => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => handleContinentClick(geo.properties.continent)}
                  style={{
                    default: { fill: "#D6D6DA" },
                    hover: { fill: "#F53" },
                    pressed: { fill: "#E42" }
                  }}
                />
              ))
            }
          </Geographies>
        </ComposableMap>
      </header>
      <section className="featured-trips">
        <h2>Istaknuta putovanja</h2>
        <div className="trip-cards">
            {topTrips.map((trip) => (
                <Link key={trip.id} to={`/putovanja/${trip.id}`}>
                    <HighlightedTripCard trip={trip} className="trip-card"/>
                </Link>
            ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
