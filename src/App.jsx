import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MoviesPage from "./pages/MoviesPage";
import Profile from "./pages/Profile";
import AdminPage from "./pages/AdminPage";
import MovieDetail from "./pages/MovieDetail";

function App() {
  const { token } = useContext(AuthContext);
  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="*" element={<h2>Page not Found</h2>} />
          <Route path="/" element={<h2>Welcome to Movies App</h2>} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/movies/:id" element={<MovieDetail />} />

          <Route
          path="/profile"
          element={token ? <Profile /> : <Navigate to="/login" />}
        />
          <Route
          path="/admin"
          element={token ? <AdminPage /> : <Navigate to="/login" />}
        />
        </Routes>
      </div>
    </>
  );
}

export default App;
