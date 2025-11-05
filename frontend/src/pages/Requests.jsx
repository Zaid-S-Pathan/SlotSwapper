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

function Requests() {
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const token = localStorage.getItem("access");

  // Fetch incoming and outgoing requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/swap-requests/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIncoming(res.data.incoming);
        setOutgoing(res.data.outgoing);
      } catch (err) {
        console.error(err);
        alert("Failed to load requests.");
      }
    };

    fetchRequests();
  }, [token]);

  // Handle swap response (accept/reject)
  const respondToRequest = async (id, accept) => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/swap-response/${id}/`,
        { accept },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(accept ? "Swap Accepted!" : "Swap Rejected!");
      // Refresh after response
      setIncoming((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to respond to request.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Incoming Swap Requests</h2>
      {incoming.length === 0 ? (
        <p>No incoming requests.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Requester</th>
              <th>Their Slot ID</th>
              <th>Your Slot ID</th>
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
                <td>{req.status}</td>
                <td>
                  <button onClick={() => respondToRequest(req.id, true)}>
                    Accept
                  </button>
                  <button onClick={() => respondToRequest(req.id, false)}>
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2 style={{ marginTop: "3rem" }}>Outgoing Swap Requests</h2>
      {outgoing.length === 0 ? (
        <p>No outgoing requests.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Recipient</th>
              <th>Your Slot ID</th>
              <th>Their Slot ID</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {outgoing.map((req) => (
              <tr key={req.id}>
                <td>{req.recipient}</td>
                <td>{req.my_slot}</td>
                <td>{req.their_slot}</td>
                <td>{req.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Requests;
