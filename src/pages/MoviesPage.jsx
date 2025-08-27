// src/pages/MoviesPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Badge,
  Button,
} from "react-bootstrap";
import { ChatQuote, Person } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom"; // ✅ for navigation

const MoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  const navigate = useNavigate(); // ✅ hook for redirect

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/movies/getMovies`)
      .then((res) => {
        //console.log.log(res.data.movies,'res')
        setMovies(res.data.movies);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching movies:", err);
        setLoading(false);
      });
  }, []);

  const toggleReadMore = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

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

  return (
    <Container className="py-4">
      <h2 className="mb-4 text-center">🎬 All Movies</h2>
      <Row>
        {movies.map((movie) => {
          const isExpanded = expanded[movie._id] || false;

          const displayDescription =
            movie.description && !isExpanded && movie.description.length > 120
              ? movie.description.substring(0, 120) + "..."
              : movie.description;

          const lastFiveComments = movie.comments
            ? movie.comments.slice(-2)
            : [];

          return (
            <Col key={movie._id} md={6} lg={4} className="mb-4">
              <Card className="shadow-sm h-100">
                <Card.Img
                  variant="top"
                  src={
                    movie.imageUrl ||
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5mr6VUkGwZo9t6jaUlGI-TLOma7Oz7DgL5w&s"
                  }
                  alt={movie.title}
                  style={{ height: "180px", objectFit: "cover" }}
                />

                <Card.Body className="d-flex flex-column">
                  <Card.Title>{movie.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    Directed by: {movie.director}
                  </Card.Subtitle>
                  <Card.Text>
                    <strong>Year:</strong> {movie.year} <br />
                    <strong>Genre:</strong> {movie.genre} <br />
                    <strong>Description:</strong> {displayDescription}
                  </Card.Text>

                  {/* Toggle button / badge */}
                  {movie.description && movie.description.length > 120 && (
                    <div className="mb-2">
                      <Badge
                        bg={isExpanded ? "warning" : "info"}
                        style={{ cursor: "pointer", padding: "10px" }}
                        onClick={() => toggleReadMore(movie._id)}
                      >
                        {isExpanded ? "Show Less" : "Read More"}
                      </Badge>
                    </div>
                  )}

                  {lastFiveComments.length > 0 && (
                    <div style={{ fontSize: ".8rem" }}>
                      <h6>💬 Latest Comments</h6>
                      {lastFiveComments.map((c) => (
                        <div key={c._id}>
                          <strong>
                            <Person size={15} color="gray" />
                          </strong>{" "}
                          {c.userId} <br />
                          <div className="ms-4">
                            <strong>
                              <ChatQuote size={15} color="gray" />
                            </strong>{" "}
                            {c.comment}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Sticky button at bottom */}
                  <div className="mt-auto pt-3">
                    <Button
                      variant="secondary"
                      className="w-100"
                      onClick={() =>
                        (window.location.href = `/movies/${movie._id}`)
                      }
                    >
                      View Movie
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

export default MoviesPage;
