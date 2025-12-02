// frontend-web/src/pages/Feed.jsx
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";
import StoryBar from "../components/StoryBar";
import PostCard from "../components/PostCard";
import AudioPlayer from "../components/AudioPlayer";
import { api } from "../api/api";
import "../styles/components.css";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const me = JSON.parse(localStorage.getItem("me") || "null");

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await api.get("/posts");
        if (mounted) setPosts(res.data);
      } catch (e) {
        console.error(e);
      }
    }
    load();
    return () => mounted = false;
  }, []);

  function handleLike(postId) {
    setPosts(ps => ps.map(p => p._id === postId ? { ...p, likes: p.likes && p.likes.includes(me?.id || me?._id) ? p.likes.filter(l => l !== (me.id || me._id)) : [...(p.likes||[]), (me.id || me._id)] } : p));
  }

  return (
    <>
      <Navbar user={me} />
      <div style={{ display: "flex", gap: 20, padding: "20px" }}>
        <SideBar user={me} />
        <main style={{ flex: 1 }}>
          <StoryBar stories={[]} />
          <div style={{ marginTop: 12 }}>
            {posts.map(p => <PostCard key={p._id} post={p} currentUser={me} onLike={handleLike} />)}
          </div>

          <div style={{ marginTop: 20 }}>
            <h3>Listen</h3>
            <AudioPlayer src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" title="Demo Track" />
          </div>
        </main>
      </div>
    </>
  );
}
