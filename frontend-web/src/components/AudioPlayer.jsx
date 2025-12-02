// frontend-web/src/components/AudioPlayer.jsx
import React, { useRef, useState, useEffect } from "react";
import "./../styles/components.css";

export default function AudioPlayer({ src, title = "Audio" }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setProgress((audio.currentTime / audio.duration) || 0);
    audio.addEventListener("timeupdate", onTime);
    return () => audio.removeEventListener("timeupdate", onTime);
  }, []);

  function toggle() {
    const a = audioRef.current;
    if (!a) return;
    if (playing) { a.pause(); setPlaying(false); }
    else { a.play(); setPlaying(true); }
  }

  function seek(e) {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    const audio = audioRef.current;
    if (audio && audio.duration) audio.currentTime = pct * audio.duration;
  }

  return (
    <div className="audio-player">
      <div className="audio-title">{title}</div>
      <audio ref={audioRef} src={src} preload="metadata" />
      <div className="audio-controls">
        <button onClick={toggle} className="btn-audio">{playing ? 'Pause' : 'Play'}</button>
        <div className="audio-progress" onClick={seek}>
          <div className="audio-progress-bar" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>
    </div>
  );
}
