import React from "react";

export default function StoryBar({ stories }) {
  return (
    <div className="story-bar">
      {stories.map((s, i) => (
        <div className="story" key={i}>
          <img src={s.avatar} alt="" />
          <p>{s.name}</p>
        </div>
      ))}
    </div>
  );
}
