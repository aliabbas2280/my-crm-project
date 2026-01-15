import { useEffect, useState, useMemo, useCallback } from "react";
import { Row, Col, Card, Table, Alert, Spinner } from "react-bootstrap";
import { MdMenu, MdClose } from "react-icons/md";
import { FaDollarSign, FaHandshake, FaUsers, FaChartLine } from "react-icons/fa";
import Header from "../../components/Layout/Header";
import AppNavbar from "../../components/Layout/Navbar";
import Pagination from "../../components/Common/Pagination";
import { dealsAPI, activitiesAPI, metricsAPI } from "../../utils/api";
import { useDebounce } from "../../hooks/useDebounce";
import "../../CSS/Dashboard.css";

const Dashboard = () => {
  // SERVER-SIDE: Search state - single source of truth
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Server-side state: data from API
  const [deals, setDeals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [totalDeals, setTotalDeals] = useState(0);
  const [totalActivities, setTotalActivities] = useState(0);
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    activeDealsValue: 0,
    activeClients: 0,
    conversionRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Pagination state
  const [dealsPage, setDealsPage] = useState(1);
  const [activitiesPage, setActivitiesPage] = useState(1);
  const dealsLimit = 5;
  const activitiesLimit = 4;

  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // MODIFIED: Memoized with useCallback
  const fetchDashboardData = useCallback(async (search = "") => {
    try {
      setLoading(true);
      setError("");

      // Always fetch metrics (not affected by search or pagination)
      const metricsRes = await metricsAPI.getMetrics();
      setMetrics(metricsRes);

      // Build params for deals and activities with pagination
      const dealsParams = { page: dealsPage, limit: dealsLimit };
      const activitiesParams = { page: activitiesPage, limit: activitiesLimit };
      
      if (search.trim()) {
        dealsParams.q = search.trim();
        activitiesParams.q = search.trim();
      }

      const [dealsRes, activitiesRes] = await Promise.all([
        dealsAPI.getAll(dealsParams),
        activitiesAPI.getAll(activitiesParams)
      ]);

      // Replace data from API response
      setDeals(dealsRes.data || dealsRes || []);
      setActivities(activitiesRes.data || activitiesRes || []);
      setTotalDeals(dealsRes.total || 0);
      setTotalActivities(activitiesRes.total || 0);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(err.message || "Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [dealsPage, activitiesPage]);

  // SERVER-SIDE: Handle search input changes
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Reset to page 1 when search changes
  useEffect(() => {
    setDealsPage(1);
    setActivitiesPage(1);
  }, [debouncedSearch]);

  // SERVER-SIDE: Fetch data when page or search changes
  useEffect(() => {
    fetchDashboardData(debouncedSearch);
  }, [debouncedSearch, fetchDashboardData]);

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger" className="m-4">{error}</Alert>;
  }

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
          <Header
            title="Dashboard"
            subtitle="Welcome back to your CRM dashboard"
            currentUser={JSON.parse(localStorage.getItem("currentUser") || "{}")}
            onSearch={handleSearch}
            searchValue={searchQuery}
          />

          <AppNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          <Row className="g-4 mb-4">
            <Col xs={12} sm={6} lg={3}>
              <Card className="modern-kpi-card">
                <div className="kpi-icon-wrapper green">
                  <FaDollarSign />
                </div>
                <div className="kpi-content">
                  <h3>${metrics.totalRevenue.toLocaleString()}</h3>
                  <p>Total Revenue</p>
                </div>
              </Card>
            </Col>
            <Col xs={12} sm={6} lg={3}>
              <Card className="modern-kpi-card">
                <div className="kpi-icon-wrapper blue">
                  <FaHandshake />
                </div>
                <div className="kpi-content">
                  <h3>${metrics.activeDealsValue.toLocaleString()}</h3>
                  <p>Active Deals Value</p>
                </div>
              </Card>
            </Col>
            <Col xs={12} sm={6} lg={3}>
              <Card className="modern-kpi-card">
                <div className="kpi-icon-wrapper pink">
                  <FaUsers />
                </div>
                <div className="kpi-content">
                  <h3>{metrics.activeClients}</h3>
                  <p>Active Clients</p>
                </div>
              </Card>
            </Col>
            <Col xs={12} sm={6} lg={3}>
              <Card className="modern-kpi-card">
                <div className="kpi-icon-wrapper purple">
                  <FaChartLine />
                </div>
                <div className="kpi-content">
                  <h3>{metrics.conversionRate}%</h3>
                  <p>Conversion Rate</p>
                </div>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Card className="modern-table-card">
                <h5>{searchQuery.trim() ? 'Search Results - Deals' : 'Recent Deals'}</h5>
                <Table>
                  <thead>
                    <tr>
                      <th>Deal</th>
                      <th>Status</th>
                      <th>Value</th>
                    </tr>
                  </thead>
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
                          {searchQuery.trim() ? 'No deals found for your search' : 'No recent deals'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
                {totalDeals > 0 && (
                  <Pagination
                    currentPage={dealsPage}
                    totalRecords={totalDeals}
                    limit={dealsLimit}
                    onPageChange={setDealsPage}
                  />
                )}
              </Card>
            </Col>

            <Col md={6}>
              <Card className="modern-table-card">
                <h5>{searchQuery.trim() ? 'Search Results - Activities' : 'Recent Activities'}</h5>
                <Table>
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Message</th>
                    </tr>
                  </thead>
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
                          {searchQuery.trim() ? 'No activities found for your search' : 'No recent activities'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
                {totalActivities > 0 && (
                  <Pagination
                    currentPage={activitiesPage}
                    totalRecords={totalActivities}
                    limit={activitiesLimit}
                    onPageChange={setActivitiesPage}
                  />
                )}
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
