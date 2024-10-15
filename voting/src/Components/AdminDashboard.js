import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ethers } from "ethers";
import { ContractAbi, ContractAddress } from "../Constant/constant";
import { FaCheckCircle, FaHourglassEnd, FaPlusCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [activeView, setActiveView] = useState("active");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [endDate, setEndDate] = useState("");
  const [CandidatesList, setCandidatesList] = useState("");
  // Placeholder data
  const navigate = useNavigate();

  const handleClick = () => {
    // Perform any logic you need before navigation
    navigate("/result");
  };
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
        <button
          className={`btn ${isActive ? "btn-manage" : "btn-view"}`}
          onClick={handleClick}
        >
          {isActive ? "Manage Election" : "View Results"}
        </button>
      </div>
    </div>
  );
  const handleCreateElection = async (event) => {
    event.preventDefault(); // Prevent form from refreshing the page
    const Provider = new ethers.providers.Web3Provider(window.ethereum);
    // setProvider(Provider);
    await Provider.send("eth_requestAccounts", []);
    const signer = Provider.getSigner();

    const contractInstance = new ethers.Contract(
      ContractAddress,
      ContractAbi,
      Provider
    );
    if (!title || !endDate) {
      alert("Please fill in all required fields.");
      return;
    }
    console.log(contractInstance);
    try {
      // Calculate duration in minutes from now until the selected end date
      const currentTime = new Date().getTime();
      const selectedEndTime = new Date(endDate).getTime();
      const durationInMinutes = Math.floor(
        (selectedEndTime - currentTime) / 60000
      );

      if (durationInMinutes <= 0) {
        alert("Please select a valid future end date.");
        return;
      }

      // Call the smart contract function to add an election
      console.log(title);
      const tx = await contractInstance.connect(signer).addElection("title");
      await tx.wait(); // Wait for the transaction to be mined

      console.log("Election created successfully:");
      alert("Election created successfully!");

      // Reset the form after successful creation
      setTitle("");
      setDescription("");
      setEndDate("");
    } catch (error) {
      console.error("Error creating election:", error);
      alert("Failed to create election. Please try again.");
    }
  };
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
            <form
              className="create-election-form"
              onSubmit={handleCreateElection}
            >
              <div className="mb-3">
                <label htmlFor="electionTitle" className="form-label">
                  Election Title
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="electionTitle"
                  placeholder="Enter election title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="electionTitle" className="form-label">
                  Add Candidates
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="CandidatesList"
                  placeholder="Candidates"
                  value={CandidatesList}
                  onChange={(e) => setCandidatesList(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="electionEndDate" className="form-label">
                  End Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="electionEndDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
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
