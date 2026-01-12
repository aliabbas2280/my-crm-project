import { useEffect, useState } from "react";
import { Row, Col, Card, Table } from "react-bootstrap";
import { MdPeople,MdHandshake, MdAttachMoney,MdTrendingUp, MdHistory, MdMenu} from "react-icons/md";
import Header from '../../components/Layout/Header';
import AppNavbar from '../../components/Layout/Navbar';
import { dashboardAPI } from '../../utils/api';
import '../../CSS/Dashboard.css';

const Dashboard = () => {
  const [data, setData] = useState({
    clients: [],
    deals: [],
    activities: []
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filteredData, setFilteredData] = useState({
    deals: [],
    activities: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const dashboardData = await dashboardAPI.getStats();
      setData(dashboardData);
     
      setFilteredData({
        deals: dashboardData.deals,
        activities: dashboardData.activities
      });
    } catch (error) {
      console.error("Dashboard load failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredData({
        deals: data.deals,
        activities: data.activities
      });
      return;
    }

    const filtered = {
      deals: data.deals.filter(deal => 
        deal.title?.toLowerCase().includes(term.toLowerCase()) ||
        deal.status?.toLowerCase().includes(term.toLowerCase())
      ),
      activities: data.activities.filter(activity => 
        activity.message?.toLowerCase().includes(term.toLowerCase()) ||
        activity.type?.toLowerCase().includes(term.toLowerCase())
      )
    };
    setFilteredData(filtered);
  };

  const totalClients = data.clients.length;
  const activeClients = data.clients.filter(c => c.status === 'Active').length;

  const activeDealsList = data.deals.filter(
    d => !['Won', 'Lost'].includes(d.status)
  );

  const wonDeals = data.deals.filter(d => d.status === 'Won');

  const totalRevenue = wonDeals.reduce(
    (sum, deal) => sum + Number(deal.value || 0),
    0
  );

  const activeDealsValue = activeDealsList.reduce(
    (sum, deal) => sum + Number(deal.value || 0),
    0
  );

  const conversionRate = data.deals.length
    ? Math.round((wonDeals.length / data.deals.length) * 100)
    : 0;


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
                <h3 className="kpi-value">${totalRevenue.toLocaleString()}</h3>
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
                <h3 className="kpi-value">${activeDealsValue.toLocaleString()}</h3>
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
                <h3 className="kpi-value">{activeClients}</h3>
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
                <h3 className="kpi-value">{conversionRate}%</h3>
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
                  <div className="kpi-icon-wrapper blue" style={{width: '32px', height: '32px', fontSize: '16px'}}>
                    <MdHandshake />
                  </div>
                  
                </div>
              </div>

              <div className="table-content">
                {filteredData.deals.length === 0 ? (
                  <div className="empty-state">
              
                    <div className="kpi-icon-wrapper blue" style={{width: '64px', height: '64px', fontSize: '32px', margin: '0 auto 16px'}}>
                      <MdHandshake />
                    </div>
                    <h5>{searchTerm ? 'No matching deals' : 'No deals yet'}</h5>
                    <p>{searchTerm ? 'Try different search terms' : 'Start by creating your first deal'}</p>
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
                      {(searchTerm ? filteredData.deals : filteredData.deals.slice(-5)).reverse().map(deal => (
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
                  <div className="kpi-icon-wrapper purple" style={{width: '32px', height: '32px', fontSize: '16px'}}>
                    <MdHistory />
                  </div>
                 
                </div>
              </div>

              <div className="table-content">
                {filteredData.activities.length === 0 ? (
                  <div className="empty-state">
            
                    <div className="kpi-icon-wrapper purple" style={{width: '64px', height: '64px', fontSize: '32px', margin: '0 auto 16px'}}>
                      <MdHistory />
                    </div>
                    <h5>{searchTerm ? 'No matching activities' : 'No activities yet'}</h5>
                    <p>{searchTerm ? 'Try different search terms' : 'Activities will appear here'}</p>
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
                     
                      {(searchTerm ? filteredData.activities : filteredData.activities.slice(-4)).reverse().map(activity => (
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
