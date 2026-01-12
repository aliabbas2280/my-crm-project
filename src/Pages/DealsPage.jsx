import { useState, useEffect } from 'react';
import { Container, Button, Form, Row, Col } from 'react-bootstrap';
import { MdHandshake, MdEdit, MdDelete } from 'react-icons/md';
import { dealsAPI, clientsAPI, activitiesAPI } from '../utils/api';
import PageHeader from '../components/Common/PageHeader';
import SearchFilter from '../components/Common/SearchFilter';
import DataTable from '../components/Common/DataTable';
import FormModal from '../components/Common/FormModal';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import '../CSS/Dashboard.css';

const DealsPage = () => {
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();

  const [deals, setDeals] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [formData, setFormData] = useState({
    title: '',
    clientId: '',
    value: '',
    status: 'Lead',
    expectedCloseDate: ''
  });

  const dealStatuses = ['Lead', 'Qualified', 'Proposal', 'Won', 'Lost'];

  const fetchDeals = async (search = '', status = 'All') => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.q = search;
      if (status !== 'All') params.status = status;

      const [dealsResponse, clientsResponse] = await Promise.all([
        dealsAPI.getAll(params),
        clientsAPI.getAll()
      ]);

      setDeals(dealsResponse || []);
      setClients(clientsResponse || []);
    } catch {
      alert('Failed to load deals or clients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  useEffect(() => {
    fetchDeals(searchTerm, statusFilter);
  }, [searchTerm, statusFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const selectedClient = clients.find(c => c.id === formData.clientId);
      const dealData = {
        ...formData,
        clientName: selectedClient?.name || '',
        userName: user?.name || 'Current User',
        userId: user?.id
      };

      if (editingDeal) {
        await dealsAPI.update(editingDeal.id, dealData);
        await activitiesAPI.create({
          type: 'deal_updated',
          message: `Deal '${formData.title}' updated`,
          userId: user?.id
        });
        alert('Deal updated successfully!');
      } else {
        await dealsAPI.create(dealData);
        await activitiesAPI.create({
          type: 'deal_created',
          message: `New deal '${formData.title}' created`,
          userId: user?.id
        });
        alert('Deal created successfully!');
      }

      fetchDeals(searchTerm, statusFilter);
      handleCloseModal();
    } catch {
      alert('Failed to save deal. Please try again.');
    }
  };

  const handleEdit = (deal) => {
    setEditingDeal(deal);
    setFormData({
      title: deal.title,
      clientId: deal.clientId,
      value: deal.value,
      status: deal.status,
      expectedCloseDate: deal.expectedCloseDate || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (deal) => {
    if (!window.confirm(`Are you sure you want to delete deal '${deal.title}'?`)) return;
    try {
      await dealsAPI.delete(deal.id);
      await activitiesAPI.create({
        type: 'deal_deleted',
        message: `Deal '${deal.title}' deleted`,
        userId: user?.id
      });
      fetchDeals(searchTerm, statusFilter);
      alert('Deal deleted successfully!');
    } catch {
      alert('Failed to delete deal. Please try again.');
    }
  };

  const handleStatusChange = async (deal, newStatus) => {
    try {
      await dealsAPI.update(deal.id, { ...deal, status: newStatus });
      await activitiesAPI.create({
        type: 'deal_status_changed',
        message: `Deal '${deal.title}' status changed to ${newStatus}`,
        userId: user?.id
      });
      fetchDeals(searchTerm, statusFilter);
      alert('Deal status updated successfully!');
    } catch {
      alert('Failed to update deal status. Please try again.');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingDeal(null);
    setFormData({
      title: '',
      clientId: '',
      value: '',
      status: 'Lead',
      expectedCloseDate: ''
    });
  };

  const renderDealRow = (deal) => (
    <tr key={deal.id}>
      <td><strong>{deal.title}</strong></td>
      <td>{deal.clientName}</td>
      <td>Rs. {Number(deal.value || 0).toLocaleString()}</td>
      <td>
        <Form.Select
          size="sm"
          value={deal.status}
          onChange={(e) => handleStatusChange(deal, e.target.value)}
          className={`status-select status-${deal.status.toLowerCase()}`}
        >
          {dealStatuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </Form.Select>
      </td>
      <td>{deal.expectedCloseDate || 'Not set'}</td>
      <td>
        <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEdit(deal)}>
          <MdEdit className="me-1" />Edit
        </Button>
        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(deal)}>
          <MdDelete className="me-1" />Delete
        </Button>
      </td>
    </tr>
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="dashboard-container">
      <Container fluid className="dashboard-content">
        <PageHeader icon={MdHandshake} title="Deals Management" />

        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          statusOptions={dealStatuses}
          onAddClick={() => setShowModal(true)}
          addButtonText="Add Deal"
          searchPlaceholder="Search deals by title or client..."
        />

        <DataTable
          icon={MdHandshake}
          title="Deals Pipeline"
          data={deals}
          columns={['Title', 'Client', 'Value', 'Status', 'Close Date', 'Actions']}
          emptyMessage="No deals found"
          emptyDescription="Start by creating your first deal"
          renderRow={renderDealRow}
        />

        <FormModal
          show={showModal}
          onHide={handleCloseModal}
          title={editingDeal ? 'Edit Deal' : 'Add New Deal'}
          onSubmit={handleSubmit}
          submitText={editingDeal ? 'Update Deal' : 'Add Deal'}
        >
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Title *</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Client *</Form.Label>
                <Form.Select
                  value={formData.clientId}
                  onChange={(e) => setFormData({...formData, clientId: e.target.value})}
                  required
                >
                  <option value="">Select Client</option>
                  {clients?.map(client => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  )) || []}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Value *</Form.Label>
                <Form.Control
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({...formData, value: e.target.value})}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  {dealStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Expected Close Date</Form.Label>
                <Form.Control
                  type="date"
                  value={formData.expectedCloseDate}
                  onChange={(e) => setFormData({...formData, expectedCloseDate: e.target.value})}
                />
              </Form.Group>
            </Col>
          </Row>
        </FormModal>
      </Container>
    </div>
  );
};

export default DealsPage;
