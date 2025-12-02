// frontend-web/src/pages/AdminPanel.jsx
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { api } from "../api/api";
import "../styles/components.css";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const u = await api.get('/admin/users');
        const p = await api.get('/admin/posts');
        setUsers(u.data || []);
        setPosts(p.data || []);
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  async function ban(id) {
    try { await api.get(`/admin/users/ban/${id}`); setUsers(us => us.map(u => u._id === id ? { ...u, isBanned: true } : u)); }
    catch(e) { console.error(e); }
  }
  async function unban(id) {
    try { await api.get(`/admin/users/unban/${id}`); setUsers(us => us.map(u => u._id === id ? { ...u, isBanned: false } : u)); }
    catch(e) { console.error(e); }
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <h2>Admin</h2>

        <section style={{ marginTop: 12 }}>
          <h3>Users</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr><th>Name</th><th>Email</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.isBanned ? 'Banned' : 'Active'}</td>
                  <td>
                    {u.isBanned ? <button onClick={() => unban(u._id)}>Unban</button> : <button onClick={() => ban(u._id)}>Ban</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section style={{ marginTop: 18 }}>
          <h3>Recent posts</h3>
          {posts.map(p => (
            <div key={p._id} className="post-card">
              <strong>{p.author?.name}</strong>
              <p>{p.text}</p>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}
