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
  const debouncedSearch = useDebounce(searchQuery, 400);
  const [deals, setDeals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      const metricsRes = await metricsAPI.getMetrics();
      setMetrics(metricsRes);

      const dealsParams = {
        limit: 5
      };
      if (debouncedSearch.trim()) dealsParams.q = debouncedSearch.trim();

      const activitiesParams = {
        limit: 5
      };
      if (debouncedSearch.trim()) activitiesParams.q = debouncedSearch.trim();

      const [dealsRes, activitiesRes] = await Promise.all([
        dealsAPI.getAll(dealsParams),
        activitiesAPI.getAll(activitiesParams),
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
          <Col xs={12} md={6} lg={3}>
            <KPI icon={<FaDollarSign />} value={`$${metrics.totalRevenue?.toLocaleString()}`} label="Revenue" color="green" />
          </Col>
          <Col xs={12} md={6} lg={3}>
            <KPI icon={<FaHandshake />} value={`$${metrics.activeDealsValue?.toLocaleString()}`} label="Deals Value" color="blue" />
          </Col>
          <Col xs={12} md={6} lg={3}>
            <KPI icon={<FaUsers />} value={metrics.activeClients} label="Clients" color="pink" />
          </Col>
          <Col xs={12} md={6} lg={3}>
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
                    {deals.map((d) => (
                      <tr key={d.id}>
                        <td>{d.title}</td>
                        <td>{d.status}</td>
                        <td>${Number(d.value || 0).toLocaleString()}</td>
                      </tr>
                    ))}
                    {deals.length === 0 && (
                      <tr>
                        <td colSpan="3" className="text-center text-muted">
                          {debouncedSearch ? "No deals found for your search" : "No recent deals"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="modern-table-card" style={{minHeight: '400px', display: 'flex', flexDirection: 'column'}}>
              <h5>{debouncedSearch ? "Search Results - Activities" : "Recent Activities"}</h5>
              <div style={{flex: 1}}>
                <Table>
                  <tbody>
                    {activities.map((a) => (
                      <tr key={a.id}>
                        <td>{a.type}</td>
                        <td>{a.message}</td>
                      </tr>
                    ))}
                    {activities.length === 0 && (
                      <tr>
                        <td colSpan="2" className="text-center text-muted">
                          {debouncedSearch ? "No activities found for your search" : "No recent activities"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
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
