import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Container, Nav, Navbar, Button, Collapse } from 'react-bootstrap';
import './AppNavbar.css';

export default function AppNavbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [expanded, setExpanded] = useState(false); // NEW
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // Collapse menu on route change
  useEffect(() => {
    setExpanded(false); // NEW
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <Navbar
      expand="lg"
      className="app-navbar shadow-sm"
      sticky="top"
      expanded={expanded} // NEW
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand-style">
          🏋️‍♀️ Fitness Tracker
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="navbar-nav"
          onClick={() => setExpanded(expanded ? false : "expanded")} // NEW
        />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/" onClick={() => setExpanded(false)}>
              Home
            </Nav.Link>

            {isLoggedIn ? (
              <>
                <Nav.Link as={Link} to="/workout" onClick={() => setExpanded(false)}>
                  Workouts
                </Nav.Link>
                <Nav.Link as={Link} to="/profile" onClick={() => setExpanded(false)}>
                  Profile
                </Nav.Link>
                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={() => {
                    setExpanded(false);
                    handleLogout();
                  }}
                  className="ms-3"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" onClick={() => setExpanded(false)}>
                  Login
                </Nav.Link>
                <Button
                  as={Link}
                  to="/register"
                  size="sm"
                  onClick={() => setExpanded(false)}
                  className="ms-3 register-btn"
                >
                  Register
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
