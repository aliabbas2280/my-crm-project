import { Row, Col, Card, InputGroup, Form, Button } from 'react-bootstrap';
import { MdSearch, MdFilterList, MdAdd } from 'react-icons/md';

const SearchFilter = ({ 
  searchTerm = '', 
  onSearchChange = () => {}, 
  statusFilter = 'All', 
  onStatusChange = () => {}, 
  statusOptions = [], 
  onAddClick = () => {}, 
  addButtonText = 'Add',
  searchPlaceholder = 'Search...'
}) => (
  <Row className="mb-4">
    <Col>
      <Card className="search-filter-container">
        <Row className="align-items-center g-2 p-2">
          <Col md={6}>
            <InputGroup>
              <InputGroup.Text aria-label="Search Icon"><MdSearch /></InputGroup.Text>
              <Form.Control
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="search-input"
                aria-label="Search input"
              />
            </InputGroup>
          </Col>
          <Col md={3}>
            <InputGroup>
              <InputGroup.Text aria-label="Filter Icon"><MdFilterList /></InputGroup.Text>
              <Form.Select
                value={statusFilter}
                onChange={(e) => onStatusChange(e.target.value)}
                className="search-input"
                aria-label="Status filter"
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
              aria-label={addButtonText}
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
