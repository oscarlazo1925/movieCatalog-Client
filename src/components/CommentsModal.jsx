import { useState, useEffect } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { Person, ChatQuote } from "react-bootstrap-icons";

const CommentsModal = ({ movieId, show, handleClose, movieTitle }) => {
  const [comments, setComments] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // Fetch comments only once per modal open
  useEffect(() => {
    if (!show || !movieId) return;

    setLoaded(false); // reset loading state
    setComments([]); // clear previous comments

    const fetchComments = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/movies/getMovie/${movieId}`
        );
        const data = await res.json();
        // console.log(data);
        setComments(data.comments || []);
        setLoaded(true);
      } catch (err) {
        console.error("Error loading comments:", err);
      }
    };

    fetchComments();
  }, [show, movieId]);

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Comments for {movieTitle} {comments.length > 0 ? '('+comments.length+` ${comments.length > 1 ? 'Comments':'Comment'})`:''}</Modal.Title>
      </Modal.Header>

      {/* Scrollable body */}
      <Modal.Body style={{ maxHeight: "60vh", overflowY: "auto" }}>
        {!loaded ? (
          <div className="text-center py-3">
            <Spinner animation="border" size="sm" /> Loading comments...
          </div>
        ) : comments.length > 0 ? (
          comments.map((c) => (
            <div
              key={c._id}
              className="border-bottom pb-2 mb-2 d-flex flex-column"
            >
              <div className="fw-bold d-flex align-items-center">
                <Person size={16} className="me-1 text-primary" />
                {c.userId}
              </div>
              <div className="d-flex align-items-center">
                <ChatQuote size={16} className="me-1 text-success" />
                {c.comment}
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted text-center">No comments yet.</p>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CommentsModal;
