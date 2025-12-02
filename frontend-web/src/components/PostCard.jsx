import React from "react";

export default function PostCard({ post }) {
  return (
    <div className="post-card">
      <div className="user-info">
        <img src={post.user.avatar} alt="" className="avatar" />
        <span>{post.user.name}</span>
      </div>

      <p className="caption">{post.caption}</p>
      {post.media && <img src={post.media} alt="" className="post-image" />}

      <div className="actions">
        <button>👍 Like</button>
        <button>💬 Comment</button>
        <button>↪ Share</button>
      </div>
    </div>
  );
}
