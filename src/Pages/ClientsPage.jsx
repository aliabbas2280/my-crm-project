import { useState, useEffect } from 'react';
import { Container, Button, Form, Badge, Row, Col } from 'react-bootstrap';
import { MdPeople, MdEdit, MdDelete } from 'react-icons/md';
import { clientsAPI, activitiesAPI } from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import PageHeader from '../components/Common/PageHeader';
import SearchFilter from '../components/Common/SearchFilter';
import DataTable from '../components/Common/DataTable';
import FormModal from '../components/Common/FormModal';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import '../CSS/Dashboard.css';

const ClientsPage = () => {
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'Active'
  });

  // Fetch clients from API with optional search/status filters
  const fetchClients = async (search = '', status = 'All') => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.q = search;
      if (status !== 'All') params.status = status;

      const response = await clientsAPI.getAll(params);
      setClients(response || []);
    } catch (err) {
      alert('Failed to load clients data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Update API whenever search or status changes
  useEffect(() => {
    fetchClients(searchTerm, statusFilter);
  }, [searchTerm, statusFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingClient) {
        await clientsAPI.update(editingClient.id, formData);
        await activitiesAPI.create({
          type: 'client_updated',
          message: `Client ${formData.name} updated`,
          userId: user?.id
        });
        alert('Client updated successfully!');
      } else {
        await clientsAPI.create(formData);
        await activitiesAPI.create({
          type: 'client_created',
          message: `New client ${formData.name} added`,
          userId: user?.id
        });
        alert('Client created successfully!');
      }

      fetchClients(searchTerm, statusFilter);
      handleCloseModal();
    } catch (err) {
      alert('Failed to save client. Please try again.');
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setFormData({ ...client });
    setShowModal(true);
  };

  const handleDelete = async (client) => {
    if (!window.confirm(`Are you sure you want to delete ${client.name}?`)) return;
    try {
      await clientsAPI.delete(client.id);
      await activitiesAPI.create({
        type: 'client_deleted',
        message: `Client ${client.name} deleted`,
        userId: user?.id
      });
      fetchClients(searchTerm, statusFilter);
      alert('Client deleted successfully!');
    } catch (err) {
      alert('Failed to delete client. Please try again.');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingClient(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      status: 'Active'
    });
  };

  const renderClientRow = (client) => (
    <tr key={client.id}>
      <td><strong>{client.name}</strong></td>
      <td>{client.company}</td>
      <td>{client.email}</td>
      <td>{client.phone}</td>
      <td>
        <Badge className={`status-badge status-${client.status.toLowerCase()}`}>
          {client.status}
        </Badge>
      </td>
      <td>
        <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEdit(client)}>
          <MdEdit className="me-1" />Edit
        </Button>
        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(client)}>
          <MdDelete className="me-1" />Delete
        </Button>
      </td>
    </tr>
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="dashboard-container">
      <Container fluid className="dashboard-content">
        <PageHeader icon={MdPeople} title="Clients Management" />

        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          statusOptions={['Active', 'Inactive']}
          onAddClick={() => setShowModal(true)}
          addButtonText="Add Client"
          searchPlaceholder="Search clients by name, company, or email..."
        />

        <DataTable
          icon={MdPeople}
          title="Clients List"
          data={clients}
          columns={['Name', 'Company', 'Email', 'Phone', 'Status', 'Actions']}
          emptyMessage="No clients found"
          emptyDescription="Start by adding your first client"
          renderRow={renderClientRow}
        />

        <FormModal
          show={showModal}
          onHide={handleCloseModal}
          title={editingClient ? 'Edit Client' : 'Add New Client'}
          onSubmit={handleSubmit}
          submitText={editingClient ? 'Update Client' : 'Add Client'}
        >
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Name *</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Company *</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email *</Form.Label>
                <Form.Control
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </FormModal>
      </Container>
    </div>
  );
};

export default ClientsPage;
