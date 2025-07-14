import React from 'react';
import Container from 'react-bootstrap/Container';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Importing AppNavbar
import AppNavbar from './components/AppNavbar';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Workout from './pages/Workout/Workout';

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';  
function App() {
  return (
    <Router>
      <AppNavbar />
      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/workout" element={<Workout />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
