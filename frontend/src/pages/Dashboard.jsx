// function Dashboard() {
//   return (
//     <div>
//       <h1>Dashboard</h1>
//       <p>Welcome to your dashboard!</p>
//     </div>
//   );
// }

// export default Dashboard;  //

import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import "../styles/Dashboard.css";

function Dashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("access");
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/events/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load events.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/events/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(events.filter((ev) => ev.id !== id));
    } catch (err) {
      console.error("Error deleting event:", err);
      alert("Failed to delete event.");
    }
  };

  const toggleSwappable = async (id, currentStatus) => {
    const newStatus = currentStatus === "BUSY" ? "SWAPPABLE" : "BUSY";
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/events/${id}/`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === id ? { ...ev, status: newStatus } : ev
        )
      );
    } catch (err) {
      console.error("Error updating event status:", err);
      alert("Failed to update event status.");
    }
  };

  if (loading) return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <p className="loading-text">Loading events...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <p className="error-text">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <h2 className="dashboard-title">Your Events</h2>

        <button
          className="add-event-btn"
          onClick={() => navigate("/add-event")}
        >
          ➕ Add New Event
        </button>

        {events.length === 0 ? (
          <div className="no-events">
            <p>No events found. Create your first event to get started!</p>
          </div>
        ) : (
          <table className="events-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Start</th>
                <th>End</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr key={ev.id}>
                  <td>{ev.title}</td>
                  <td>{new Date(ev.start_time).toLocaleString()}</td>
                  <td>{new Date(ev.end_time).toLocaleString()}</td>
                  <td>
                    <span className={`status-badge ${ev.status.toLowerCase()}`}>
                      {ev.status}
                    </span>
                  </td>
                  <td className="actions-cell">
                    {/* Toggle Swappable */}
                    <button
                      onClick={() => toggleSwappable(ev.id, ev.status)}
                      className={`toggle-btn ${ev.status === "BUSY" ? "swappable" : "busy"}`}
                    >
                      {ev.status === "BUSY" ? "Make Swappable" : "Revert to Busy"}
                    </button>

                    {/* Delete with bin icon */}
                    <button
                      onClick={() => handleDelete(ev.id)}
                      className="delete-btn"
                      title="Delete Event"
                    >
                      <FaTrash size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Dashboard;



