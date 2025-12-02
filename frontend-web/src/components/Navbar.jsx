// frontend-web/src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./../styles/components.css";

export default function Navbar({ user, onLogout }) {
  const nav = useNavigate();

  function handleLogout() {
    if (onLogout) onLogout();
    // clear token + redirect
    localStorage.removeItem("token");
    localStorage.removeItem("me");
    nav("/login");
  }

  return (
    <header className="nav-bar">
      <div className="nav-left">
        <Link to="/" className="brand">SocialApp</Link>
      </div>

      <div className="nav-right">
        <Link to="/feed" className="nav-link">Feed</Link>
        <Link to="/messages" className="nav-link">Messages</Link>
        {user ? (
          <>
            <Link to={`/profile/${user.id || user._id}`} className="nav-link">
              <img src={user.avatarUrl || '/placeholder-avatar.png'} alt="avatar" className="nav-avatar"/>
              <span className="nav-username">{user.name}</span>
            </Link>
            <button className="btn-link" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        )}
      </div>
    </header>
  );
}
