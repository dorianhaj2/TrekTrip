import React, { useState, useEffect } from 'react';
import TripCard from '../../Components/TripCard/TripCard';
import { Link } from 'react-router-dom';
import tripService from '../../Services/tripService';
import countryService from '../../Services/countryService';
import { MenuItem, Select, FormControl, InputLabel, Button } from '@mui/material';
import './Trips.css';

const Trips = () => {
    const [trips, setTrips] = useState([]);
    const [originalTrips, setOriginalTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortCriteria, setSortCriteria] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');
    const [countries, setCountries] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('');
    const months = ['Siječanj', 'Veljača', 'Ožujak', 'Travanj', 'Svibanj', 'Lipanj', 'Srpanj', 'Kolovoz', 'Rujan', 'Listopad', 'Studeni', 'Prosinac'];
    const [filtersApplied, setFiltersApplied] = useState(false);

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const response = await tripService.getAllTrips();
                setTrips(response.data);
                setOriginalTrips(response.data);
                setLoading(false);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching trips:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchTrips();

        const fetchCountries = async () => {
            try {
                const response = await countryService.getAllCountries();
                const sortedCountries = response.data.sort((a, b) => a.name.localeCompare(b.name)); // Sort countries alphabetically
                setCountries(sortedCountries);
            } catch (error) {
                console.error('Error fetching countries:', error);
            }
        };

        fetchCountries();
    }, []);

    const sortTrips = (trips, criteria) => {
        const sortedTrips = [...trips];
        switch (criteria) {
            case 'highestRated':
                return sortedTrips.sort((a, b) => calculateAverageRating(b.ratings) - calculateAverageRating(a.ratings));
            case 'longest':
                return sortedTrips.sort((a, b) => b.lengthInDays - a.lengthInDays);
            case 'shortest':
                return sortedTrips.sort((a, b) => a.lengthInDays - b.lengthInDays);
            case 'mostExpensive':
                return sortedTrips.sort((a, b) => b.price - a.price);
            case 'leastExpensive':
                return sortedTrips.sort((a, b) => a.price - b.price);
            default:
                return sortedTrips;
        }
    };

    const calculateAverageRating = (ratings) => {
        if (!ratings.length) return 0;
        const total = ratings.reduce((sum, rating) => sum + rating.rating, 0);
        return total / ratings.length;
    };

    const handleSortChange = (event) => {
        const criteria = event.target.value;
        setSortCriteria(criteria);
        setFiltersApplied(true);
    };

    const handleCountryChange = (event) => {
        const country = event.target.value;
        setSelectedCountry(country);
        setFiltersApplied(true);
    };

    const handleMonthChange = (event) => {
        const month = event.target.value;
        setSelectedMonth(month);
        setFiltersApplied(true);
    };
  
    const handleClearFilters = () => {
        setTrips(originalTrips);
        setSortCriteria('');
        setSelectedCountry('');
        setSelectedMonth('');
        setFiltersApplied(false);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    let displayedTrips = filtersApplied 
    ? sortTrips(
        trips.filter(trip => 
            (!selectedCountry || trip.locations[0].country.name === selectedCountry) && 
            (!selectedMonth || trip.tripMonth === selectedMonth)
        ), 
        sortCriteria
    ) 
    : trips;

    return (
        <div className="trips">
            <div className="filters">
                <FormControl variant="outlined" className="dropdown">
                    <InputLabel>Sortiraj</InputLabel>
                    <Select
                        value={sortCriteria}
                        onChange={handleSortChange}
                        label="Sort"
                    >
                        <MenuItem value="highestRated">Najbolje ocijenjeni</MenuItem>
                        <MenuItem value="longest">Najduži</MenuItem>
                        <MenuItem value="shortest">Najkraći</MenuItem>
                        <MenuItem value="mostExpensive">Najskuplji</MenuItem>
                        <MenuItem value="leastExpensive">Najjeftiniji</MenuItem>
                    </Select>
                </FormControl>
                <FormControl variant="outlined" className="dropdown">
                    <InputLabel>Država</InputLabel>
                    <Select
                        value={selectedCountry}
                        onChange={handleCountryChange}
                        label="Country"
                    >
                        <MenuItem value="Sve">Sve</MenuItem>
                        {countries.map((country) => (
                            <MenuItem key={country.id} value={country.name}>{country.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl variant="outlined" className="dropdown">
                    <InputLabel>Mjesec</InputLabel>
                    <Select
                        value={selectedMonth}
                        onChange={handleMonthChange}
                        label="Month"
                    >
                        <MenuItem value="Svi">Svi</MenuItem>
                        {months.map((month, index) => (
                            <MenuItem key={index} value={month}>{month}</MenuItem>
                        ))}
                    </Select>
            </FormControl>
                <Button variant="contained" color="secondary" onClick={handleClearFilters}>
                    Clear Filters
                </Button>
            </div>
            <div className="destinations">
                {displayedTrips.map((trip) => (
                    <Link key={trip.id} to={`/putovanja/${trip.id}`}>
                        <TripCard trip={trip} />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Trips;
