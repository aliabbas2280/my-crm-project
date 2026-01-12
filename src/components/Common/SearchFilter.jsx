import { Row, Col, Card, InputGroup, Form, Button } from 'react-bootstrap';
import { MdSearch, MdFilterList, MdAdd } from 'react-icons/md';

const SearchFilter = ({ 
  searchTerm, 
  onSearchChange, 
  statusFilter, 
  onStatusChange, 
  statusOptions, 
  onAddClick, 
  addButtonText,
  searchPlaceholder 
}) => (
  <Row className="mb-4">
    <Col>
      <Card className="search-filter-container">
        <Row className="align-items-center">
          <Col md={6}>
            <InputGroup>
              <InputGroup.Text><MdSearch /></InputGroup.Text>
              <Form.Control
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="search-input"
              />
            </InputGroup>
          </Col>
          <Col md={3}>
            <InputGroup>
              <InputGroup.Text><MdFilterList /></InputGroup.Text>
              <Form.Select
                value={statusFilter}
                onChange={(e) => onStatusChange(e.target.value)}
                className="search-input"
              >
                <option value="All">All Status</option>
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </Form.Select>
            </InputGroup>
          </Col>
          <Col md={3}>
            <Button
              className="btn-modern btn-primary-modern w-100"
              onClick={onAddClick}
            >
              <MdAdd className="me-2" />
              {addButtonText}
            </Button>
          </Col>
        </Row>
      </Card>
    </Col>
  </Row>
);

export default SearchFilter;