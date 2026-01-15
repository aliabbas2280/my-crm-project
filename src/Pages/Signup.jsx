import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { MdPerson, MdEmail, MdLock, MdPersonAdd, MdBusiness } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/index';
import { toast } from 'react-toastify';
import '../CSS/Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const { signup, loading } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        await signup(formData);
        toast.success('Account created successfully!');
        navigate(ROUTES.LOGIN);
      } catch (error) {
        console.error('Signup error:', error);
        toast.error(error.message || 'Signup failed. Please try again.');
        setErrors({ general: error.message || 'Signup failed. Please try again.' });
      }
    }
  };

  return (
    <div className="signup-container">
      <Container>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col md={6} lg={5}>
            <Card className="signup-card shadow-lg border-0">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h1 className="signup-title"><MdBusiness /></h1>
                  <h2 className="signup-subtitle">Join CRM</h2>
                  <p className="text-muted">Create your account to get started</p>
                </div>

                {errors.general && (
                  <Alert variant="danger" className="mb-3">
                    {errors.general}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label><MdPerson className="me-2" />Full Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`signup-input ${errors.name ? 'is-invalid' : ''}`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label><MdEmail className="me-2" />Email Address *</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`signup-input ${errors.email ? 'is-invalid' : ''}`}
                      placeholder="Enter your email address"
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label><MdLock className="me-2" />Password *</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`signup-input ${errors.password ? 'is-invalid' : ''}`}
                      placeholder="Create a password (min 6 characters)"
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label><MdLock className="me-2" />Confirm Password *</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`signup-input ${errors.confirmPassword ? 'is-invalid' : ''}`}
                      placeholder="Confirm your password"
                    />
                    {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                  </Form.Group>

                  <Button
                    type="submit"
                    className="signup-btn w-100"
                    disabled={loading}
                  >
                    <MdPersonAdd className="me-2" />
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </Form>

                <div className="mt-4 text-center">
                  <p className="login-link">
                    Already have an account?{' '}
                    <Link to={ROUTES.LOGIN} className="login-btn-link">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Signup;