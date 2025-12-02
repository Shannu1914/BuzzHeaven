# Socket.io Events

## Client → Server
- register: { userId }
- message-send: { text, chatId }
- call-offer: { to, offer, from }
- call-answer: { to, answer, from }
- ice-candidate: { to, candidate }

## Server → Client
- notification: { payload }
- message-receive: { text, sender }
- call-offer: { offer, from }
- call-answer: { answer, from }
- ice-candidate: { candidate }
