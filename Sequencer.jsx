import React, { useState } from "react";
import * as Tone from "tone";
import CONFIG from "../config.js"; // import your backend config

const Sequencer = () => {
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [pattern, setPattern] = useState([]);

  // 🎵 Play a simple kick-snare pattern
  const playBeat = () => {
    const kick = new Tone.MembraneSynth().toDestination();
    const snare = new Tone.NoiseSynth({ noise: { type: "white" } }).toDestination();

    const seq = new Tone.Sequence(
      (time, step) => {
        if (step % 4 === 0) kick.triggerAttackRelease("C2", "8n", time);
        if (step % 4 === 2) snare.triggerAttackRelease("8n", time);
      },
      [...Array(8).keys()],
      "8n"
    );

    Tone.Transport.bpm.value = bpm;
    Tone.Transport.start();
    seq.start(0);
    setIsPlaying(true);
  };

  const stopBeat = () => {
    Tone.Transport.stop();
    setIsPlaying(false);
  };

  // 🧠 Ask AI to generate a new beat
  const generateAIBeat = async () => {
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/api/generate-beat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bpm }),
      });

      const data = await response.json();
      setPattern(data.pattern || []);
      alert("AI Beat Generated!");
    } catch (error) {
      console.error("AI Beat generation failed:", error);
      alert("AI failed to generate beat. Check your backend.");
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>🎧 AI Beat Studio Sequencer</h2>
      <p>BPM: {bpm}</p>

      <input
        type="range"
        min="60"
        max="200"
        value={bpm}
        onChange={(e) => setBpm(e.target.value)}
      />
      <br /><br />

      <button onClick={isPlaying ? stopBeat : playBeat}>
        {isPlaying ? "Stop Beat" : "Play Beat"}
      </button>

      <button onClick={generateAIBeat} style={{ marginLeft: "10px" }}>
        Generate AI Beat 🤖
      </button>

      <pre style={{ marginTop: "20px", background: "#111", color: "#0f0", padding: "10px" }}>
        {JSON.stringify(pattern, null, 2)}
      </pre>
    </div>
  );
};

export default Sequencer;