import { HashRouter, Route, Routes} from 'react-router-dom';
import { Container } from '@mui/system';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import Home from './Pages/Home/Home';
import Profile from './Pages/Profile/Profile';
import Trips from './Pages/Trips/Trips';
import Trip from './Pages/Trip/Trip';
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';
import './App.css';

function App() {
  return (
    <HashRouter>
     
        <Header></Header>
        <div className="app">
          <Container maxWidth="xl">
            <Routes>
              <Route path='/' element={<Home/>} exact/>
              <Route path='/profil' element={<Profile/>}/>
              <Route path='/putovanja' element={<Trips/>}/>
              <Route exact path="/putovanja/:id" element={<Trip/>} />
              <Route path='/prijava' element={<Login/>}/>
              <Route path='/registracija' element={<Register/>}/>

            </Routes>
          </Container>
        </div>
        <Footer></Footer>
     
  </HashRouter>
  );
}

export default App;