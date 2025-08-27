import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function UpdateModal({
  showUpdateModal,
  formDataUpdata,
  handleChange,
  handleUpdateMovie,
  handleClose,
  updateBtnText,
}) {
  //console.logformDataUpdata.comments);
  return (
    <>
      <Modal show={showUpdateModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            Update Movie{" "}
            {formDataUpdata.comments > 0
              ? formDataUpdata.comments +
                ` ${formDataUpdata.comments > 1 ? "Comments" : "Comment"}`
              : ""}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formDataUpdata.title}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={formDataUpdata.description}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Director</Form.Label>
              <Form.Control
                type="text"
                name="director"
                value={formDataUpdata.director}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Year</Form.Label>
              <Form.Control
                type="text"
                name="year"
                value={formDataUpdata.year}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Genre</Form.Label>
              <Form.Control
                type="text"
                name="genre"
                value={formDataUpdata.genre}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleUpdateMovie}
            disabled={updateBtnText === "Saving..."}
          >
            {updateBtnText}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
