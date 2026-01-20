import { Row, Col, Card, Table } from 'react-bootstrap';
import { MdArrowUpward, MdArrowDownward } from 'react-icons/md';
import '../../CSS/DataTable.css';

const DataTable = ({
  icon: Icon,
  title,
  data = [],
  columns = [], // [{ label: 'Name', key: 'name', sortable: true }]
  emptyMessage = "No data available",
  emptyDescription = "",
  renderRow = () => null,
  sortBy,
  sortOrder,
  onSort
}) => {

  const handleSort = (column) => {
    if (!column.sortable || !onSort) return;
    onSort(column.key);
  };

  const renderSortIcon = (column) => {
    if (!column.sortable) return null;
    if (sortBy !== column.key) return null;
    return sortOrder === 'asc' ? <MdArrowUpward size={16} className="ms-1" /> : <MdArrowDownward size={16} className="ms-1" />;
  };

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
              <div className="empty-state p-4 text-center">
                {Icon && <div className="empty-state-icon"><Icon size={48} /></div>}
                <h5 className="mt-3">{emptyMessage}</h5>
                <p className="text-muted">{emptyDescription}</p>
              </div>
            ) : (
              <div className="table-responsive">
                <Table className="modern-table mb-0">
                  <thead className="table-light sticky-top">
                    <tr>
                      {columns.map((column, index) => (
                        <th
                          key={typeof column === 'string' ? column : column.key || index}
                          onClick={() => {
                            const columnKey = typeof column === 'string' ? column.toLowerCase() : column.key;
                            if (typeof column === 'object' && column.sortable && onSort) {
                              onSort(columnKey);
                            }
                          }}
                          style={{ 
                            cursor: (typeof column === 'object' && column.sortable) ? 'pointer' : 'default'
                          }}
                        >
                          {typeof column === 'string' ? column : column.label}
                          {typeof column === 'object' && column.sortable && sortBy === column.key && (
                            sortOrder === 'asc' ? <MdArrowUpward size={16} className="ms-1" /> : <MdArrowDownward size={16} className="ms-1" />
                          )}
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
