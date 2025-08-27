import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Card, Spinner, Button } from "react-bootstrap";
import { ChatQuote, Person } from "react-bootstrap-icons";

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/movies/getMovie/${id}`)
      .then((res) => {
        console.log(res, "get movie details");
        setMovie(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching movie:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "90vh" }}
      >
        <Spinner
          animation="border"
          role="status"
          variant="primary"
          style={{ width: "4rem", height: "4rem" }}
        >
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (!movie) {
    return (
      <Container className="py-5 text-center">
        <h3>Movie not found</h3>
        <Button
          variant="secondary"
          onClick={() => navigate("/movies")}
          className="mt-3"
        >
          Back to Movies
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Card className="shadow-lg">
        <div className="position-relative">
          <Button
            variant="secondary"
            className="position-absolute top-0 end-0 m-3"
            onClick={() => navigate("/movies")}
          >
            ⬅ Back to Movies
          </Button>

          <Card.Img
            variant="top"
            src={
              movie.imageUrl ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5mr6VUkGwZo9t6jaUlGI-TLOma7Oz7DgL5w&s"
            }
            alt={movie.title}
            style={{ maxHeight: "400px", objectFit: "cover" }}
          />
        </div>
        <Card.Body>
          <Card.Title>{movie.title}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            Directed by: {movie.director}
          </Card.Subtitle>
          <Card.Text>
            <strong>Year:</strong> {movie.year} <br />
            <strong>Genre:</strong> {movie.genre} <br />
            <strong>Description:</strong> {movie.description}
          </Card.Text>

          {movie.comments && movie.comments.length > 0 && (
            <div>
              <h5 className="mt-4">💬 Comments</h5>
              {movie.comments.map((c) => (
                <div key={c._id} className="mb-2 border-bottom pb-2">
                  <strong>
                    <Person size={15} color="gray" />
                  </strong>{" "}
                  {c.userId} <br />
                  <div className="ms-4">
                    <ChatQuote size={15} color="gray" /> {c.comment}
                  </div>
                </div>
              ))}
            </div>
          )}

          <Button
            variant="secondary"
            className="mt-3"
            onClick={() => navigate("/movies")}
          >
            ⬅ Back to Movies
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default MovieDetail;
