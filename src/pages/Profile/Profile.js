import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import './Profile.css';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer
} from 'recharts';

export default function Profile() {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    profileImage: ''
  });

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', profileImage: '' });
  const [workoutStats, setWorkoutStats] = useState({ total: 0, completed: 0 });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchProfile();
    fetchWorkoutStats();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('https://fitness-tracker-api-enez.onrender.com/users/details', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setProfile(data);
      setFormData({ firstName: data.firstName, lastName: data.lastName, profileImage: data.profileImage || '' });
    } catch (error) {
      console.error('Profile fetch failed', error);
    }
  };

  const fetchWorkoutStats = async () => {
    try {
      const res = await fetch('https://fitness-tracker-api-enez.onrender.com/workouts/getMyWorkouts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      const workouts = data.workouts || [];

      const completed = workouts.filter(w => w.status === 'completed').length;
      const total = workouts.length;

      setWorkoutStats({ total, completed });
    } catch (error) {
      console.error('Error fetching workout stats', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, profileImage: reader.result }));
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      const res = await fetch('https://fitness-tracker-api-enez.onrender.com/users/update-profile', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const updated = await res.json();
      setProfile(prev => ({ ...prev, ...formData }));
      setEditMode(false);
      Swal.fire('Updated', 'Profile updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating profile', error);
      Swal.fire('Error', 'Failed to update profile', 'error');
    }
  };

  const pending = workoutStats.total - workoutStats.completed;

  const chartData = [
    { name: 'Completed', value: workoutStats.completed },
    { name: 'Pending', value: pending }
  ];

  const chartColors = ['#28a745', '#ffc107'];

  return (
    <Container className="profile-page mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="profile-card p-4">
            <div className="text-center mb-4">
              <img
                src={formData.profileImage || 'https://via.placeholder.com/120'}
                alt="Profile"
                className="profile-img"
              />
              {editMode && (
                <Form.Group controlId="formFile" className="mt-2">
                  <Form.Control type="file" accept="image/*" onChange={handleImageUpload} />
                </Form.Group>
              )}
            </div>

            {editMode ? (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Button variant="primary" onClick={handleSave}>Save</Button>{' '}
                <Button variant="secondary" onClick={() => setEditMode(false)}>Cancel</Button>
              </>
            ) : (
              <>
                <h4 className="text-center mb-3">{profile.firstName} {profile.lastName}</h4>
                <p className="text-muted text-center">{profile.email}</p>
                <div className="d-flex justify-content-center mb-3">
                  <Button onClick={() => setEditMode(true)}>Edit Profile</Button>
                </div>
              </>
            )}

            <div className="workout-stats mt-4 text-center">
              <h5>🏋️‍♀️ Workout Stats</h5>
              <p>Total Workouts: <strong>{workoutStats.total}</strong></p>
              <p>Completed: <strong>{workoutStats.completed}</strong></p>
              <p>Pending: <strong>{pending}</strong></p>
            </div>

            <div className="progress-chart mt-4 text-center">
              <h5>📊 Workout Progress</h5>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    fill="#8884d8"
                    label
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
