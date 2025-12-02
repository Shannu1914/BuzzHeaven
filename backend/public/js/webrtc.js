// webrtc.js — minimal WebRTC client using socket.io signalling on server event names
const socket = io();
let pc;
let localStream;
const roomId = document.querySelector('p')?.innerText?.includes('Room ID:') ? document.querySelector('p').innerText.replace('Room ID: ', '').trim() : null;

async function startMedia() {
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  document.getElementById('localVideo').srcObject = localStream;
}

function createPeer(isOfferer=false) {
  pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
  pc.ontrack = (e) => document.getElementById('remoteVideo').srcObject = e.streams[0];
  pc.onicecandidate = (e) => {
    if (e.candidate) {
      if (roomId) socket.emit('candidate', e.candidate, roomId);
      else socket.emit('ice-candidate', { to: window.CALL_TARGET_ID || null, candidate: e.candidate });
    }
  };
  if (localStream) localStream.getTracks().forEach(t => pc.addTrack(t, localStream));
  return pc;
}

document.getElementById('startBtn').addEventListener('click', async () => { await startMedia(); });
document.getElementById('callBtn').addEventListener('click', async () => {
  if (!roomId) return alert('No room');
  socket.emit('join-call', roomId);
  pc = createPeer(true);
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  socket.emit('offer', offer, roomId);
});
document.getElementById('endBtn').addEventListener('click', () => {
  if (pc) pc.close();
  socket.emit('leave', roomId);
  location.href = '/messages';
});

socket.on('offer', async (offer) => {
  if (!localStream) await startMedia();
  pc = createPeer(false);
  await pc.setRemoteDescription(offer);
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  socket.emit('answer', answer, roomId);
});
socket.on('answer', async (answer) => {
  if (pc) await pc.setRemoteDescription(answer);
});
socket.on('candidate', async (c) => {
  if (pc) await pc.addIceCandidate(new RTCIceCandidate(c));
});
