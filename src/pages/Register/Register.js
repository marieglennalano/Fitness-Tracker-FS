import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import UserContext from '../../context/UserContext';
import Swal from 'sweetalert2';
import { Form, Button } from 'react-bootstrap';
import './Register.css';

export default function Register() {
  const navigate = useNavigate();
  const context = useContext(UserContext);
  const user = context?.user ?? null;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [password, setPassword] = useState('');
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (
      firstName !== '' &&
      lastName !== '' &&
      email !== '' &&
      mobileNo.length === 11 &&
      password !== ''
    ) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [firstName, lastName, email, mobileNo, password]);

  const registerUser = (e) => {
    e.preventDefault();

    fetch('https://fitness-tracker-api-enez.onrender.com/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        mobileNo,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === 'Registered successfully') {
          setFirstName('');
          setLastName('');
          setEmail('');
          setMobileNo('');
          setPassword('');

          Swal.fire({
            title: 'Success!',
            text: 'Registration successful!',
            icon: 'success',
            confirmButtonColor: '#FF69B4',
          }).then(() => navigate('/login'));
        } else if (data.message === 'User already exists') {
          Swal.fire({
            title: 'Error!',
            text: 'User already exists. Try a different email.',
            icon: 'error',
            confirmButtonColor: '#FF69B4',
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: data.message || 'Registration failed',
            icon: 'error',
            confirmButtonColor: '#FF69B4',
          });
        }
      })
      .catch((err) => {
        console.error('Error:', err);
        Swal.fire({
          title: 'Error!',
          text: 'Server error. Please try again later.',
          icon: 'error',
          confirmButtonColor: '#FF69B4',
        });
      });
  };

  return (
    <div className="register-bg">
      <Form onSubmit={registerUser} className="register-form">
        <h2 className="register-title">Create Account</h2>
        <p className="register-subtitle text-center mb-4">Join Fitness Tracker today!</p>

        <Form.Group className="mb-3">
          <Form.Label className="register-label">First Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="register-input"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="register-label">Last Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="register-input"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="register-label">Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="register-input"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="register-label">Mobile No</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter 11-digit number"
            value={mobileNo}
            onChange={(e) => setMobileNo(e.target.value)}
            className="register-input"
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label className="register-label">Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="register-input"
          />
        </Form.Group>

        <Button
          type="submit"
          className="register-btn"
          disabled={!isActive}
        >
          Register
        </Button>

        <div className="mt-3 text-center">
          <small>
            Already have an account? <Link to="/login" className="text-pink">Login</Link>
          </small>
        </div>
      </Form>
    </div>
  );
}
