import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { ContractAbi, ContractAddress } from "./Constant/constant";
import Login from "./Components/Login";
import AdminDashboard from "./Components/AdminDashboard";
import UserDashboard from "./Components/userDashBoard";
import AdminLogin from "./Components/AdminLogin";
import MockVoting from "./Components/mockVoting";
import Elections from "./Components/Elections";
import Candidate from "./Components/Candidate";
import "./App.css";
import VotingResult from "./Components/VotingResult";
function App2() {
  const [toggle, setToggle] = useState(false);
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setConnected] = useState(false);

  const [Candidates, setCandidates] = useState([]);
  // const [number, setNumber] = useState(null);
  const [voterStatus, setVoterStatus] = useState(false);
  const [CandidateIndex, setCandidateIndex] = useState(null);

  useEffect(() => {
    // getCurrentStatus();
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }
    // we needed to remove it when the component unmounted.
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      }
    };
  });

  function handleAccountsChanged(accounts) {
    if (accounts.length > 0 && account !== accounts[0]) {
      setAccount(accounts[0]);
      canVote();
      getCandidates();
    } else {
      setConnected(false);
      setAccount(null);
      getCandidates();
    }
  }

  async function getCandidates() {
    const Provider = new ethers.providers.Web3Provider(window.ethereum);
    // await Provider.send("eth_requestAccounts", []);
    // const signer = Provider.getSigner();
    const contractInstance = new ethers.Contract(
      ContractAddress,
      ContractAbi,
      Provider
    );
    const candidates = await contractInstance.getAllVotesOfCandidates();

    const formattedCandidates = candidates.map((candidates, index) => {
      return {
        index: index,
        name: candidates.name,
        voteCount: candidates.voteCount.toNumber(),
      };
    });
    console.log(formattedCandidates);
    setCandidates(formattedCandidates);
  }

  async function canVote() {
    const Provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(Provider);
    await Provider.send("eth_requestAccounts", []);
    const signer = Provider.getSigner();

    const contractInstance = new ethers.Contract(
      ContractAddress,
      ContractAbi,
      Provider
    );
    // get the eligibility status and set it to VoterStatus
    // this kind of functions just read data from the blockchain
    const voteStatus = await contractInstance.voters(await signer.getAddress());
    console.log("Voter status from the contract", voteStatus);
    console.log(
      "the voter status before setting it to voterStatus",
      voterStatus
    );
    setVoterStatus(voteStatus);
  }
  const toggleHandler = (index) => {
    toggle ? setToggle(false) : setToggle(true);
    setCandidateIndex(index);
  };
  return (
    <Router>
      <Routes>
        <Route
          path="/admin"
          element={
            <AdminLogin account={account} getCandidates={getCandidates} />
          }
        />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route
          path="/voting"
          element={
            <MockVoting
              account={account}
              getCandidates={getCandidates}
              canVote={canVote}
              candidates={Candidates}
              eligibility={voterStatus}
              toggleHandler={toggleHandler}
            />
          }
        />
        <Route
          path="/result"
          element={
            <VotingResult
              account={account}
              getCandidates={getCandidates}
              canVote={canVote}
              candidates={Candidates}
              eligibility={voterStatus}
              toggleHandler={toggleHandler}
            />
          }
        />
        <Route
          path="/"
          element={
            <Elections
              setAccount={setAccount}
              setConnected={setConnected}
              canVote={canVote}
              getCandidates={getCandidates}
            />
          }
        />
        <Route path="/candidate/:index" element={<Candidate />} />
      </Routes>
    </Router>
  );
}

export default App2;
