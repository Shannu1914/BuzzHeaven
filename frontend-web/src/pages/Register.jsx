// frontend-web/src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { api, setAuthToken } from "../api/api";
import "../styles/components.css";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register", { name, email, password });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("me", JSON.stringify(user));
      setAuthToken(token);
      nav("/feed");
    } catch (error) {
      setErr(error.response?.data?.error || error.message);
    }
  }

  return (
    <>
      <Navbar />
      <div className="container" style={{ maxWidth: 520 }}>
        <div className="form-card">
          <h2>Create account</h2>
          {err && <div style={{ color: "red" }}>{err}</div>}
          <form onSubmit={submit}>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name" required />
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" required />
            <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" required />
            <button type="submit">Register</button>
          </form>
        </div>
      </div>
    </>
  );
}
