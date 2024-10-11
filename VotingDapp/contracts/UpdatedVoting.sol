// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

  Candidate[] public candidates;

    struct Election {
        uint id;
        string name;
        mapping(uint => Candidate) candidates;
        uint candidateCount;
    }

    mapping(address => bool) public voters;
    mapping(uint => Election) public elections;
    uint public electionCount;

    // Add an event to log new elections
    event ElectionCreated(uint electionId, string name);

    // Add an event to log new candidates
    event CandidateAdded(uint electionId, uint candidateId, string candidateName);

    // Add an event for vote casting
    event Voted(uint electionId, uint candidateId);
    
    function addElection(string memory _name) public {
    electionCount++;
    elections[electionCount].id = electionCount;
    elections[electionCount].name = _name;
    elections[electionCount].candidateCount = 0;

    emit ElectionCreated(electionCount, _name);
}
function addCandidate(uint _electionId, string memory _candidateName) public {
    Election storage election = elections[_electionId];
    election.candidateCount++;
    election.candidates[election.candidateCount] = Candidate(election.candidateCount, _candidateName, 0);

    emit CandidateAdded(_electionId, election.candidateCount, _candidateName);
}
function vote(uint _electionId, uint _candidateId) public {

    require(!voters[msg.sender], "You have already voted.");
        
    require(_candidateId < candidates.length, "Invalid candidate index.");       
    Election storage election = elections[_electionId];
    election.candidates[_candidateId].voteCount++;
     // we make the voting status to true
    voters[msg.sender] = true;

    emit Voted(_electionId, _candidateId);
}

function getCandidate(uint _electionId) public payable returns   (Candidate[] memory) {
    // Fetch the candidate from the election's mapping of candidates

    delete candidates;
      for (uint256 i = _electionId; i <= elections[_electionId].candidateCount; i++) {
        Candidate memory candidate = elections[_electionId].candidates[i];
        candidates.push(Candidate({
            id:candidate.id,
            name:candidate.name,
            voteCount:candidate.voteCount
        }));
    }
    
     return candidates;
}

}