import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { Link } from 'react-router-dom';
import HighlightedTripCard from '../../Components/HighlightedTripCard/HighlightedTripCard';
import tripsData from '../Trips/tripsData';
import './Home.css';

const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-continents.json";

const Home = () => {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    // Fetch trips from the API or static file
    fetch('/api/trips')
      .then(response => response.json())
      .then(data => {
        // Sort trips by rating and get the top 3
        const topTrips = data.sort((a, b) => b.rating - a.rating).slice(0, 3);
        setTrips(topTrips);
      });
  }, []);

  const handleContinentClick = (continent) => {
    // Handle continent click, you can navigate to a different view or filter trips
    console.log(`Continent clicked: ${continent}`);
  };

  const [topTrips, setTopTrips] = useState([]);

  useEffect(() => {
    // Sort trips by rating and get the top 3
    const sortedTrips = tripsData.sort((a, b) => b.rating - a.rating).slice(0, 3);
    setTopTrips(sortedTrips);
  }, []);

  return (
    <div className="homepage">
      <header className="homepage-header">
        <h1>Pronađite svoju sljedeću pustolovinu</h1>
        <p>Vaš pouzdani kompas kroz labirint putovanja, osvjetljavajući skrivene dragulje i stvarajući avanture po narudžbi s preciznošću i strašću</p>
        <ComposableMap>
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
