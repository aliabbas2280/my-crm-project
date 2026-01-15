import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Container, Button, Form, Row, Col } from 'react-bootstrap';
import { MdHandshake, MdEdit, MdDelete, MdMenu, MdClose, MdArrowUpward, MdArrowDownward } from 'react-icons/md';
import AppNavbar from '../components/Layout/Navbar';
import PageHeader from '../components/Common/PageHeader';
import SearchFilter from '../components/Common/SearchFilter';
import DataTable from '../components/Common/DataTable';
import FormModal from '../components/Common/FormModal';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import Pagination from '../components/Common/Pagination';
import { useAuth } from '../hooks/useAuth';
import { useDebounce } from '../hooks/useDebounce';
import { dealsAPI, clientsAPI, activitiesAPI } from '../utils/api';
import { toast } from 'react-toastify';
import '../CSS/Dashboard.css';
import '../CSS/FormResponsive.css';

const DealsPage = () => {
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();

 
  const [deals, setDeals] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const debouncedSearch = useDebounce(search, 400);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 5;
  // ADDED: Sorting state
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // ADDED: Refs for scroll management
  const tableRef = useRef(null);
  const isFirstRender = useRef(true);


  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    clientId: '',
    value: '',
    status: 'Lead',
    expectedCloseDate: ''
  });

  const dealStatuses = ['Lead', 'Qualified', 'Proposal', 'Won', 'Lost'];


  const fetchClients = async () => {
    try {
      const res = await clientsAPI.getAll();
      setClients(res.data || []);
    } catch (error) {
      console.error('Failed to load clients:', error);
      alert(error.message || 'Failed to load clients');
    }
  };

  // MODIFIED: Memoized with useCallback
  const fetchDeals = useCallback(async () => {
    try {
      setLoading(true);
      const params = { page: currentPage, limit };
      if (debouncedSearch.trim()) params.q = debouncedSearch.trim();
      if (statusFilter !== 'All') params.status = statusFilter;
      params.sort = sortBy;
      params.order = sortOrder;
      
      const res = await dealsAPI.getAll(params);
      setDeals(res.data || []);
      setTotalRecords(res.total || 0);
    } catch (err) {
      console.error('Failed to fetch deals', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, statusFilter, sortBy, sortOrder]);

  // MODIFIED: Reset page when search, filter, or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter, sortBy, sortOrder]);

  // MODIFIED: Fetch when page, search, filter, or sort changes
  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);



  useEffect(() => {
    fetchClients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedClient = clients.find(c => c.id === formData.clientId);

    const payload = {
      ...formData,
      clientName: selectedClient?.name || '',
      userId: user?.id,
      userName: user?.name
    };

    try {
      if (editingDeal) {
        const updated = await dealsAPI.update(editingDeal.id, payload);
        setDeals(prevDeals => prevDeals.map(d => d.id === editingDeal.id ? { ...d, ...payload } : d));
        toast.success('Deal updated successfully!');
      } else {
        const created = await dealsAPI.create(payload);
        if (currentPage === 1) {
          setDeals(prevDeals => [{ ...payload, id: created.data?.id || Date.now().toString() }, ...prevDeals].slice(0, limit));
          setTotalRecords(prev => prev + 1);
        } else {
          setTotalRecords(prev => prev + 1);
        }
        toast.success('Deal created successfully!');
      }

      await activitiesAPI.create({
        type: editingDeal ? 'deal_updated' : 'deal_created',
        message: editingDeal ? `Deal "${payload.title}" updated` : `New deal "${payload.title}" created`,
        userId: user?.id
      });

      closeModal();
    } catch (error) {
      console.error('Failed to save deal:', error);
      toast.error(error.message || 'Failed to save deal');
    }
  };

  const handleDelete = async (deal) => {
    if (!window.confirm(`Delete deal "${deal.title}"?`)) return;

    try {
      setDeals(prevDeals => prevDeals.filter(d => d.id !== deal.id));
      setTotalRecords(prev => prev - 1);
      toast.success('Deal deleted successfully!');
      
      await dealsAPI.delete(deal.id).catch(err => {
        console.warn('Delete API error (ignored):', err);
      });
      
      await activitiesAPI.create({
        type: 'deal_deleted',
        message: `Deal "${deal.title}" deleted`,
        userId: user?.id
      }).catch(err => {
        console.warn('Activity creation failed:', err);
      });
    } catch (error) {
      console.error('Failed to delete deal:', error);
      toast.error('Failed to delete deal');
    }
  };

  const handleStatusChange = async (deal, status) => {
    try {
      await dealsAPI.update(deal.id, { ...deal, status });
      setDeals(prevDeals => prevDeals.map(d => d.id === deal.id ? { ...d, status } : d));
      toast.success(`Status changed to ${status}`);
      await activitiesAPI.create({
        type: 'deal_status_changed',
        message: `Deal "${deal.title}" status changed to ${status}`,
        userId: user?.id
      });
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update status');
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

  const closeModal = () => {
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

  // MODIFIED: Memoized renderRow
  const renderRow = useCallback((deal) => (
    <tr key={deal.id}>
      <td><strong>{deal.title}</strong></td>
      <td>{deal.clientName}</td>
      <td>Rs. {Number(deal.value || 0).toLocaleString()}</td>
      <td>
        <Form.Select
          size="sm"
          value={deal.status}
          onChange={(e) => handleStatusChange(deal, e.target.value)}
        >
          {dealStatuses.map(s => (
            <option key={s}>{s}</option>
          ))}
        </Form.Select>
      </td>
      <td>{deal.expectedCloseDate || '—'}</td>
      <td>
        <div className="action-buttons">
          <Button size="sm" variant="outline-primary" onClick={() => handleEdit(deal)}><MdEdit /></Button>
          <Button size="sm" variant="outline-danger" onClick={() => handleDelete(deal)}><MdDelete /></Button>
        </div>
      </td>
    </tr>
  ), [dealStatuses, handleStatusChange, handleEdit, handleDelete]);

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
            <PageHeader icon={MdHandshake} title="Deals Management" />

            <SearchFilter
              searchTerm={search}
              onSearchChange={setSearch}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              statusOptions={dealStatuses}
              onAddClick={() => setShowModal(true)}
              addButtonText="Add Deal"
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
                <option value="title">Title</option>
                <option value="value">Value</option>
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
                icon={MdHandshake}
                title="Deals"
                data={deals}
                columns={['Title', 'Client', 'Value', 'Status', 'Close Date', 'Actions']}
                renderRow={renderRow}
                emptyMessage="No deals found"
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
              onHide={closeModal}
              title={editingDeal ? 'Edit Deal' : 'Add Deal'}
              onSubmit={handleSubmit}
            >
              <Row>
                <Col xs={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col xs={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Client</Form.Label>
                    <Form.Select
                      value={formData.clientId}
                      onChange={(e) => setFormData({...formData, clientId: e.target.value})}
                      required
                    >
                      <option value="">Select Client</option>
                      {clients.map(client => (
                        <option key={client.id} value={client.id}>{client.name}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col xs={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Value</Form.Label>
                    <Form.Control
                      type="number"
                      value={formData.value}
                      onChange={(e) => setFormData({...formData, value: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col xs={12}>
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
                <Col xs={12}>
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
      </div>
    </>
  );
};

export default DealsPage;