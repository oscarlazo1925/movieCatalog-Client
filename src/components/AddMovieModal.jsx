import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

const AddMovieModal = ({ show, handleCloseAddModal, setMovies }) => {
  const [addBtnText, setAddBtnText] = useState("Add Movie");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    genre: "",
    director: "",
    year: "",
  });

  const handleChangeAdd = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddMovie = async (e) => {
    e.preventDefault();
    setAddBtnText("Saving...");
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/movies/addMovie`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // backend should return the newly created movie
      const newMovie = res.data;

      // ✅ Add new movie to state
      setMovies((prevMovies) => [...prevMovies, newMovie]);

      handleCloseAddModal(); // close modal
      setFormData({ title: "", genre: "", director: "", year: "" }); // reset form
      setAddBtnText("Add Movie");
    } catch (err) {
      console.error("Failed to add movie:", err);
      setAddBtnText("Add Movie");
    }
  };

  return (
    <Modal show={show} onHide={handleCloseAddModal}>
      <Form onSubmit={handleAddMovie}>
        <Modal.Header closeButton>
          <Modal.Title>Add Movie</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-2">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChangeAdd}
              required
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChangeAdd}
              required
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Genre</Form.Label>
            <Form.Control
              type="text"
              name="genre"
              value={formData.genre}
              onChange={handleChangeAdd}
              required
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Director</Form.Label>
            <Form.Control
              type="text"
              name="director"
              value={formData.director}
              onChange={handleChangeAdd}
              required
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Year</Form.Label>
            <Form.Control
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChangeAdd}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddModal}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={addBtnText === "Saving..."}
          >
            {addBtnText}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddMovieModal;
