// function Requests() {
//   return (
//     <div>
//       <h1>Requests</h1>
//       <p>Welcome to your dashboard!</p>
//     </div>
//   );
// }

// export default Requests;  
import { useEffect, useState } from "react";
import axios from "axios";
import config from "../config";
import "../styles/Requests.css";

function Requests() {
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("access");

  // Fetch incoming and outgoing swap requests
  const fetchRequests = async () => {
    try {
      setError(null);
      const res = await axios.get(`${config.API_URL}/api/swap-requests/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Defensive checks in case backend changes structure
      const incomingData = Array.isArray(res.data.incoming)
        ? res.data.incoming
        : [];
      const outgoingData = Array.isArray(res.data.outgoing)
        ? res.data.outgoing
        : [];

      setIncoming(incomingData);
      setOutgoing(outgoingData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching swap requests:", err);
      setError("Failed to load requests.");
      setLoading(false);
    }
  };

  // Load requests initially + poll every 10 seconds
  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 10000);
    return () => clearInterval(interval);
  }, [token]);

  // Handle accept/reject actions
  const respondToRequest = async (id, accept) => {
    try {
      await axios.post(
        `${config.API_URL}/api/swap-response/${id}/`,
        { accept },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchRequests(); // refresh after response
    } catch (err) {
      console.error("Failed to respond to request:", err);
      alert("Failed to respond to request.");
    }
  };

  if (loading) return (
    <div className="requests-page">
      <div className="requests-container">
        <p className="loading-text">Loading requests...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="requests-page">
      <div className="requests-container">
        <p className="error-text">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="requests-page">
      <div className="requests-container">
        <h2 className="requests-section-title">Incoming Swap Requests</h2>
        {incoming.length === 0 ? (
          <div className="no-requests">
            <p>No incoming requests at the moment.</p>
          </div>
        ) : (
          <table className="requests-table">
            <thead>
              <tr>
                <th>Requester</th>
                <th>Their Slot</th>
                <th>Your Slot</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {incoming.map((req) => (
                <tr key={req.id}>
                  <td>{req.requester}</td>
                  <td>{req.my_slot}</td>
                  <td>{req.their_slot}</td>
                  <td>
                    <span className={`status-badge ${req.status.toLowerCase()}`}>
                      {req.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="accept-btn"
                        onClick={() => respondToRequest(req.id, true)}
                      >
                        Accept
                      </button>
                      <button 
                        className="reject-btn"
                        onClick={() => respondToRequest(req.id, false)}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <h2 className="requests-section-title">Outgoing Swap Requests</h2>
        {outgoing.length === 0 ? (
          <div className="no-requests">
            <p>No outgoing requests at the moment.</p>
          </div>
        ) : (
          <table className="requests-table">
            <thead>
              <tr>
                <th>Recipient</th>
                <th>Your Slot</th>
                <th>Their Slot</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {outgoing.map((req) => (
                <tr key={req.id}>
                  <td>{req.recipient}</td>
                  <td>{req.my_slot}</td>
                  <td>{req.their_slot}</td>
                  <td>
                    <span className={`status-badge ${req.status.toLowerCase()}`}>
                      {req.status}
                    </span>
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

export default Requests;



