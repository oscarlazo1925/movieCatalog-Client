// src/components/MoviesTable.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Container, Spinner } from "react-bootstrap";
import { Trash, Pencil, InfoCircle, Plus } from "react-bootstrap-icons";
import CommentsModal from "../components/CommentsModal";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import { useAuth } from "../context/AuthContext";
import UpdateModal from "./UpdateModal";
import AddMovieModal from "./AddMovieModal";

const MoviesTable = () => {
  const { user, token } = useAuth();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [selectedMovieTitle, setSelectedMovieTitle] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteBtnText, setDeleteBtnText] = useState("Delete");
  const [movieToDelete, setMovieToDelete] = useState(null);

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  // const [selectedMovie, setSelectedMovie] = useState(null);
  const [formDataUpdata, setFormDataUpdata] = useState({
    title: "",
    genre: "",
    director: "",
    year: "",
    description: "",
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [updateBtnText, setUpdateBtnText] = useState("Save Changes");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/movies/getMovies`)
      .then((res) => {
        setMovies(res.data.movies);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching movies:", err);
        setLoading(false);
      });
  }, []);

  // const handleUpdate = (id) => {
  //   console.log("Update movie with id:", id);
  //   // 👉 navigate to update form or open modal here
  // };

  const handleDelete = (id) => {
    //console.logid, "handleDelete");
    setDeleteBtnText("Deleting...");
    axios
      .delete(`${import.meta.env.VITE_BACKEND_URL}/movies/deleteMovie/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // 🔑 pass token here
        },
      })
      .then((res) => {
        //console.logres);
        setMovies(movies.filter((m) => m._id !== id));
        setDeleteBtnText("Delete");
        handleCloseDeleteModal(false);
      })
      .catch((error) => {
        setDeleteBtnText("Delete");
        console.error("Error deleting movie:", error);
      });
  };

  const handleGetComments = (movieId, title) => {
    setSelectedMovieId(movieId);
    setSelectedMovieTitle(title);
    setShowModal(true);
  };

  const confirmDelete = (movie) => {
    setMovieToDelete(movie);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    //console.logmovieToDelete._id, "handleConfirmDelete");
    if (movieToDelete) {
      handleDelete(movieToDelete._id);
    }
  };

  // movie update here
  const handleShowUpdate = (movie) => {
    //console.logmovie, "movie");
    setSelectedMovieId(movie._id);
    setFormDataUpdata({
      title: movie.title || "",
      genre: movie.genre || "",
      director: movie.director || "",
      year: movie.year || "",
      description: movie.description || "",
      comments: movie.comments.length || [],
    });
    setShowUpdateModal(true);
  };

  const handleChange = (e) => {
    //console.logformDataUpdata, "formDataUpdata");
    setFormDataUpdata({ ...formDataUpdata, [e.target.name]: e.target.value });
  };

  const handleClose = () => setShowUpdateModal(false);
  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  const handleUpdateMovie = async (e) => {
    //console.logselectedMovieId, "selectedMovieId");
    e.preventDefault();
    setUpdateBtnText("Saving....");
    try {
      const token = localStorage.getItem("token"); // or however you store it

      const res = await axios.patch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/movies/updateMovie/${selectedMovieId}`,
        formDataUpdata,
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ attach token
          },
        }
      );

      //console.logres, "res");

      // setMovies((prevMovies) =>
      //   prevMovies.map((m) =>
      //     m._id === selectedMovieId ? { ...m, ...res.data.updatedMovie } : m
      //   )
      // );

      //backend does not return the new data use optimistic update
      setMovies((prevMovies) =>
        prevMovies.map((m) =>
          m._id === selectedMovieId ? { ...m, ...formDataUpdata } : m
        )
      );
      setUpdateBtnText("Saving Changes");
      handleClose();
    } catch (err) {
      setUpdateBtnText("Saving Changes");
      console.error("Update failed:", err);
    }
  };

  // movie update here

  //console.loguser);
  if (!user || user.isAdmin !== true) {
    return (
      <Container className="py-4">
        <h4 className="text-center text-danger">
          🚫 Access Denied. Admins only.
        </h4>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <Spinner
          animation="border"
          variant="primary"
          style={{ width: "4rem", height: "4rem" }}
        />
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4 text-center">
        🎬 Movies Admin Table{" "}
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={24} /> Add Movie
        </Button>
      </h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Director</th>
            <th>Year</th>
            <th>Genre</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie, index) => (
            <tr key={movie._id}>
              <td>{index + 1}</td>
              <td>{movie.title}</td>
              <td>{movie.director}</td>
              <td>{movie.year}</td>
              <td>{movie.genre}</td>
              <td>
                {movie.description && movie.description.length > 60
                  ? movie.description.substring(0, 60) + "..."
                  : movie.description}
              </td>
              <td className="align-middle">
                <div className="d-flex justify-content-center align-items-center gap-2">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleShowUpdate(movie)}
                  >
                    <Pencil size={16} /> Update
                  </Button>

                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => confirmDelete(movie)}
                  >
                    <Trash size={16} /> Delete
                  </Button>

                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => handleGetComments(movie._id, movie.title)}
                  >
                    <InfoCircle size={16} /> Comments
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {/* Comments Modal */}
      <CommentsModal
        movieId={selectedMovieId}
        movieTitle={selectedMovieTitle}
        show={showModal}
        handleClose={() => setShowModal(false)}
      />

      <DeleteConfirmationModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        handleConfirm={() => handleConfirmDelete()}
        itemName={movieToDelete?.title}
        deleteBtnText={deleteBtnText}
      />

      <UpdateModal
        showUpdateModal={showUpdateModal}
        formDataUpdata={formDataUpdata}
        handleShowUpdate={handleShowUpdate}
        handleChange={handleChange}
        handleUpdateMovie={handleUpdateMovie}
        handleClose={() => setShowUpdateModal(false)}
        updateBtnText={updateBtnText}
      />

      <AddMovieModal
        show={showAddModal}
        handleCloseAddModal={() => setShowAddModal(false)}
        setMovies={setMovies}
      />
    </Container>
  );
};

export default MoviesTable;
