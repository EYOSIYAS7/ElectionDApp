import React, { useState } from "react";
import { ethers } from "ethers";
import UserDashboard from "./userDashBoard";
import { useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaHourglassHalf,
  FaUsers,
  FaClipboardList,
  FaVoteYea,
  FaAngleRight,
} from "react-icons/fa";

const VotingHome = (props) => {
  const navigate = useNavigate();
  const [loged, setLoged] = useState(false);
  // Placeholder data

  async function connectWithMetamask() {
    if (window.ethereum) {
      const Provider = new ethers.providers.Web3Provider(window.ethereum);

      await Provider.send("eth_requestAccounts", []);
      const signer = Provider.getSigner();
      const address = await signer.getAddress();
      console.log("connected address: " + address);
      props.setAccount(address);
      props.setConnected(true);
      setLoged(true);
      props.canVote();
    } else {
      console.log("Metamask is not detected in your browser");
    }
    props.getCandidates();
  }

  return (
    <div>
      {loged ? (
        navigate("/user-dashboard")
      ) : (
        <div className="voting-home-container">
          {/* Introduction Section */}
          <section className="intro-section">
            <h1>Welcome to Our Voting Platform</h1>
            <p>
              Empowering citizens through secure and accessible online voting.
              Participate in local and national elections from the comfort of
              your home.
            </p>
            <button className="intro-button" onClick={connectWithMetamask}>
              <FaAngleRight /> Connect Wallet to Start Voting
            </button>
          </section>

          {/* How It Works Section */}
          <section className="how-it-works-section">
            <h2>How It Works</h2>
            <div className="steps">
              <div className="step">
                <FaUsers className="step-icon" />
                <h3>Step 1: Connect Wallet</h3>
                <p>Use MetaMask to connect your account securely.</p>
              </div>
              <div className="step">
                <FaClipboardList className="step-icon" />
                <h3>Step 2: Select Election</h3>
                <p>Browse the active elections and choose one to vote in.</p>
              </div>
              <div className="step">
                <FaVoteYea className="step-icon" />
                <h3>Step 3: Vote</h3>
                <p>Cast your vote securely on the blockchain.</p>
              </div>
            </div>
          </section>

          {/* Election Lists Section */}

          {/* Footer */}
          {/* <footer className="footer">
        <p>&copy; 2024 Voting dApp. All rights reserved.</p>
      </footer> */}
        </div>
      )}
    </div>
  );
};

export default VotingHome;
