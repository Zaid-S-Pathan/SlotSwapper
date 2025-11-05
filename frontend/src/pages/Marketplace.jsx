// function Marketplace() {
//   return (
//     <div>
//       <h1>Marketplace</h1>
//       <p>Welcome to your dashboard!</p>
//     </div>
//   );
// }

// export default Marketplace;  // 
import { useEffect, useState } from "react";
import axios from "axios";

function Marketplace() {
  const [swappableSlots, setSwappableSlots] = useState([]);
  const [mySwappableSlots, setMySwappableSlots] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [showOfferModal, setShowOfferModal] = useState(false);

  const token = localStorage.getItem("access");

  // Fetch all other users' swappable slots
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/swappable-slots/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSwappableSlots(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load swappable slots.");
      }
    };

    // Fetch user's own swappable events
    const fetchMySlots = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/events/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const mine = res.data.filter((ev) => ev.status === "SWAPPABLE");
        setMySwappableSlots(mine);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSlots();
    fetchMySlots();
  }, [token]);

  // Handle swap request
  const sendSwapRequest = async (mySlotId) => {
    try {
       console.log("Sending swap request:", {
  my_slot_id: mySlotId,
  their_slot_id: selectedTarget,
});

      await axios.post(
        "http://127.0.0.1:8000/api/swap-request/",
        {
          my_slot_id: mySlotId,
          their_slot_id: selectedTarget,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Swap request sent!");
      setShowOfferModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to send swap request.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Swappable Slots (Other Users)</h2>

      {swappableSlots.length === 0 ? (
        <p>No available slots from other users.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Owner</th>
              <th>Title</th>
              <th>Start</th>
              <th>End</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {swappableSlots.map((slot) => (
              <tr key={slot.id}>
                <td>{slot.owner}</td>
                <td>{slot.title}</td>
                <td>{new Date(slot.start_time).toLocaleString()}</td>
                <td>{new Date(slot.end_time).toLocaleString()}</td>
                <td>
                  <button
                    onClick={() => {
                      setSelectedTarget(slot.id);
                      setShowOfferModal(true);
                    }}
                  >
                    Request Swap
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Simple modal to choose your offer */}
      {showOfferModal && (
        <div
          style={{
            background: "rgba(0,0,0,0.5)",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ background: "white", color: "black",padding: "20px", borderRadius: "8px" }}>
            <h3>Select one of your swappable slots to offer:</h3>
            {mySwappableSlots.length === 0 ? (
              <p>You have no swappable slots!</p>
            ) : (
              <ul>
                {mySwappableSlots.map((mine) => (
                  <li key={mine.id} style={{ marginBottom: "10px" }}>
                    {mine.title} — {new Date(mine.start_time).toLocaleString()}
                    <button
                      style={{ marginLeft: "10px" }}
                      onClick={() => {
                        sendSwapRequest(mine.id);
                      }}
                    >
                      Offer This
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <button onClick={() => setShowOfferModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Marketplace;
