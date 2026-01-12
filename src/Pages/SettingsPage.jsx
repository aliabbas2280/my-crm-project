import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { MdPerson, MdEmail, MdSave, MdSettings } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { usersAPI } from "../utils/api";
import "../CSS/Settings.css";

const SettingsPage = () => {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Load current user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (!storedUser) {
      navigate("/login", { replace: true });
      return;
    }
    try {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || ""
      }));
    } catch {
      localStorage.removeItem("currentUser");
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // Clear success/error messages after 3s
  useEffect(() => {
    if (success || errors.general) {
      const timer = setTimeout(() => {
        setSuccess("");
        setErrors(prev => ({ ...prev, general: "" }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, errors.general]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";

    // Password change validation
    if (formData.newPassword || formData.confirmPassword) {
      if (!formData.currentPassword) newErrors.currentPassword = "Current password is required";
      if (formData.newPassword.length < 6) newErrors.newPassword = "Password must be at least 6 characters";
      if (formData.newPassword !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
      // Check currentPassword matches stored password (for JSON server)
      if (formData.currentPassword && formData.currentPassword !== currentUser?.password) {
        newErrors.currentPassword = "Current password is incorrect";
      }
    }

    return newErrors;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setErrors({});
    setSuccess("");
    setLoading(true);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      // Check for duplicate email
      const allUsers = await usersAPI.getAll();
      const duplicate = allUsers.find(u => u.email === formData.email && u.id !== currentUser.id);
      if (duplicate) {
        setErrors({ email: "Another account with this email already exists" });
        setLoading(false);
        return;
      }

      const updatedUser = { ...currentUser, name: formData.name.trim(), email: formData.email.trim() };
      if (formData.newPassword) updatedUser.password = formData.newPassword;

      await usersAPI.update(currentUser.id, updatedUser);

      // Store only safe info in localStorage
      localStorage.setItem("currentUser", JSON.stringify({
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role
      }));
      setCurrentUser(updatedUser);

      setSuccess("Profile updated successfully");
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
    } catch {
      setErrors({ general: "Failed to update profile. Try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-container">
      <Container>
        <Row className="justify-content-center">
          <Col lg={8}>
            <Card className="settings-card">
              <Card.Header className="settings-header">
                <h3>
                  <MdSettings className="me-2" />Account Settings
                </h3>
                <p className="text-muted mb-0">Update your profile information</p>
              </Card.Header>

              <Card.Body className="p-4">
                {errors.general && <Alert variant="danger">{errors.general}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label><MdPerson className="me-2" />Full Name</Form.Label>
                        <Form.Control
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          isInvalid={!!errors.name}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.name}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label><MdEmail className="me-2" />Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          isInvalid={!!errors.email}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.email}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <hr />

                  <h5 className="mb-3">Change Password</h5>
                  <Row>
                    <Col md={4}>
                      <Form.Control
                        type="password"
                        name="currentPassword"
                        placeholder="Current password"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        isInvalid={!!errors.currentPassword}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.currentPassword}
                      </Form.Control.Feedback>
                    </Col>
                    <Col md={4}>
                      <Form.Control
                        type="password"
                        name="newPassword"
                        placeholder="New password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        isInvalid={!!errors.newPassword}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.newPassword}
                      </Form.Control.Feedback>
                    </Col>
                    <Col md={4}>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        isInvalid={!!errors.confirmPassword}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.confirmPassword}
                      </Form.Control.Feedback>
                    </Col>
                  </Row>

                  <div className="text-end mt-4">
                    <Button type="submit" disabled={loading}>
                      <MdSave className="me-2" />
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SettingsPage;
