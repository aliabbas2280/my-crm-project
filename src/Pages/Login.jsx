import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { MdEmail, MdLock, MdLogin, MdBusiness } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { usersAPI } from '../utils/api';
import { ROUTES } from '../constants/index';
import '../CSS/LoginNew.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await usersAPI.login(formData.email, formData.password);
      localStorage.setItem('currentUser', JSON.stringify(response.data));
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Container>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col md={6} lg={4}>
            <Card className="login-card shadow-lg border-0">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h1 className="login-title"><MdBusiness /></h1>
                  <h2 className="login-subtitle">CRM</h2>
                  <p className="text-muted">Sign in to your account</p>
                </div>

                {error && (
                  <Alert variant="danger" className="mb-3">
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label><MdEmail className="me-2" />Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      className="login-input"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label><MdLock className="me-2" />Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required
                      className="login-input"
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    className="login-btn w-100"
                    disabled={loading}
                  >
                    <MdLogin className="me-2" />
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </Form>

                <div className="mt-4 text-center">
                 
                  <div className="signup-section">
                    <p className="signup-text mb-2">
                      Don't have an account?
                    </p>
                    <Link to={ROUTES.SIGNUP} className="signup-link-btn">
                      Sign up here
                    </Link>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;