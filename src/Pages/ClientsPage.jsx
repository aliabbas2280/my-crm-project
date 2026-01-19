import { useState, useEffect, useRef } from 'react';
import { Container, Button, Form, Badge, Row, Col } from 'react-bootstrap';
import { MdPeople, MdEdit, MdDelete, MdMenu, MdClose } from 'react-icons/md';
import { clientsAPI, activitiesAPI } from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import { useDebounce } from '../hooks/useDebounce';
import { usePagination } from '../hooks/usePagination';
import PageHeader from '../components/Common/PageHeader';
import SearchFilter from '../components/Common/SearchFilter';
import DataTable from '../components/Common/DataTable';
import FormModal from '../components/Common/FormModal';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import Pagination from '../components/Common/Pagination';
import AppNavbar from '../components/Layout/Navbar';
import '../CSS/Dashboard.css';
import '../CSS/FormResponsive.css';

const ClientsPage = () => {
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();

  const { currentPage, limit, goToPage, resetPage } = usePagination(5);

  const [clients, setClients] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const debouncedSearchTerm = useDebounce(searchTerm, 800);

  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'Active'
  });

  const tableRef = useRef(null);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit,
        sort: sortBy,
        order: sortOrder
      };

      if (debouncedSearchTerm.trim()) params.q = debouncedSearchTerm.trim();
      if (statusFilter !== 'All') params.status = statusFilter;

      const res = await clientsAPI.getAll(params);
      setClients(res.data || []);
      setTotalRecords(res.total || 0);
    } catch (error) {
      console.error('Failed to load clients:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    resetPage();
  }, [debouncedSearchTerm, statusFilter, sortBy, sortOrder, resetPage]);

  useEffect(() => {
    fetchClients();
  }, [currentPage, debouncedSearchTerm, statusFilter, sortBy, sortOrder]);

 
  const handlePageChange = (newPage) => {
    goToPage(newPage);
    if (tableRef.current) {
      tableRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

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
      } else {
        await clientsAPI.create(formData);
        await activitiesAPI.create({
          type: 'client_created',
          message: `New client ${formData.name} added`,
          userId: user?.id
        });
      }
      await fetchClients();
      handleCloseModal();
    } catch (error) {
      alert(error.message || 'Failed to save client');
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setFormData({ ...client });
    setShowModal(true);
  };

  const handleDelete = async (client) => {
    if (!window.confirm(`Delete ${client.name}?`)) return;
    try {
      await clientsAPI.delete(client.id);
      await activitiesAPI.create({
        type: 'client_deleted',
        message: `Client ${client.name} deleted`,
        userId: user?.id
      });
      await fetchClients();
    } catch (error) {
      alert(error.message || 'Failed to delete client');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingClient(null);
    setFormData({ name: '', email: '', phone: '', company: '', status: 'Active' });
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
        <div className="action-buttons">
          <Button size="sm" variant="outline-primary" onClick={() => handleEdit(client)}>
            <MdEdit />
          </Button>
          <Button size="sm" variant="outline-danger" onClick={() => handleDelete(client)}>
            <MdDelete />
          </Button>
        </div>
      </td>
    </tr>
  );

  return (
    <>
      {loading && <LoadingSpinner />}

      <button
        className="hamburger-menu d-lg-none"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <MdClose /> : <MdMenu />}
      </button>

      <div className="dashboard-container">
        <div className="dashboard-content">
          <AppNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          <Container fluid>
            <PageHeader icon={MdPeople} title="Client Management" />

            <SearchFilter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              statusOptions={['Active', 'Inactive']}
              onAddClick={() => setShowModal(true)}
              addButtonText="Add Client"
            />

            <div className="mb-3 d-flex gap-2 align-items-center">
              <Form.Label className="mb-0">Sort by:</Form.Label>
              <Form.Select
                style={{ width: '150px' }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="createdAt">Date Created</option>
                <option value="name">Name</option>
                <option value="company">Company</option>
                <option value="status">Status</option>
              </Form.Select>

              <Form.Select
                style={{ width: '120px' }}
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </Form.Select>
            </div>

            <div ref={tableRef} style={{minHeight: '500px', display: 'flex', flexDirection: 'column'}}>
              <div style={{flex: 1}}>
                <DataTable
                  icon={MdPeople}
                  title="Clients List"
                  data={clients}
                  columns={['Name', 'Company', 'Email', 'Phone', 'Status', 'Actions']}
                  renderRow={renderClientRow}
                  emptyMessage="No clients found"
                />
              </div>
              {totalRecords > 0 && (
                <div className="pagination-container" style={{marginTop: 'auto'}}>
                  <div className="pagination-info">
                    Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalRecords)} of {totalRecords}
                  </div>
                  <div className="pagination-controls">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    <span className="mx-2">Page {currentPage} of {Math.ceil(totalRecords / limit)}</span>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handlePageChange(Math.min(Math.ceil(totalRecords / limit), currentPage + 1))}
                      disabled={currentPage === Math.ceil(totalRecords / limit)}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>

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
      </div>
    </>
  );
};

export default ClientsPage;