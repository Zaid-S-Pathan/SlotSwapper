// function Dashboard() {
//   return (
//     <div>
//       <h1>Dashboard</h1>
//       <p>Welcome to your dashboard!</p>
//     </div>
//   );
// }

// export default Dashboard;  // 👈 this line is essential

import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");

  const token = localStorage.getItem("access");

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/events/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEvents(res.data);
      } catch (err) {
        setError("Failed to load events. Please log in again.");
      }
    };

    fetchEvents();
  }, [token]);

  // Mark event as SWAPPABLE
  const makeSwappable = async (id) => {
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/events/${id}/`,
        { status: "SWAPPABLE" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Update local state
      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === id ? { ...ev, status: "SWAPPABLE" } : ev
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update event.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Your Events</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td>{event.title}</td>
                <td>{new Date(event.start_time).toLocaleString()}</td>
                <td>{new Date(event.end_time).toLocaleString()}</td>
                <td>{event.status}</td>
                <td>
                  {event.status === "BUSY" ? (
                    <button onClick={() => makeSwappable(event.id)}>
                      Make Swappable
                    </button>
                  ) : (
                    "—"
                  )}
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
