import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { FaWallet } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const AdminLogin = (props) => {
  const navigate = useNavigate();
  const [isConnecting, setIsConnecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [adminAcc, setAdminAccount] = useState(null);

  const allowedAccount = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

  async function connectWithMetamask() {
    if (window.ethereum) {
      const Provider = new ethers.providers.Web3Provider(window.ethereum);

      try {
        await Provider.send("eth_requestAccounts", []);
        const signer = Provider.getSigner();
        const address = await signer.getAddress();
        console.log("Connected address: " + address);

        if (address === allowedAccount) {
          setIsConnecting(true);
          setErrorMessage(""); // Clear any previous error
        } else {
          setIsConnecting(false);
          setErrorMessage("You are not allowed to login.");
          // Redirect to admin login
        }

        // Listen for account changes
        window.ethereum.on("accountsChanged", handleAccountChange);
      } catch (error) {
        console.error("Failed to connect to Metamask:", error);
        setErrorMessage("Failed to connect to Metamask.");
      }
    } else {
      console.log("Metamask is not detected in your browser");
      setErrorMessage("Metamask is not detected in your browser.");
    }
    props.getCandidates();
  }

  function handleAccountChange(accounts) {
    // If the account array is empty, the user has disconnected
    if (accounts.length === 0) {
      setErrorMessage("No account connected.");
      return;
    }

    const newAddress = accounts[0];
    console.log("Account switched to:", newAddress);

    // Check if the new address is allowed
    if (newAddress !== allowedAccount) {
      setErrorMessage("You are not allowed to login.");
      navigate("/admin"); // Redirect to admin login
    }
  }

  useEffect(() => {
    // Cleanup on component unmount
    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener("accountsChanged", handleAccountChange);
      }
    };
  }, []);

  // async function connectWithMetamask() {
  //   if (window.ethereum) {
  //     const Provider = new ethers.providers.Web3Provider(window.ethereum);

  //     await Provider.send("eth_requestAccounts", []);
  //     const signer = Provider.getSigner();
  //     const address = await signer.getAddress();
  //     console.log("connected address: " + address);
  //     if (address === "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266") {
  //       setIsConnecting(true);
  //       setAdminAccount(address);
  //       setErrorMessage(""); // Clear any previous error
  //     } else {
  //       setErrorMessage("You are not allowed to login.");
  //     }
  //   } else {
  //     console.log("Metamask is not detected in your browser");
  //     setErrorMessage("Metamask is not detected in your browser.");
  //   }
  //   props.getCandidates();
  // }

  return (
    <div>
      {isConnecting ? (
        navigate("/admin-dashboard")
      ) : (
        <div className="admin-login-dapp-container">
          <div className="admin-login-dapp-card">
            <div className="admin-login-dapp-header">
              <FaWallet className="admin-login-dapp-icon" />
              <h2 className="admin-login-dapp-title">Admin Portal</h2>
            </div>
            <button
              className="admin-login-dapp-btn-metamask"
              onClick={connectWithMetamask}
              // disabled={isConnecting}
            >
              Connect with metamask
            </button>
            {errorMessage && (
              <div style={{ color: "red", marginTop: "10px" }}>
                {errorMessage}
              </div>
            )}
            <p className="admin-login-dapp-note">
              Ensure you have MetaMask installed and unlocked to proceed.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLogin;
