import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Nav, Navbar } from 'react-bootstrap';

export default function AppNavbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if the user is logged in by checking if there's a token in localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);  // Set the state to true if token exists, false otherwise
  }, []);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('token');  // Remove token from localStorage
    setIsLoggedIn(false);  // Update the login state
    window.location.href = '/';  // Redirect to home page or refresh the page
  };

  return (
    <Navbar expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/">Fitness Tracker</Navbar.Brand>
        {/* Toggle for mobile view */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            {!isLoggedIn ? (
              <>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
              </>
            ) : (
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link> // Show logout when logged in
            )}
            <Nav.Link as={Link} to="/workout">Workouts</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
