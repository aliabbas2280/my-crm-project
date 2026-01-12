import { Row, Col } from 'react-bootstrap';

const PageHeader = ({ icon: Icon, title }) => (
  <Row className="mb-4">
    <Col>
      <h1 className="dashboard-header">
        <Icon className="me-2" />
        {title}
      </h1>
    </Col>
  </Row>
);

export default PageHeader;