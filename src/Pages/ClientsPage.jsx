import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Container, Button, Form, Badge, Row, Col } from 'react-bootstrap';
import { MdPeople, MdEdit, MdDelete, MdMenu, MdClose, MdArrowUpward, MdArrowDownward } from 'react-icons/md';
import { clientsAPI, activitiesAPI } from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import { useDebounce } from '../hooks/useDebounce';
import PageHeader from '../components/Common/PageHeader';
import SearchFilter from '../components/Common/SearchFilter';
import DataTable from '../components/Common/DataTable';
import FormModal from '../components/Common/FormModal';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import Pagination from '../components/Common/Pagination';
import AppNavbar from '../components/Layout/Navbar';
import { toast } from 'react-toastify';
import '../CSS/Dashboard.css';
import '../CSS/FormResponsive.css';

const ClientsPage = () => {
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();

  // Server-side state: data from API
  const [clients, setClients] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);

  // Client-side state: controls for API requests
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 5;
  // ADDED: Sorting state
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // ADDED: Refs for scroll management
  const tableRef = useRef(null);
  const isFirstRender = useRef(true);

  // UI state
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

  // MODIFIED: Memoized with useCallback
  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      const params = { page: currentPage, limit };
      if (debouncedSearchTerm.trim()) params.q = debouncedSearchTerm.trim();
      if (statusFilter !== 'All') params.status = statusFilter;
      params.sort = sortBy;
      params.order = sortOrder;
      
      const res = await clientsAPI.getAll(params);
      setClients(res.data || []);
      setTotalRecords(res.total || 0);
    } catch (error) {
      console.error('Failed to load clients:', error);
      alert('Failed to load clients');
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchTerm, statusFilter, sortBy, sortOrder]);

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, statusFilter, sortBy, sortOrder]);

  // Fetch data when page or dependencies change
  useEffect(() => {
    fetchClients();
  }, [fetchClients]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingClient) {
        await clientsAPI.update(editingClient.id, formData);
        setClients(prevClients => prevClients.map(c => c.id === editingClient.id ? { ...c, ...formData } : c));
        toast.success('Client updated successfully!');
        await activitiesAPI.create({
          type: 'client_updated',
          message: `Client ${formData.name} updated`,
          userId: user?.id
        });
      } else {
        const created = await clientsAPI.create(formData);
        if (currentPage === 1) {
          setClients(prevClients => [{ ...formData, id: created.data?.id || Date.now().toString() }, ...prevClients].slice(0, limit));
          setTotalRecords(prev => prev + 1);
        } else {
          setTotalRecords(prev => prev + 1);
        }
        toast.success('Client created successfully!');
        await activitiesAPI.create({
          type: 'client_created',
          message: `New client ${formData.name} added`,
          userId: user?.id
        });
      }
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save client:', error);
      toast.error(error.message || 'Failed to save client');
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
      setClients(prevClients => prevClients.filter(c => c.id !== client.id));
      setTotalRecords(prev => prev - 1);
      toast.success('Client deleted successfully!');
      
      await clientsAPI.delete(client.id).catch(err => {
        console.warn('Delete API error (ignored):', err);
      });
      
      await activitiesAPI.create({
        type: 'client_deleted',
        message: `Client ${client.name} deleted`,
        userId: user?.id
      }).catch(err => {
        console.warn('Activity creation failed:', err);
      });
    } catch (error) {
      console.error('Failed to delete client:', error);
      toast.error('Failed to delete client');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingClient(null);
    setFormData({ name:'', email:'', phone:'', company:'', status:'Active' });
  };

  // MODIFIED: Memoized renderRow
  const renderClientRow = useCallback((client) => (
    <tr key={client.id}>
      <td><strong>{client.name}</strong></td>
      <td>{client.company}</td>
      <td>{client.email}</td>
      <td>{client.phone}</td>
      <td><Badge className={`status-badge status-${client.status.toLowerCase()}`}>{client.status}</Badge></td>
      <td>
        <div className="action-buttons">
          <Button size="sm" variant="outline-primary" onClick={() => handleEdit(client)}><MdEdit /></Button>
          <Button size="sm" variant="outline-danger" onClick={() => handleDelete(client)}><MdDelete /></Button>
        </div>
      </td>
    </tr>
  ), [handleEdit, handleDelete]);

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <button
        className="hamburger-menu d-lg-none"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label={sidebarOpen ? "Close menu" : "Open menu"}
      >
        {sidebarOpen ? <MdClose /> : <MdMenu />}
      </button>

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="dashboard-container">
        <div className="dashboard-content">
          <AppNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          <Container fluid>
            <PageHeader icon={MdPeople} title="Clients Management" />

            <SearchFilter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              statusOptions={['Active','Inactive']}
              onAddClick={() => setShowModal(true)}
              addButtonText="Add Client"
            />

            {/* ADDED: Sorting Controls */}
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
              <Button
                variant={sortOrder === 'asc' ? 'primary' : 'outline-secondary'}
                onClick={() => setSortOrder('asc')}
                style={{ padding: '0.375rem 0.75rem' }}
              >
                <MdArrowUpward />
              </Button>
              <Button
                variant={sortOrder === 'desc' ? 'primary' : 'outline-secondary'}
                onClick={() => setSortOrder('desc')}
                style={{ padding: '0.375rem 0.75rem' }}
              >
                <MdArrowDownward />
              </Button>
            </div>

            <div ref={tableRef}>
              <DataTable
                icon={MdPeople}
                title="Clients List"
                data={clients}
                columns={['Name','Company','Email','Phone','Status','Actions']}
                renderRow={renderClientRow}
                emptyMessage="No clients found"
              />
            </div>

            {totalRecords > 0 && (
              <Pagination
                currentPage={currentPage}
                totalRecords={totalRecords}
                limit={limit}
                onPageChange={setCurrentPage}
              />
            )}

          <FormModal
            show={showModal}
            onHide={handleCloseModal}
            title={editingClient ? 'Edit Client' : 'Add New Client'}
            onSubmit={handleSubmit}
            submitText={editingClient ? 'Update Client' : 'Add Client'}
          >
            <Row>
              <Col xs={12} md={6}><Form.Group className="mb-3"><Form.Label>Name *</Form.Label>
                <Form.Control type="text" value={formData.name} onChange={e => setFormData({...formData, name:e.target.value})} required /></Form.Group></Col>
              <Col xs={12} md={6}><Form.Group className="mb-3"><Form.Label>Company *</Form.Label>
                <Form.Control type="text" value={formData.company} onChange={e => setFormData({...formData, company:e.target.value})} required /></Form.Group></Col>
            </Row>
            <Row>
              <Col xs={12} md={6}><Form.Group className="mb-3"><Form.Label>Email *</Form.Label>
                <Form.Control type="email" value={formData.email} onChange={e => setFormData({...formData, email:e.target.value})} required /></Form.Group></Col>
              <Col xs={12} md={6}><Form.Group className="mb-3"><Form.Label>Phone</Form.Label>
                <Form.Control type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone:e.target.value})} /></Form.Group></Col>
            </Row>
            <Row><Col xs={12} md={6}><Form.Group className="mb-3"><Form.Label>Status</Form.Label>
              <Form.Select value={formData.status} onChange={e => setFormData({...formData, status:e.target.value})}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Form.Select></Form.Group></Col></Row>
          </FormModal>
          </Container>
        </div>
      </div>
    </>
  );
};

export default ClientsPage;