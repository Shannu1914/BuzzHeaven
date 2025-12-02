// frontend-web/src/pages/Messages.jsx
import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";
import { socket } from "../api/socket";
import { api } from "../api/api";
import "../styles/components.css";

export default function Messages() {
  const me = JSON.parse(localStorage.getItem("me") || "null");
  const [peerId, setPeerId] = useState("");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const chatBoxRef = useRef();

  useEffect(() => {
    socket.connect();
    if (me && me.id) socket.emit("register", { userId: me.id });
    if (me && me._id) socket.emit("register", { userId: me._id });
    socket.on("receiveMessage", (m) => {
      setMessages(ms => [...ms, m]);
      scrollBottom();
    });
    return () => {
      socket.off("receiveMessage");
      socket.disconnect();
    };
  }, []);

  function scrollBottom() {
    setTimeout(() => {
      if (chatBoxRef.current) chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }, 50);
  }

  async function send() {
    if (!peerId || !text) return;
    const payload = { senderId: me.id || me._id, receiverId: peerId, message: text };
    // Optimistically append
    setMessages(ms => [...ms, { senderId: me.id || me._id, message: text, time: new Date() }]);
    socket.emit("sendMessage", payload);
    setText("");
    scrollBottom();
    // also persist via API
    try { await api.post('/messages', { to: peerId, text: payload.message }); } catch (e) {}
  }

  return (
    <>
      <Navbar user={me} />
      <div style={{ display: "flex", gap: 20, padding: "20px" }}>
        <SideBar user={me} />
        <main style={{ flex: 1 }}>
          <h2>Messages</h2>
          <div ref={chatBoxRef} className="chat-box" id="chatBox" style={{ marginBottom: 12 }}>
            {messages.map((m, i) => (
              <div key={i} className={`chat-message ${String(m.senderId) === String(me.id || me._id) ? 'me' : ''}`}>
                <div>{m.message}</div>
                <small style={{ fontSize: 11, color: '#666' }}>{new Date(m.time || m.createdAt).toLocaleTimeString()}</small>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <input placeholder="Peer user id" value={peerId} onChange={e => setPeerId(e.target.value)} style={{ width: 200 }} />
            <input placeholder="Type a message" value={text} onChange={e => setText(e.target.value)} style={{ flex: 1 }} />
            <button onClick={send}>Send</button>
          </div>
        </main>
      </div>
    </>
  );
}
