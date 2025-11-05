import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddEvent() {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [status, setStatus] = useState("BUSY");
  const token = localStorage.getItem("access");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/events/",
        {
          title,
          start_time: startTime,
          end_time: endTime,
          status,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Event added successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Error creating event:", err);
      alert(err.response?.data?.error || "Failed to create event.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Add New Event</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
        <div style={{ marginBottom: "10px" }}>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Start Time:</label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>End Time:</label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Status:</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          >
            <option value="BUSY">BUSY</option>
            <option value="SWAPPABLE">SWAPPABLE</option>
          </select>
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            padding: "10px 16px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Add Event
        </button>

        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          style={{
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            padding: "10px 16px",
            borderRadius: "5px",
            cursor: "pointer",
            marginLeft: "10px",
          }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default AddEvent;
