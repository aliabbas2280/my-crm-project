import { useState, useEffect, useCallback, useRef } from 'react';
import { Container, Button, Form } from 'react-bootstrap';
import { MdHandshake, MdEdit, MdDelete, MdMenu, MdClose } from 'react-icons/md';
import AppNavbar from '../components/Layout/Navbar';
import PageHeader from '../components/Common/PageHeader';
import SearchFilter from '../components/Common/SearchFilter';
import DataTable from '../components/Common/DataTable';
import FormModal from '../components/Common/FormModal';
import LoadingSpinner from '../components/Common/LoadingSpinner';

import { useAuth } from '../hooks/useAuth';
import { useDebounce } from '../hooks/useDebounce';
import { usePagination } from '../hooks/usePagination';

import { dealsAPI, clientsAPI, activitiesAPI } from '../utils/api';

import '../CSS/Dashboard.css';
import '../CSS/FormResponsive.css';

const DealsPage = () => {
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();

  const { currentPage, limit, goToPage, resetPage } = usePagination(5);

  const [deals, setDeals] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const debouncedSearch = useDebounce(search, 800);

  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const tableRef = useRef(null); // ✅ updated ref

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

  // Handle column sorting when header is clicked
  const handleSort = (columnKey) => {
    if (sortBy === columnKey) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(columnKey);
      setSortOrder('asc');
    }
  };

  const fetchClients = async () => {
      try {
        const res = await clientsAPI.getAll();
      setClients(res.data || []);
      } catch (e) {
      console.error(e);
      }
  };

  const fetchDeals = useCallback(async () => {
    try {
      setLoading(true);

      const params = {
        page: currentPage,
        limit,
        sort: sortBy,
        order: sortOrder
      };

      if (debouncedSearch.trim()) params.q = debouncedSearch.trim();
      if (statusFilter !== 'All') params.status = statusFilter;

      const res = await dealsAPI.getAll(params);
      
      // Batch state updates to prevent multiple re-renders
      setDeals(res.data || []);
      setTotalRecords(res.total || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit, debouncedSearch, statusFilter, sortBy, sortOrder]);

  useEffect(() => {
    resetPage();
  }, [debouncedSearch, statusFilter, sortBy, sortOrder, resetPage]);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  useEffect(() => {
    fetchClients();
  }, []);

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
    const client = clients.find(c => c.id === formData.clientId);
    const payload = {
      ...formData,
      clientName: client?.name || '',
      userId: user?.id,
      userName: user?.name
    };

    try {
      if (editingDeal) {
        await dealsAPI.update(editingDeal.id, payload);
      } else {
        await dealsAPI.create(payload);
      }

      await activitiesAPI.create({
        type: editingDeal ? 'deal_updated' : 'deal_created',
        message: editingDeal
          ? `Deal "${payload.title}" updated`
          : `New deal "${payload.title}" created`,
        userId: user?.id
      });

      await fetchDeals();
      closeModal();
    } catch (e) {
      alert('Save failed');
    }
  };

  const handleDelete = useCallback(async (deal) => {
    if (!window.confirm(`Delete deal "${deal.title}"?`)) return;
    try {
    await dealsAPI.delete(deal.id);
      await fetchDeals();
    } catch (e) {
      console.error(e);
    }
  }, [fetchDeals]);

  const handleStatusChange = useCallback(async (deal, status) => {
    try {
    await dealsAPI.update(deal.id, { ...deal, status });
      await fetchDeals();
    } catch (e) {
      console.error(e);
    }
  }, [fetchDeals]);

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

  const renderRow = (deal) => (
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
          {dealStatuses.map(s => <option key={s}>{s}</option>)}
        </Form.Select>
      </td>
      <td>{deal.expectedCloseDate || '—'}</td>
      <td>
        <div className="action-buttons">
        <Button size="sm" variant="outline-primary" onClick={() => handleEdit(deal)}>
          <MdEdit />
          </Button>
        <Button size="sm" variant="outline-danger" onClick={() => handleDelete(deal)}>
          <MdDelete />
        </Button>
        </div>
      </td>
    </tr>
  );

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <button
        type="button"
        className="hamburger-menu d-lg-none"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <MdClose /> : <MdMenu />}
      </button>

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

            <div className="mb-3 d-flex gap-2 align-items-center">
              <Form.Label className="mb-0">Sort by:</Form.Label>
              <Form.Select style={{ width: '150px' }} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="createdAt">Date Created</option>
                <option value="title">Title</option>
                <option value="value">Value</option>
                <option value="status">Status</option>
                <option value="clientName">Client</option>
              </Form.Select>

              <Form.Select style={{ width: '120px' }} value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </Form.Select>
            </div>

            <div ref={tableRef} style={{minHeight: '500px', display: 'flex', flexDirection: 'column'}}>
              <div style={{flex: 1}}>
            <DataTable
              icon={MdHandshake}
              title="Deals List"
              data={deals}
              columns={[
                { label: 'Title', key: 'title', sortable: true },
                { label: 'Client', key: 'clientName', sortable: true },
                { label: 'Value', key: 'value', sortable: true },
                { label: 'Status', key: 'status', sortable: false },
                { label: 'Close Date', key: 'expectedCloseDate', sortable: false },
                { label: 'Actions', key: 'actions', sortable: false }
              ]}
              renderRow={renderRow}
              emptyMessage="No deals found"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
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
            onHide={closeModal}
              title={editingDeal ? 'Edit Deal' : 'Add New Deal'}
            onSubmit={handleSubmit}
            submitText={editingDeal ? 'Update Deal' : 'Add Deal'}
          >
              <Form.Group className="mb-3">
                <Form.Label>Deal Title *</Form.Label>
                <Form.Control
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Client *</Form.Label>
                <Form.Select
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                  required
                >
                  <option value="">Select Client</option>
                  {clients.map(client => <option key={client.id} value={client.id}>{client.name} - {client.company}</option>)}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Deal Value *</Form.Label>
                <Form.Control
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  {dealStatuses.map(status => <option key={status} value={status}>{status}</option>)}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Expected Close Date</Form.Label>
                <Form.Control
                  type="date"
                  value={formData.expectedCloseDate}
                  onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
                />
              </Form.Group>
          </FormModal>
        </Container>
        </div>
      </div>
    </>
  );
};

export default DealsPage;
