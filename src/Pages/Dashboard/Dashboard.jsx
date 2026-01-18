import { useEffect, useState } from "react";
import { Row, Col, Card, Table, Alert, Spinner } from "react-bootstrap";
import { MdMenu, MdClose } from "react-icons/md";
import { FaDollarSign, FaHandshake, FaUsers, FaChartLine } from "react-icons/fa";
import Header from "../../components/Layout/Header";
import AppNavbar from "../../components/Layout/Navbar";
import { dealsAPI, activitiesAPI, metricsAPI } from "../../utils/api";
import { useDebounce } from "../../hooks/useDebounce";
import { useAuth } from "../../hooks/useAuth";
import "../../CSS/Dashboard.css";

const Dashboard = () => {
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();
  
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 800);
  const [deals, setDeals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dealsCurrentPage, setDealsCurrentPage] = useState(1);
  const [activitiesCurrentPage, setActivitiesCurrentPage] = useState(1);
  const dealsItemsPerPage = 5;
  const activitiesItemsPerPage = 4;

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      const metricsRes = await metricsAPI.getMetrics();
      setMetrics(metricsRes);

      const [dealsRes, activitiesRes] = await Promise.all([
        dealsAPI.getAll(),
        activitiesAPI.getAll(),
      ]);

      
      setDeals(dealsRes.data || []);
      setActivities(activitiesRes.data || []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);


  const filteredDeals = deals.filter(
    (d) =>
      d.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      d.status?.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const filteredActivities = activities.filter(
    (a) =>
      a.type?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      a.message?.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const dealsTotalPages = Math.ceil(filteredDeals.length / dealsItemsPerPage);
  const paginatedDeals = filteredDeals.slice(
    (dealsCurrentPage - 1) * dealsItemsPerPage,
    dealsCurrentPage * dealsItemsPerPage
  );

  const activitiesTotalPages = Math.ceil(filteredActivities.length / activitiesItemsPerPage);
  const paginatedActivities = filteredActivities.slice(
    (activitiesCurrentPage - 1) * activitiesItemsPerPage,
    activitiesCurrentPage * activitiesItemsPerPage
  );

  useEffect(() => {
    setDealsCurrentPage(1);
    setActivitiesCurrentPage(1);
  }, [debouncedSearch]);

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <>
      <button
        className="hamburger-menu d-lg-none"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <MdClose /> : <MdMenu />}
      </button>

      <div className="dashboard-container" style={{padding: '2rem'}}>
        <Header
          title="Dashboard"
          subtitle={`Welcome back, ${user?.name || 'User'}`}
          onSearch={setSearchQuery}
          searchValue={searchQuery}
        />

        <AppNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <Row className="g-4 mb-4">
          <Col lg={3}>
            <KPI icon={<FaDollarSign />} value={`$${metrics.totalRevenue?.toLocaleString()}`} label="Revenue" color="green" />
          </Col>
          <Col lg={3}>
            <KPI icon={<FaHandshake />} value={`$${metrics.activeDealsValue?.toLocaleString()}`} label="Deals Value" color="blue" />
          </Col>
          <Col lg={3}>
            <KPI icon={<FaUsers />} value={metrics.activeClients} label="Clients" color="pink" />
          </Col>
          <Col lg={3}>
            <KPI icon={<FaChartLine />} value={`${metrics.conversionRate}%`} label="Conversion" color="purple" />
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Card className="modern-table-card" style={{minHeight: '400px', display: 'flex', flexDirection: 'column'}}>
              <h5>{debouncedSearch ? "Search Results - Deals" : "Recent Deals"}</h5>
              <div style={{flex: 1}}>
                <Table>
                  <tbody>
                    {paginatedDeals.map((d) => (
                      <tr key={d.id}>
                        <td>{d.title}</td>
                        <td>{d.status}</td>
                        <td>${Number(d.value || 0).toLocaleString()}</td>
                      </tr>
                    ))}
                    {filteredDeals.length === 0 && (
                      <tr>
                        <td colSpan="3" className="text-center text-muted">
                          {debouncedSearch ? "No deals found for your search" : "No recent deals"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
              {filteredDeals.length > 0 && (
                <div className="pagination-container" style={{marginTop: 'auto'}}>
                  <div className="pagination-info">
                    Showing {(dealsCurrentPage - 1) * dealsItemsPerPage + 1} to {Math.min(dealsCurrentPage * dealsItemsPerPage, filteredDeals.length)} of {filteredDeals.length}
                  </div>
                  <div className="pagination-controls">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => setDealsCurrentPage(p => Math.max(1, p - 1))}
                      disabled={dealsCurrentPage === 1}
                    >
                      Previous
                    </button>
                    <span className="mx-2">Page {dealsCurrentPage} of {dealsTotalPages}</span>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => setDealsCurrentPage(p => Math.min(dealsTotalPages, p + 1))}
                      disabled={dealsCurrentPage === dealsTotalPages}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </Card>
          </Col>

          <Col md={6}>
            <Card className="modern-table-card" style={{minHeight: '400px', display: 'flex', flexDirection: 'column'}}>
              <h5>{debouncedSearch ? "Search Results - Activities" : "Recent Activities"}</h5>
              <div style={{flex: 1}}>
                <Table>
                  <tbody>
                    {paginatedActivities.map((a) => (
                      <tr key={a.id}>
                        <td>{a.type}</td>
                        <td>{a.message}</td>
                      </tr>
                    ))}
                    {filteredActivities.length === 0 && (
                      <tr>
                        <td colSpan="2" className="text-center text-muted">
                          {debouncedSearch ? "No activities found for your search" : "No recent activities"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
              {filteredActivities.length > 0 && (
                <div className="pagination-container" style={{marginTop: 'auto'}}>
                  <div className="pagination-info">
                    Showing {(activitiesCurrentPage - 1) * activitiesItemsPerPage + 1} to {Math.min(activitiesCurrentPage * activitiesItemsPerPage, filteredActivities.length)} of {filteredActivities.length}
                  </div>
                  <div className="pagination-controls">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => setActivitiesCurrentPage(p => Math.max(1, p - 1))}
                      disabled={activitiesCurrentPage === 1}
                    >
                      Previous
                    </button>
                    <span className="mx-2">Page {activitiesCurrentPage} of {activitiesTotalPages}</span>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => setActivitiesCurrentPage(p => Math.min(activitiesTotalPages, p + 1))}
                      disabled={activitiesCurrentPage === activitiesTotalPages}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

const KPI = ({ icon, value, label, color }) => (
  <Card className="modern-kpi-card">
    <div className="kpi-content">
      <div className={`kpi-icon-wrapper ${color}`}>{icon}</div>
      <h3>{value}</h3>
      <p>{label}</p>
    </div>
  </Card>
);

export default Dashboard;
