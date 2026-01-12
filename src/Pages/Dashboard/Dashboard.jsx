import { useEffect, useState, useCallback } from "react";
import { Row, Col, Card, Table, Form } from "react-bootstrap";
import { MdPeople,MdHandshake, MdAttachMoney,MdTrendingUp, MdHistory, MdMenu} from "react-icons/md";
import Header from '../../components/Layout/Header';
import AppNavbar from '../../components/Layout/Navbar';
import { dashboardAPI, dealsAPI, activitiesAPI, clientsAPI } from '../../utils/api';
import { useDebounce } from '../../hooks/useDebounce';
import '../../CSS/Dashboard.css';

const Dashboard = () => {
  const [data, setData] = useState({
    clients: [],
    deals: [],
    activities: [],
    kpis: { totalRevenue: 0, activeDealsValue: 0, activeClients: 0, conversionRate: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dealStatus, setDealStatus] = useState('');
  const [activityType, setActivityType] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const debouncedSearch = useDebounce(searchTerm, 300);
  const debouncedDealStatus = useDebounce(dealStatus, 300);
  const debouncedActivityType = useDebounce(activityType, 300);

  const calculateKPIs = useCallback((clients, deals) => {
    const activeClients = clients.filter(c => c.status === 'Active').length;
    const wonDeals = deals.filter(d => d.status === 'Won');
    const activeDealsList = deals.filter(d => !['Won', 'Lost'].includes(d.status));
    
    const totalRevenue = wonDeals.reduce((sum, deal) => sum + Number(deal.value || 0), 0);
    const activeDealsValue = activeDealsList.reduce((sum, deal) => sum + Number(deal.value || 0), 0);
    const conversionRate = deals.length ? Math.round((wonDeals.length / deals.length) * 100) : 0;
    
    return { totalRevenue, activeDealsValue, activeClients, conversionRate };
  }, []);

  const fetchFilteredData = useCallback(async () => {
    setLoading(true);
    try {
      const dealParams = {};
      const activityParams = {};
      
      if (debouncedSearch) {
        dealParams.title_like = debouncedSearch;
        activityParams.message_like = debouncedSearch;
      }
      if (debouncedDealStatus) {
        dealParams.status = debouncedDealStatus;
      }
      if (debouncedActivityType) {
        activityParams.type = debouncedActivityType;
      }

      const [clients, deals, activities] = await Promise.all([
        clientsAPI.getAll(),
        dealsAPI.getAll(dealParams),
        activitiesAPI.getAll(activityParams)
      ]);

      const kpis = calculateKPIs(clients, deals);
      
      setData({ clients, deals, activities, kpis });
    } catch (error) {
      console.error("Dashboard load failed", error);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, debouncedDealStatus, debouncedActivityType, calculateKPIs]);

  useEffect(() => {
    fetchFilteredData();
  }, [fetchFilteredData]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleDealStatusChange = (e) => {
    setDealStatus(e.target.value);
  };

  const handleActivityTypeChange = (e) => {
    setActivityType(e.target.value);
  };


  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <>
      <button 
        className="hamburger-menu d-lg-none" 
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <MdMenu />
      </button>
      
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
      
      <div className="dashboard-container">
        <div className="dashboard-content">

        <Header
          title="Dashboard"
          subtitle="Welcome back to your CRM dashboard"
          currentUser={{ name: 'Ali Abbas' }}
         
          onSearch={handleSearch}
          searchValue={searchTerm}
        />
        
        <AppNavbar sidebarOpen={sidebarOpen} />
        <Row className="g-4 mb-4">
          <Col xs={12} sm={6} lg={3}>
            <Card className="modern-kpi-card">
              <div className="kpi-header">
                <div className="kpi-icon-wrapper green">
                  <MdAttachMoney className="kpi-icon" />
                </div>
              </div>
              <div className="kpi-content">
                <h3 className="kpi-value">${data.kpis.totalRevenue.toLocaleString()}</h3>
                <p className="kpi-label">Total Revenue</p>
              </div>
            </Card>
          </Col>

          <Col xs={12} sm={6} lg={3}>
            <Card className="modern-kpi-card">
              <div className="kpi-header">
                <div className="kpi-icon-wrapper blue">
                  <MdHandshake className="kpi-icon" />
                </div>
              </div>
              <div className="kpi-content">
                <h3 className="kpi-value">${data.kpis.activeDealsValue.toLocaleString()}</h3>
                <p className="kpi-label">Active Deals Value</p>
              </div>
            </Card>
          </Col>

          <Col xs={12} sm={6} lg={3}>
            <Card className="modern-kpi-card">
              <div className="kpi-header">
                <div className="kpi-icon-wrapper purple">
                  <MdPeople className="kpi-icon" />
                </div>
              </div>
              <div className="kpi-content">
                <h3 className="kpi-value">{data.kpis.activeClients}</h3>
                <p className="kpi-label">Active Clients</p>
              </div>
            </Card>
          </Col>

          <Col xs={12} sm={6} lg={3}>
            <Card className="modern-kpi-card">
              <div className="kpi-header">
                <div className="kpi-icon-wrapper pink">
                  <MdTrendingUp className="kpi-icon" />
                </div>
              </div>
              <div className="kpi-content">
                <h3 className="kpi-value">{data.kpis.conversionRate}%</h3>
                <p className="kpi-label">Conversion Rate</p>
              </div>
            </Card>
          </Col>

        </Row>
        
        <Row>
         
          <Col md={7}>
            <Card className="modern-table-card">
              <div className="table-header">
                <h5 className="table-title">Recent Deals</h5>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <Form.Select 
                    size="sm" 
                    value={dealStatus} 
                    onChange={handleDealStatusChange}
                    style={{width: '120px'}}
                  >
                    <option value="">All Status</option>
                    <option value="Won">Won</option>
                    <option value="Lost">Lost</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Qualified">Qualified</option>
                  </Form.Select>
                  <div className="kpi-icon-wrapper blue" style={{width: '32px', height: '32px', fontSize: '16px'}}>
                    <MdHandshake />
                  </div>
                </div>
              </div>

              <div className="table-content">
                {loading ? (
                  <div className="text-center p-3">
                    <div className="spinner-border spinner-border-sm" role="status"></div>
                  </div>
                ) : data.deals.length === 0 ? (
                  <div className="empty-state">
                    <div className="kpi-icon-wrapper blue" style={{width: '64px', height: '64px', fontSize: '32px', margin: '0 auto 16px'}}>
                      <MdHandshake />
                    </div>
                    <h5>{searchTerm || dealStatus ? 'No matching deals' : 'No deals yet'}</h5>
                    <p>{searchTerm || dealStatus ? 'Try different search terms or filters' : 'Start by creating your first deal'}</p>
                  </div>
                ) : (
                 <div className="table-responsive">
                  <Table className="modern-table">
                    <thead>
                      <tr>
                        <th>Deal Name</th>
                        <th>Status</th>
                        <th>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.deals.slice(-5).reverse().map(deal => (
                        <tr key={deal.id}>
                          <td>{deal.title}</td>
                          <td>{deal.status}</td>
                          <td>${Number(deal.value || 0).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  </div>
                )}
              </div>
            </Card>
          </Col>

          <Col md={5}>
            <Card className="modern-table-card">
              <div className="table-header">
                 <h5 className="table-title">Recent Activities</h5>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <Form.Select 
                    size="sm" 
                    value={activityType} 
                    onChange={handleActivityTypeChange}
                    style={{width: '120px'}}
                  >
                    <option value="">All Types</option>
                    <option value="Call">Call</option>
                    <option value="Email">Email</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Note">Note</option>
                  </Form.Select>
                  <div className="kpi-icon-wrapper purple" style={{width: '32px', height: '32px', fontSize: '16px'}}>
                    <MdHistory />
                  </div>
                </div>
              </div>

              <div className="table-content">
                {loading ? (
                  <div className="text-center p-3">
                    <div className="spinner-border spinner-border-sm" role="status"></div>
                  </div>
                ) : data.activities.length === 0 ? (
                  <div className="empty-state">
                    <div className="kpi-icon-wrapper purple" style={{width: '64px', height: '64px', fontSize: '32px', margin: '0 auto 16px'}}>
                      <MdHistory />
                    </div>
                    <h5>{searchTerm || activityType ? 'No matching activities' : 'No activities yet'}</h5>
                    <p>{searchTerm || activityType ? 'Try different search terms or filters' : 'Activities will appear here'}</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                  <Table className="modern-table">
                    <thead>
                      <tr>
                        <th>Activity</th>
                        <th>Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.activities.slice(-4).reverse().map(activity => (
                        <tr key={activity.id}>
                          <td>{activity.type}</td>
                          <td>{activity.message}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  </div>
                )}
              </div>
            </Card>
          </Col>
        </Row>

      </div>
    </div>
    </>
  );
};

export default Dashboard;
