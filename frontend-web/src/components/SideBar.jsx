import React from "react";
import { Link } from "react-router-dom";

export default function SideBar() {
  return (
    <aside className="sidebar">
      <ul>
        <li><Link to="/">📌 Feed</Link></li>
        <li><Link to="/profile">👤 My Profile</Link></li>
        <li><Link to="/messages">💬 Messages</Link></li>
        <li><Link to="/call">📞 Calls</Link></li>
        <li><Link to="/music">🎵 Music</Link></li>
      </ul>
    </aside>
  );
}
