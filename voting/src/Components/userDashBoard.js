import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaHourglassEnd } from "react-icons/fa";

const UserDashboard = () => {
  const [activeView, setActiveView] = useState("active");
  const navigate = useNavigate();

  const handleClick = () => {
    // Perform any logic you need before navigation
    navigate("/voting");
  };
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
    <div className="card  user-dashboard-election-card">
      <div className="card-user-body">
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
        <button
          className={`btn ${isActive ? "btn-manage" : "btn-view"}`}
          onClick={handleClick}
        >
          {isActive ? "More" : "View Results"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="user-dashboard-container">
      <div className="user-dashboard-main-content">
        <div className="user-dashboard-menu">
          <button
            className={`menu-btn ${activeView === "active" ? "active" : ""}`}
            onClick={() => setActiveView("active")}
          >
            <FaCheckCircle /> Active Elections
          </button>
          <button
            className={`menu-btn ${activeView === "finished" ? "active" : ""}`}
            onClick={() => setActiveView("finished")}
          >
            <FaHourglassEnd /> Finished Elections
          </button>
        </div>
        <h1 className="main-title">
          {activeView === "active" ? "Active Elections" : "Finished Elections"}
        </h1>
        <div className="user-dashboard-election-grid">
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
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
