import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../../context/UserContext';
import Swal from 'sweetalert2';
import { Form, Button } from 'react-bootstrap';
import './Register.css';

export default function Register() {
  const navigate = useNavigate();
  const context = useContext(UserContext);
  const user = context && context.user ? context.user : null;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [password, setPassword] = useState('');
  const [isActive, setIsActive] = useState(false);

  // Form validation
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
        console.log('Register response:', data);

        if (data.message === 'Registered successfully') {
          setFirstName('');
          setLastName('');
          setEmail('');
          setMobileNo('');
          setPassword('');

          // Show SweetAlert success and navigate
          Swal.fire({
            title: 'Success!',
            text: 'Registration successful!',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#FF69B4', // Pink button
            backdrop: true,
            showClass: {
              popup: 'swal2-show swal2-animate-pop'
            },
            hideClass: {
              popup: 'swal2-hide swal2-animate-pop'
            }
          }).then((result) => {
            if (result.isConfirmed) {
              navigate('/'); // Redirect to the home page
            }
          });
        } else if (data.message === 'User already exists') {
          // Show SweetAlert error if user already exists
          Swal.fire({
            title: 'Error!',
            text: 'User with this email already exists. Please use a different email.',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#FF69B4',
            backdrop: true,
            showClass: {
              popup: 'swal2-show swal2-animate-pop'
            },
            hideClass: {
              popup: 'swal2-hide swal2-animate-pop'
            }
          });
        } else {
          // Show generic error if any other issue arises
          Swal.fire({
            title: 'Error!',
            text: data.message || 'Registration failed',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#FF69B4',
            backdrop: true,
            showClass: {
              popup: 'swal2-show swal2-animate-pop'
            },
            hideClass: {
              popup: 'swal2-hide swal2-animate-pop'
            }
          });
        }
      })
      .catch((err) => {
        console.error('Error:', err);

        // Show SweetAlert error if there is a server issue
        Swal.fire({
          title: 'Error!',
          text: 'Server error. Please try again later.',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#FF69B4',
          backdrop: true,
          showClass: {
            popup: 'swal2-show swal2-animate-pop'
          },
          hideClass: {
            popup: 'swal2-hide swal2-animate-pop'
          }
        });
      });
  };

  return (
    <div className="register-bg">
      <Form onSubmit={registerUser} className="register-form">
        <h2 className="register-title">Register</h2>

        <Form.Group className="mb-3">
          <Form.Label className="register-label">First Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter First Name"
            required
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
            required
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
            required
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
            required
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
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="register-input"
          />
        </Form.Group>

        <div style={{ textAlign: 'center' }}>
          <Button
            type="submit"
            id="submitBtn"
            disabled={!isActive}
            className="register-btn"
          >
            Submit
          </Button>
        </div>
      </Form>
    </div>
  );
}
