import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../config";
import "../styles/AddEvent.css";

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
        `${config.API_URL}/api/events/`,
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
    <div className="add-event-page">
      <div className="add-event-container">
        <h2 className="add-event-title">Add New Event</h2>
        
        <form onSubmit={handleSubmit} className="add-event-form">
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter event title"
            />
          </div>

          <div className="form-group">
            <label>Start Time:</label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>End Time:</label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Status:</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="status-select"
            >
              <option value="BUSY">BUSY</option>
              <option value="SWAPPABLE">SWAPPABLE</option>
            </select>
          </div>

          <div className="button-group">
            <button type="submit" className="submit-btn">
              Add Event
            </button>

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="cancel-btn"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEvent;
