import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

const AddMovieModal = ({ show, handleCloseAddModal, setMovies }) => {
    const [addBtnText, setAddBtnText] = useState("Add Movie")
  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    director: "",
    year: "",
  });

  const handleChangeAdd = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddMovie = async () => {
    setAddBtnText("Saving...")
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
      setAddBtnText("Add Movie")
    } catch (err) {
      console.error("Failed to add movie:", err);
      setAddBtnText("Add Movie")
    }
  };

  return (
    <Modal show={show} onHide={handleCloseAddModal}>
      <Modal.Header closeButton>
        <Modal.Title>Add Movie</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChangeAdd}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChangeAdd}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Genre</Form.Label>
            <Form.Control
              type="text"
              name="genre"
              value={formData.genre}
              onChange={handleChangeAdd}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Director</Form.Label>
            <Form.Control
              type="text"
              name="director"
              value={formData.director}
              onChange={handleChangeAdd}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Year</Form.Label>
            <Form.Control
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChangeAdd}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseAddModal}>
          Cancel
        </Button>
        <Button
        variant="primary"
        onClick={handleAddMovie}
        disabled = {addBtnText === "Saving..."}
        >
          {addBtnText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddMovieModal;
