// chat.js — minimal chat client using socket.io (used by messages/chat.ejs)
const socket = io();

// simple helper to append messages
function appendMessage(text, me=false) {
  const el = document.createElement('div');
  el.className = 'chat-message' + (me ? ' me' : '');
  el.innerText = text;
  document.getElementById('chatBox').appendChild(el);
  document.getElementById('chatBox').scrollTop = document.getElementById('chatBox').scrollHeight;
}

document.getElementById('sendBtn').addEventListener('click', () => {
  const peerId = document.getElementById('peerId').value.trim();
  const msg = document.getElementById('msgInput').value.trim();
  if (!peerId || !msg) return;
  // join room
  socket.emit('joinChat', { userId: window.CURRENT_USER_ID || '', peerId });
  socket.emit('sendMessage', { senderId: window.CURRENT_USER_ID || '', receiverId: peerId, message: msg });
  appendMessage('Me: ' + msg, true);
  document.getElementById('msgInput').value = '';
});

socket.on('receiveMessage', (data) => {
  appendMessage(`${data.senderId}: ${data.message}`, false);
});

socket.on('typing', (id) => {
  // TODO: show typing indicator
});
