import React, { useState } from "react";

export default function ImageSearchUpload() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState([]);
  const [location, setLocation] = useState(null);

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ latitude, longitude });
      },
      (err) => alert("Location permission denied.")
    );
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const imageFile = e.dataTransfer.files[0];
    setFile(imageFile);
    getLocation();
  };

  const handleUpload = async () => {
    if (!file || !location) return alert("Image or location missing.");
    const formData = new FormData();
    formData.append("image", file);
    formData.append("location", JSON.stringify(location));

    const res = await fetch("/api/ai-image-search", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.success) setResults(data.data);
    else alert(data.error || "Upload failed");
  };

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        style={{
          border: "2px dashed gray",
          padding: "40px",
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        {file ? `Selected: ${file.name}` : "Drag and drop an image here"}
      </div>
      <button onClick={handleUpload}>Search by Image</button>

      <ul>
        {results.map((item, idx) => (
          <li key={idx}>
            <strong>{item.name}</strong> — {item.distance} mi away
            <br />
            <a href={item.directions} target="_blank" rel="noreferrer">
              Get Directions
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}