# Database Schema

## Users
- _id, name, email, password, avatar, bio

## Posts
- _id, userId, caption, media, createdAt, likes, comments

## Messages
- _id, chatId, senderId, text, media, createdAt

## Calls
- _id, callerId, receiverId, status, startedAt, endedAt

## Reports
- _id, userId, type, description, status, createdAt
