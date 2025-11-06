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
import config from "../config";
import "../styles/Marketplace.css";

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
        const res = await axios.get(`${config.API_URL}/api/swappable-slots/`, {
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
        const res = await axios.get(`${config.API_URL}/api/events/`, {
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
        `${config.API_URL}/api/swap-request/`,
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
    <div className="marketplace-page">
      <div className="marketplace-container">
        <h2 className="marketplace-title">Swappable Slots (Other Users)</h2>

        {swappableSlots.length === 0 ? (
          <div className="no-slots">
            <p>No available slots from other users at the moment.</p>
          </div>
        ) : (
          <table className="marketplace-table">
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
                      className="request-swap-btn"
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

        {/* Modal to choose your offer */}
        {showOfferModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3 className="modal-title">Select one of your swappable slots to offer:</h3>
              {mySwappableSlots.length === 0 ? (
                <p>You have no swappable slots!</p>
              ) : (
                <ul className="slot-list">
                  {mySwappableSlots.map((mine) => (
                    <li key={mine.id} className="slot-item">
                      <span>
                        {mine.title} — {new Date(mine.start_time).toLocaleString()}
                      </span>
                      <button
                        className="offer-btn"
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
              <button className="cancel-btn" onClick={() => setShowOfferModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Marketplace;
