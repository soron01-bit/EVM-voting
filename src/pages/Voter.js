import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, where, getDocs } from 'firebase/firestore';
import '../styles/Voter.css';

const PARTIES = ['BJP', 'INC', 'TMC', 'CPIM'];

function Voter() {
  const [selectedParty, setSelectedParty] = useState(null);
  const [voterId, setVoterId] = useState('');
  const [hasVoted, setHasVoted] = useState(false);
  const [votingComplete, setVotingComplete] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [requiresRegistration, setRequiresRegistration] = useState(false);

  const handleVote = async () => {
    if (!voterId.trim()) {
      setError('Please enter your Voter ID');
      return;
    }

    if (!selectedParty) {
      setError('Please select a party to vote');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Check if voter ID is registered
      const registeredVotersRef = collection(db, 'registered_voters');
      const registeredQuery = query(registeredVotersRef, where('voterId', '==', voterId));
      const registeredSnapshot = await getDocs(registeredQuery);

      if (registeredSnapshot.empty) {
        setError('This Voter ID is not registered! Please contact the election commission.');
        setRequiresRegistration(true);
        setLoading(false);
        return;
      }

      // Check if voter has already voted
      const votersRef = collection(db, 'voters');
      const q = query(votersRef, where('voterId', '==', voterId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setError('This Voter ID has already voted!');
        setLoading(false);
        return;
      }

      // Record the vote
      const votesRef = collection(db, 'votes');
      await addDoc(votesRef, {
        party: selectedParty,
        timestamp: new Date(),
      });

      // Mark voter as voted
      const voterData = {
        voterId: voterId,
        votedAt: new Date(),
        party: selectedParty,
      };
      await addDoc(votersRef, voterData);

      setVotingComplete(true);
      setHasVoted(true);
      setTimeout(() => {
        setVotingComplete(false);
        setSelectedParty(null);
        setVoterId('');
      }, 3000);
    } catch (err) {
      console.error('Voting error:', err);
      setError('An error occurred while voting. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewVoter = () => {
    setHasVoted(false);
    setSelectedParty(null);
    setVoterId('');
    setError('');
  };

  if (hasVoted && votingComplete) {
    return (
      <div className="voter-container">
        <div className="success-message">
          <div className="checkmark">✓</div>
          <h2>Vote Recorded Successfully!</h2>
          <p>Thank you for voting.</p>
        </div>
      </div>
    );
  }

  if (hasVoted && !votingComplete) {
    return (
      <div className="voter-container">
        <div className="success-message">
          <div className="checkmark">✓</div>
          <h2>Vote Recorded Successfully!</h2>
          <p>Thank you for voting.</p>
          <button onClick={handleNewVoter} className="next-voter-btn">
            Next Voter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="voter-container">
      <div className="voter-card">
        <h1>Electronic Voting Machine (EVM)</h1>
        <div className="evm-header">
          <p className="instructions">Welcome to the voting system</p>
        </div>

        <div className="voter-input-section">
          <label htmlFor="voterId">Enter Your Voter ID:</label>
          <input
            id="voterId"
            type="text"
            placeholder="Enter Voter ID"
            value={voterId}
            onChange={(e) => setVoterId(e.target.value)}
            className="voter-id-input"
            disabled={loading}
          />
        </div>

        <div className="parties-section">
          <h3>Select Your Party:</h3>
          <div className="parties-grid">
            {PARTIES.map((party) => (
              <div
                key={party}
                onClick={() => !loading && setSelectedParty(party)}
                className={`party-card ${selectedParty === party ? 'selected' : ''}`}
              >
                <div className="party-circle">
                  {selectedParty === party && <span className="checkmark-party">✓</span>}
                </div>
                <p className="party-name">{party}</p>
              </div>
            ))}
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button
          onClick={handleVote}
          disabled={loading || !selectedParty || !voterId.trim()}
          className="vote-button"
        >
          {loading ? 'Processing...' : 'CAST VOTE'}
        </button>

        <div className="instructions-box">
          <h4>Instructions:</h4>
          <ul>
            <li>Enter your registered Voter ID</li>
            <li>Select the party you wish to vote for</li>
            <li>Click "CAST VOTE" to submit your vote</li>
            <li>Each Voter ID can only vote once</li>
            <li>Only registered voters are allowed to vote</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Voter;
