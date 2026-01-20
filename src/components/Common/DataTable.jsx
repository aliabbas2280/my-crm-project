import { Row, Col, Card, Table } from 'react-bootstrap';
import { MdArrowUpward, MdArrowDownward } from 'react-icons/md';
import '../../CSS/DataTable.css';

const DataTable = ({
  icon: Icon,
  title,
  data = [],
  columns = [],
  emptyMessage = "No data available",
  renderRow = () => null,
  sortBy,
  sortOrder,
  onSort
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
              </div>
            ) : (
              <div className="table-responsive">
                <Table className="modern-table mb-0">
                  <thead className="table-light sticky-top">
                    <tr>
                      {columns.map(col => {
                        const isActive = sortBy === col.key;
                        return (
                          <th
                            key={col.key}
                            onClick={col.sortable ? () => onSort(col.key) : undefined}
                            style={{ cursor: col.sortable ? 'pointer' : 'default', userSelect: 'none' }}
                          >
                            <span className="d-inline-flex align-items-center gap-1">
                              {col.label}
                              {col.sortable && (
                                isActive ? (
                                  sortOrder === 'asc' ? <MdArrowUpward /> : <MdArrowDownward />
                                ) : (
                                  <span className="d-inline-flex flex-column opacity-50">
                                    <MdArrowUpward size={16} />
                                    <MdArrowDownward size={16} />
                                  </span>
                                )
                              )}
                            </span>
                          </th>
                        );
                      })}
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
