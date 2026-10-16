
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");

  // Fetch service requests from JSON Server
  useEffect(() => {
    fetch("http://localhost:3001/serviceRequests")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch service requests");
        }
        return response.json();
      })
      .then((data) => setRequests(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  // Count requests by status
  const count = (status) =>
    requests.filter((item) => item.status === status).length;

  // Search customers, models, issues, and status
  const filteredRequests = requests.filter((item) =>
    `${item.customerName} ${item.mobileModel} ${item.issue} ${item.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <header className="header">
        <div>
          <h1>Mobile Service Center</h1>
          <p>Manage and track mobile repair requests.</p>
        </div>
        <span className="header-icon">📱</span>
      </header>

      {/* Dashboard summary cards */}
      <div className="cards">
        <div className="card total">
          <span>Total Requests</span>
          <h2>{requests.length}</h2>
          <p>All service requests</p>
        </div>

        <div className="card pending">
          <span>Pending</span>
          <h2>{count("Pending")}</h2>
          <p>Waiting for service</p>
        </div>

        <div className="card progress">
          <span>In Progress</span>
          <h2>{count("In Progress")}</h2>
          <p>Currently repairing</p>
        </div>

        <div className="card completed">
          <span>Completed</span>
          <h2>{count("Completed")}</h2>
          <p>Repairs finished</p>
        </div>
      </div>

      {/* Service request details */}
      <section className="table-section">
        <div className="section-header">
          <div>
            <h2>Service Request Details</h2>
            <p>View customer and repair information.</p>
          </div>

          <input
            type="text"
            placeholder="Search customer, model, issue..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Mobile Model</th>
                <th>Issue</th>
                <th>Status</th>
                <th>Cost</th>
              </tr>
            </thead>

            <tbody>
              {filteredRequests.map((item) => (
                <tr key={item.id}>
                  <td>#{item.id}</td>
                  <td className="customer">{item.customerName}</td>
                  <td>{item.mobileModel}</td>
                  <td>{item.issue}</td>

                  <td>
                    <span
                      className={`status ${item.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      <span className="status-dot">
                        {item.status === "Pending"
                          ? "◷"
                          : item.status === "In Progress"
                          ? "⚙"
                          : item.status === "Completed"
                          ? "✓"
                          : "•"}
                      </span>
                      {item.status}
                    </span>
                  </td>

                  <td className="cost">
                    ₹{Number(item.cost).toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}

              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan="6" className="empty">
                    No matching service requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          Showing {filteredRequests.length} of {requests.length} service
          requests
        </div>
      </section>
    </div>
  );
}

export default App;
