// frontend-web/src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { api, setAuthToken } from "../api/api";
import "../styles/components.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("me", JSON.stringify(user));
      setAuthToken(token); // sets axios header
      nav("/feed");
    } catch (error) {
      setErr(error.response?.data?.error || error.message);
    }
  }

  return (
    <>
      <Navbar />
      <div className="container" style={{ maxWidth: 480 }}>
        <div className="form-card">
          <h2>Login</h2>
          {err && <div style={{ color: "red" }}>{err}</div>}
          <form onSubmit={submit}>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" required />
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </>
  );
}
