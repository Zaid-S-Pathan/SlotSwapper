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
import { FaTrash } from "react-icons/fa";  // ✅ added

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

  if (loading) return <p style={{ padding: "2rem" }}>Loading events...</p>;
  if (error) return <p style={{ color: "red", padding: "2rem" }}>{error}</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Your Events</h2>

      <button
        style={{
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          padding: "10px 16px",
          borderRadius: "5px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
        onClick={() => navigate("/add-event")}
      >
        ➕ Add New Event
      </button>

      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
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
                <td>{ev.status}</td>
                <td style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  {/* Toggle Swappable */}
                  <button
                    onClick={() => toggleSwappable(ev.id, ev.status)}
                    style={{
                      backgroundColor:
                        ev.status === "BUSY" ? "#17a2b8" : "#ffc107",
                      color: "white",
                      border: "none",
                      padding: "6px 10px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    {ev.status === "BUSY" ? "Make Swappable" : "Revert to Busy"}
                  </button>

                  {/* Delete with bin icon */}
                  <button
                    onClick={() => handleDelete(ev.id)}
                    style={{
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      padding: "6px 8px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
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
  );
}

export default Dashboard;



