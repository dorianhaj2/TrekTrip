import TripCard from "../../Components/TripCard/TripCard";

export default function Trips() {
    const [trips, setTrips] = useState([]);

    useEffect(() => {
      // Fetch all trips
      fetch('/api/trips')
        .then(response => response.json())
        .then(data => setTrips(data))
        .catch(error => console.error('Error fetching trips:', error));
    }, []);
  

    <div className="App">
        <div className="filters">
            <button>Trajanje</button>
            <button>Ocjena</button>
            <button>Cijena</button>
        </div>
        <div className="destinations">
            {trips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
            ))}
        </div>
    </div>

}