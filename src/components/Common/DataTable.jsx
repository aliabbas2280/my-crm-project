import { Row, Col, Card, Table } from 'react-bootstrap';
import '../../CSS/DataTable.css';

const DataTable = ({ 
  icon: Icon, 
  title, 
  data = [], 
  columns = [], 
  emptyMessage = "No data available", 
  emptyDescription = "", 
  renderRow = () => null
}) => {
return (
  <Row>
    <Col>
      <Card className="content-card">
        <Card.Header className="d-flex justify-content-between align-items-center flex-wrap">
          <div className="d-flex align-items-center">
            {Icon && <Icon className="me-2" />}
            <span>{title}</span>
            <small className="text-muted ms-2">({data.length})</small>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          {data.length === 0 ? (
            <div className="empty-state p-4">
              {Icon && <div className="empty-state-icon"><Icon size={48} /></div>}
              <h5 className="mt-3">{emptyMessage}</h5>
              <p className="text-muted">{emptyDescription}</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table className="modern-table mb-0">
                <thead className="table-light sticky-top">
                  <tr>
                    {columns.map((column) => (
                      <th key={column}>
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map(renderRow)}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </Col>
  </Row>
  );
};

export default DataTable;