import { Modal, Form, Button } from 'react-bootstrap';

const FormModal = ({ 
  show, 
  onHide, 
  title, 
  onSubmit = (e) => e.preventDefault(), 
  submitText, 
  children 
}) => (
  <Modal show={show} onHide={onHide} size="lg" centered>
    <Modal.Header closeButton>
      <Modal.Title>{title}</Modal.Title>
    </Modal.Header>
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(e);
      }}
    >
      <Modal.Body>
        {children}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button type="submit" className="btn-primary-modern">
          {submitText || 'Submit'}
        </Button>
      </Modal.Footer>
    </Form>
  </Modal>
);

export default FormModal;
