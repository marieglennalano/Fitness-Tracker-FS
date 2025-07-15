import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form
} from 'react-bootstrap';
import Swal from 'sweetalert2';
import './Workout.css';

export default function Workout() {
  const [workouts, setWorkouts] = useState([]);
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    duration: '',
    status: 'pending',
  });
  const [editWorkout, setEditWorkout] = useState(null);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      if (!token) {
        setError('No token found. Please log in again.');
        return;
      }
      const response = await fetch('https://fitness-tracker-api-enez.onrender.com/workouts/getMyWorkouts', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Error fetching workouts');
      const data = await response.json();
      setWorkouts(data.workouts || []);
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Failed to fetch workouts', 'error');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddWorkout = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://fitness-tracker-api-enez.onrender.com/workouts/addWorkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const newWorkout = await response.json();
      setWorkouts([newWorkout, ...workouts]);
      setShow(false);
      Swal.fire('Success', 'Workout added!', 'success');
    } catch (error) {
      Swal.fire('Error', 'Failed to add workout', 'error');
    }
  };

  const handleUpdateWorkoutStatus = async (workoutId) => {
    try {
      await fetch(`https://fitness-tracker-api-enez.onrender.com/workouts/completeWorkoutStatus/${workoutId}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      fetchWorkouts();
      Swal.fire('Success', 'Workout completed!', 'success');
    } catch (error) {
      Swal.fire('Error', 'Failed to update status', 'error');
    }
  };

  const handleEditWorkout = (workout) => {
    setFormData({
      name: workout.name,
      duration: workout.duration,
      status: workout.status,
    });
    setEditWorkout(workout);
    setShow(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`https://fitness-tracker-api-enez.onrender.com/workouts/updateWorkout/${editWorkout._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      fetchWorkouts();
      setShow(false);
      Swal.fire('Success', 'Workout updated!', 'success');
    } catch (error) {
      Swal.fire('Error', 'Failed to update workout', 'error');
    }
  };

  const handleDeleteWorkout = async (workoutId) => {
    try {
      await fetch(`https://fitness-tracker-api-enez.onrender.com/workouts/deleteWorkout/${workoutId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setWorkouts(prev => prev.filter(w => w._id !== workoutId));
      Swal.fire('Success', 'Workout deleted!', 'success');
    } catch (error) {
      Swal.fire('Error', 'Failed to delete workout', 'error');
    }
  };

  const handleShow = () => {
    setFormData({ name: '', duration: '', status: 'pending' });
    setEditWorkout(null);
    setShow(true);
  };

  const handleClose = () => setShow(false);

  return (
    <Container className="workout-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="section-title">Your Workouts</h2>
        {token && (
          <Button variant="success" id="addWorkout" onClick={handleShow}>
            + Add Workout
          </Button>
        )}
      </div>

      <Row>
        {workouts.length > 0 ? (
          workouts.map((workout) => (
            <Col key={workout._id} xs={12} sm={6} md={4} className="mb-4">
              <Card className="workout-card animate-card">
                <Card.Body>
                  <Card.Title>{workout.name}</Card.Title>
                  <Card.Text>
                    Duration: {workout.duration} minutes<br />
                    Status: {workout.status}
                  </Card.Text>

                  <div className="progress mt-2">
                    <div
                      className={`progress-bar ${
                        workout.status === 'completed' ? 'bg-success' : 'bg-warning'
                      } animate-fill`}
                      role="progressbar"
                      style={{ width: workout.status === 'completed' ? '100%' : '0%' }}
                      aria-valuenow={workout.status === 'completed' ? 100 : 0}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      {workout.status === 'completed' ? '100%' : '0%'}
                    </div>
                  </div>

                  {token && (
                    <div className="mt-3 d-flex flex-wrap gap-2">
                      <Button size="sm" variant="primary" onClick={() => handleEditWorkout(workout)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleDeleteWorkout(workout._id)}>
                        Delete
                      </Button>
                      {workout.status !== 'completed' && (
                        <Button size="sm" variant="success" onClick={() => handleUpdateWorkoutStatus(workout._id)}>
                          Complete
                        </Button>
                      )}
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>No workouts found. Login to View Workouts!</p>
        )}
      </Row>

      {/* Add/Edit Modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editWorkout ? 'Edit Workout' : 'Add Workout'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={editWorkout ? handleEditSubmit : handleAddWorkout}>
            <Form.Group className="mb-3">
              <Form.Label>Workout Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Duration (minutes)</Form.Label>
              <Form.Control
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select name="status" value={formData.status} onChange={handleInputChange}>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit">
              {editWorkout ? 'Update Workout' : 'Add Workout'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
