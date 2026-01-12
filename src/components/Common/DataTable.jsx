import { Row, Col, Card, Table } from 'react-bootstrap';

const DataTable = ({ 
  icon: Icon, 
  title, 
  data, 
  columns, 
  emptyMessage, 
  emptyDescription,
  renderRow 
}) => (
  <Row>
    <Col>
      <Card className="content-card">
        <Card.Header>
          <Icon className="me-2" />
          {title} ({data.length})
        </Card.Header>
        <Card.Body>
          {data.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><Icon /></div>
              <h5>{emptyMessage}</h5>
              <p>{emptyDescription}</p>
            </div>
          ) : (
            <Table responsive className="modern-table">
              <thead>
                <tr>
                  {columns.map(column => (
                    <th key={column}>{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map(renderRow)}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Col>
  </Row>
);

export default DataTable;