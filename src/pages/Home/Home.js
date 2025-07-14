import React from 'react';
import { Container, Button, Row, Col, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsBarChartLine, BsPhone, BsShieldLock, BsKanban } from 'react-icons/bs';
import './Home.css';

export default function Home() {
  return (
    <div className="home-page">
      <Container className="py-5">
        <Row className="align-items-center">
          <Col md={6} className="text-center text-md-start mb-4 mb-md-0">
            <h1 className="home-title">Track Your Fitness Journey 💪</h1>
            <p className="home-subtitle">
              Stay focused, log your workouts, and hit your goals with ease.
            </p>
            <div className="mt-4">
              <Button as={Link} to="/register" className="home-btn primary-btn me-3">
                Get Started
              </Button>
              <Button as={Link} to="/login" className="home-btn secondary-btn">
                Login
              </Button>
            </div>
          </Col>
          <Col md={6}>
            <Image
              src="https://cdn-icons-png.flaticon.com/512/2755/2755367.png"
              alt="Fitness Illustration"
              className="img-fluid hero-img"
            />
          </Col>
        </Row>

        <Row className="mt-5 text-center">
          <Col xs={6} md={3}>
            <div className="feature-box">
              <BsKanban size={30} className="feature-icon" />
              <p>Simple Dashboard</p>
            </div>
          </Col>
          <Col xs={6} md={3}>
            <div className="feature-box">
              <BsBarChartLine size={30} className="feature-icon" />
              <p>Track Progress</p>
            </div>
          </Col>
          <Col xs={6} md={3}>
            <div className="feature-box">
              <BsShieldLock size={30} className="feature-icon" />
              <p>Secure Access</p>
            </div>
          </Col>
          <Col xs={6} md={3}>
            <div className="feature-box">
              <BsPhone size={30} className="feature-icon" />
              <p>Mobile Friendly</p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
