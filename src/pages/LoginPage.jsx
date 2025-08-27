import React, { useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const { setToken, setUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const [loginText, setLoginText] = useState("Login");

  function decodeToken(token) {
    try {
      const payload = token.split(".")[1]; // get middle part
      const decodedPayload = atob(payload); // decode base64
      return JSON.parse(decodedPayload); // parse JSON
    } catch (err) {
      console.error("Failed to decode token", err);
      return null;
    }
  }

  const handleLogin = async (e) => {
    setLoginText("Loging in..");
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/login`,
        { email, password }
      );
      console.log(res.data, "res.data");
      // ✅ Save token
      const token = res.data.access;
      setToken(token);
      localStorage.setItem("token", token);

      const decoded = decodeToken(token);
      console.log("Decoded token:", decoded);

      const userInfo = {
        email: decoded.email,
        isAdmin: decoded.isAdmin,
      };

      // ✅ Save user info (assume backend returns user object)
      setUser(userInfo); // should include role, name, etc.

      // optional: store in localStorage for persistence
      localStorage.setItem("user", JSON.stringify(userInfo));

      setMessage("Login successful ✅");

      navigate("/profile");
    } catch (err) {
      setMessage("Login failed ❌");
      setLoginText("Login");
    }
  };

  return (
    <div className="col-md-6 offset-md-3">
      <h3>Login</h3>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loginText === "Loging in.."}
        >
          {loginText}
        </button>
      </form>
      {message && <div className="alert alert-info mt-3">{message}</div>}

      <div className="mt-5">
        <p>reamovie@mail.com - 123456789</p>
        <p>admin@mail.com admin123</p>
      </div>
    </div>
  );
}

export default LoginPage;
