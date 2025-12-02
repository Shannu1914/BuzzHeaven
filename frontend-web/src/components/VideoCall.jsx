// frontend-web/src/components/VideoCall.jsx
import React, { useEffect, useRef, useState } from "react";
import { socket } from "../api/socket";
import "./../styles/components.css";

export default function VideoCall({ meId, targetId, roomId: initialRoom }) {
  const localRef = useRef();
  const remoteRef = useRef();
  const pcRef = useRef();
  const [inCall, setInCall] = useState(false);
  const [roomId, setRoomId] = useState(initialRoom || null);

  useEffect(() => {
    socket.connect();
    if (meId) socket.emit('register', { userId: meId });
    socket.on('call-offer', async ({ offer, from }) => {
      await handleReceiveOffer(offer, from);
    });
    socket.on('call-answer', async ({ answer }) => {
      if (pcRef.current) pcRef.current.setRemoteDescription(new RTCSessionDescription(answer));
    });
    socket.on('ice-candidate', ({ candidate }) => {
      if (pcRef.current) pcRef.current.addIceCandidate(candidate);
    });
    return () => {
      socket.off('call-offer');
      socket.off('call-answer');
      socket.off('ice-candidate');
      socket.disconnect();
    };
  }, [meId]);

  async function startLocal() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localRef.current.srcObject = stream;
    return stream;
  }

  async function callUser() {
    pcRef.current = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });

    const localStream = await startLocal();
    localStream.getTracks().forEach(t => pcRef.current.addTrack(t, localStream));

    pcRef.current.ontrack = (e) => {
      remoteRef.current.srcObject = e.streams[0];
    };
    pcRef.current.onicecandidate = (e) => {
      if (e.candidate) socket.emit('ice-candidate', { to: targetId, candidate: e.candidate });
    };

    const offer = await pcRef.current.createOffer();
    await pcRef.current.setLocalDescription(offer);
    socket.emit('call-offer', { to: targetId, offer, from: meId });
    setInCall(true);
  }

  async function handleReceiveOffer(offer, from) {
    pcRef.current = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
    const localStream = await startLocal();
    localStream.getTracks().forEach(t => pcRef.current.addTrack(t, localStream));
    pcRef.current.ontrack = (e) => remoteRef.current.srcObject = e.streams[0];
    pcRef.current.onicecandidate = (e) => {
      if (e.candidate) socket.emit('ice-candidate', { to: from, candidate: e.candidate });
    };
    await pcRef.current.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pcRef.current.createAnswer();
    await pcRef.current.setLocalDescription(answer);
    socket.emit('call-answer', { to: from, answer, from: meId });
    setInCall(true);
  }

  function endCall() {
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    if (localRef.current?.srcObject) {
      localRef.current.srcObject.getTracks().forEach(t => t.stop());
      localRef.current.srcObject = null;
    }
    if (remoteRef.current?.srcObject) {
      remoteRef.current.srcObject.getTracks().forEach(t => t.stop());
      remoteRef.current.srcObject = null;
    }
    setInCall(false);
  }

  return (
    <div className="video-call">
      <div className="video-row">
        <video ref={localRef} autoPlay muted className="video-local" />
        <video ref={remoteRef} autoPlay className="video-remote" />
      </div>
      <div className="video-actions">
        {!inCall ? <button onClick={callUser}>Start Call</button> : <button onClick={endCall}>End Call</button>}
      </div>
    </div>
  );
}
