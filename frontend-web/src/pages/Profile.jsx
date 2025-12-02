// frontend-web/src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";
import PostCard from "../components/PostCard";
import { api } from "../api/api";
import "../styles/components.css";

export default function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const me = JSON.parse(localStorage.getItem("me") || "null");

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const [uRes, pRes] = await Promise.all([api.get(`/users/${id}`), api.get(`/posts`)]);
        if (!mounted) return;
        setUser(uRes.data);
        setPosts(pRes.data.filter(p => p.author && String(p.author._id) === String(id)));
      } catch (e) {
        console.error(e);
      }
    }
    load();
    return () => mounted = false;
  }, [id]);

  if (!user) return <div>Loading...</div>;

  return (
    <>
      <Navbar user={me} />
      <div style={{ display: "flex", gap: 20, padding: "20px" }}>
        <SideBar user={me} />
        <main style={{ flex: 1 }}>
          <div className="profile-header">
            <img src={user.avatarUrl || "/placeholder-avatar.png"} alt="avatar" style={{ width: 110, height: 110 }} />
            <h2>{user.name}</h2>
            <p>{user.bio}</p>
          </div>

          <h3 style={{ marginTop: 20 }}>Posts</h3>
          {posts.map(p => <PostCard key={p._id} post={p} currentUser={me} />)}
        </main>
      </div>
    </>
  );
}
