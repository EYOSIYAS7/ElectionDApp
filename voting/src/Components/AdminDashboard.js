import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import { FaCheckCircle, FaHourglassEnd, FaPlusCircle } from "react-icons/fa";

const AdminDashboard = () => {
  const [activeView, setActiveView] = useState("active");

  // Placeholder data
  const activeElections = [
    {
      id: 1,
      title: "City Council Election",
      description: "Vote for your local city council representatives",
      endDate: "2024-11-15",
    },
    {
      id: 2,
      title: "School Board Decision",
      description: "Decide on the new school curriculum",
      endDate: "2024-10-30",
    },
  ];

  const finishedElections = [
    {
      id: 3,
      title: "Mayor Election",
      description: "Results for the mayoral race",
      endDate: "2024-09-01",
    },
    {
      id: 4,
      title: "Budget Allocation",
      description: "City budget distribution results",
      endDate: "2024-08-15",
    },
  ];

  const ElectionCard = ({ election, isActive }) => (
    <div className="card admin-dashboard-election-card">
      <div className="card-body">
        <div className="card-flag">
          <span
            className={`flag ${isActive ? "flag-active" : "flag-finished"}`}
          >
            {isActive ? "Active" : "Finished"}
          </span>
        </div>
        <h5 className="card-title">{election.title}</h5>
        <p className="card-text">{election.description}</p>
        <p className="card-text">
          <small className="text-muted">
            {isActive ? "Ends on: " : "Ended on: "} {election.endDate}
          </small>
        </p>
        <button className={`btn ${isActive ? "btn-manage" : "btn-view"}`}>
          {isActive ? "Manage Election" : "View Results"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard-container">
      <div className="admin-dashboard-sidebar">
        <h3 className="sidebar-title">Admin Dashboard</h3>
        <ul className="nav flex-column">
          <li className="nav-item">
            <button
              className={`nav-link ${activeView === "active" ? "active" : ""}`}
              onClick={() => setActiveView("active")}
            >
              <FaCheckCircle /> Active Elections
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${
                activeView === "finished" ? "active" : ""
              }`}
              onClick={() => setActiveView("finished")}
            >
              <FaHourglassEnd /> Finished Elections
            </button>
          </li>
          <li className="nav-item">
            <button className="nav-link" onClick={() => setActiveView("new")}>
              <FaPlusCircle /> Create New Election
            </button>
          </li>
        </ul>
      </div>
      <div className="admin-dashboard-main-content">
        <h1 className="main-title">
          {activeView === "active"
            ? "Active Elections"
            : activeView === "finished"
            ? "Finished Elections"
            : "Create New Election"}
        </h1>
        <div className="admin-dashboard-election-grid">
          {activeView === "active" &&
            activeElections.map((election) => (
              <ElectionCard
                key={election.id}
                election={election}
                isActive={true}
              />
            ))}
          {activeView === "finished" &&
            finishedElections.map((election) => (
              <ElectionCard
                key={election.id}
                election={election}
                isActive={false}
              />
            ))}
          {activeView === "new" && (
            <form className="create-election-form">
              <div className="mb-3">
                <label htmlFor="electionTitle" className="form-label">
                  Election Title
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="electionTitle"
                  placeholder="Enter election title"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="electionDescription" className="form-label">
                  Description
                </label>
                <textarea
                  className="form-control"
                  id="electionDescription"
                  rows="3"
                  placeholder="Enter election description"
                ></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="electionEndDate" className="form-label">
                  End Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="electionEndDate"
                />
              </div>
              <button type="submit" className="btn btn-create">
                Create Election
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
