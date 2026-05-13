import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import '../styles/Admin.css';

const PARTIES = ['BJP', 'INC', 'TMC', 'CPIM'];

function Admin({ user, onLogout }) {
  const [voteCount, setVoteCount] = useState({});
  const [totalVotes, setTotalVotes] = useState(0);
  const [voters, setVoters] = useState([]);
  const [registeredVoters, setRegisteredVoters] = useState([]);
  const [activeTab, setActiveTab] = useState('results');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [newVoterId, setNewVoterId] = useState('');
  const [registrationMessage, setRegistrationMessage] = useState('');
  const [registrationLoading, setRegistrationLoading] = useState(false);

  useEffect(() => {
    // Initialize vote counts
    const initialCounts = {};
    PARTIES.forEach(party => {
      initialCounts[party] = 0;
    });
    setVoteCount(initialCounts);

    // Real-time listener for votes
    const votesRef = collection(db, 'votes');
    const unsubscribe = onSnapshot(votesRef, (snapshot) => {
      const counts = { ...initialCounts };
      let total = 0;

      snapshot.forEach((doc) => {
        const party = doc.data().party;
        if (counts[party] !== undefined) {
          counts[party]++;
          total++;
        }
      });

      setVoteCount(counts);
      setTotalVotes(total);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Load voters list
    const loadVoters = async () => {
      try {
        const votersRef = collection(db, 'voters');
        const snapshot = await getDocs(votersRef);
        const votersList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setVoters(votersList.sort((a, b) => b.votedAt?.toDate?.().getTime?.() - a.votedAt?.toDate?.().getTime?.() || 0));
      } catch (error) {
        console.error('Error loading voters:', error);
      }
    };

    loadVoters();
  }, []);

  useEffect(() => {
    // Real-time listener for registered voters
    const registeredVotersRef = collection(db, 'registered_voters');
    const unsubscribe = onSnapshot(registeredVotersRef, (snapshot) => {
      const votersList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRegisteredVoters(votersList.sort((a, b) => b.registeredAt?.toDate?.().getTime?.() - a.registeredAt?.toDate?.().getTime?.() || 0));
    });

    return () => unsubscribe();
  }, []);

  const handleResetVotes = async () => {
    try {
      // Get all votes and voters documents
      const votesRef = collection(db, 'votes');
      const votersRef = collection(db, 'voters');

      const votesSnapshot = await getDocs(votesRef);
      const votersSnapshot = await getDocs(votersRef);

      // Delete all votes
      votesSnapshot.forEach((voteDoc) => {
        voteDoc.ref.delete();
      });

      // Delete all voters
      votersSnapshot.forEach((voterDoc) => {
        voterDoc.ref.delete();
      });

      setVoteCount(PARTIES.reduce((acc, party) => {
        acc[party] = 0;
        return acc;
      }, {}));
      setTotalVotes(0);
      setVoters([]);
      setShowResetConfirm(false);
      alert('All votes have been reset successfully!');
    } catch (error) {
      console.error('Error resetting votes:', error);
      alert('Error resetting votes');
    }
  };

  const getWinningParty = () => {
    if (totalVotes === 0) return null;
    let maxVotes = 0;
    let winner = null;
    Object.entries(voteCount).forEach(([party, count]) => {
      if (count > maxVotes) {
        maxVotes = count;
        winner = party;
      }
    });
    return winner;
  };

  const getPercentage = (party) => {
    if (totalVotes === 0) return 0;
    return ((voteCount[party] || 0) / totalVotes * 100).toFixed(2);
  };

  const handleRegisterVoter = async (e) => {
    e.preventDefault();
    setRegistrationMessage('');
    
    if (!newVoterId.trim()) {
      setRegistrationMessage({ type: 'error', text: 'Please enter a Voter ID' });
      return;
    }

    setRegistrationLoading(true);

    try {
      // Check if voter ID already registered
      const existing = registeredVoters.find(v => v.voterId === newVoterId.trim());
      if (existing) {
        setRegistrationMessage({ type: 'error', text: 'This Voter ID is already registered!' });
        setRegistrationLoading(false);
        return;
      }

      // Register new voter
      const registeredVotersRef = collection(db, 'registered_voters');
      await addDoc(registeredVotersRef, {
        voterId: newVoterId.trim(),
        registeredAt: new Date(),
        status: 'pending',
        allowed: false
      });

      setRegistrationMessage({ type: 'success', text: `Voter ID "${newVoterId.trim()}" registered successfully!` });
      setNewVoterId('');
      setTimeout(() => setRegistrationMessage(''), 3000);
    } catch (error) {
      console.error('Error registering voter:', error);
      setRegistrationMessage({ type: 'error', text: 'Error registering voter' });
    } finally {
      setRegistrationLoading(false);
    }
  };

  const handleRemoveVoter = async (voterId) => {
    try {
      const voterDoc = registeredVoters.find(v => v.voterId === voterId);
      if (voterDoc) {
        await deleteDoc(doc(db, 'registered_voters', voterDoc.id));
        setRegistrationMessage({ type: 'success', text: `Voter ID "${voterId}" removed from registration` });
        setTimeout(() => setRegistrationMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error removing voter:', error);
      setRegistrationMessage({ type: 'error', text: 'Error removing voter' });
    }
  };

  const handleToggleAllowVoter = async (voterId, currentAllowedStatus) => {
    try {
      const voterDoc = registeredVoters.find(v => v.voterId === voterId);
      if (voterDoc) {
        const voterRef = doc(db, 'registered_voters', voterDoc.id);
        // Use updateDoc instead of addDoc to update specific field
        const { updateDoc } = await import('firebase/firestore');
        await updateDoc(voterRef, {
          allowed: !currentAllowedStatus
        });
        const statusText = !currentAllowedStatus ? 'allowed' : 'not allowed';
        setRegistrationMessage({ type: 'success', text: `Voter ID "${voterId}" is now ${statusText} to vote` });
        setTimeout(() => setRegistrationMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error toggling voter status:', error);
      setRegistrationMessage({ type: 'error', text: 'Error updating voter status' });
    }
  };

  const winner = getWinningParty();

  return (
    <div className="admin-container">
      <nav className="admin-navbar">
        <div className="navbar-content">
          <h1>⚖️ Election Commission Dashboard</h1>
          <div className="navbar-actions">
            <span className="admin-email">Admin: {user?.email}</span>
            <button onClick={onLogout} className="logout-button">Logout</button>
          </div>
        </div>
      </nav>

      <div className="admin-tabs">
        <button
          className={`tab-button ${activeTab === 'results' ? 'active' : ''}`}
          onClick={() => setActiveTab('results')}
        >
          📊 Vote Results
        </button>
        <button
          className={`tab-button ${activeTab === 'voters' ? 'active' : ''}`}
          onClick={() => setActiveTab('voters')}
        >
          👥 Voter List
        </button>
        <button
          className={`tab-button ${activeTab === 'register' ? 'active' : ''}`}
          onClick={() => setActiveTab('register')}
        >
          ➕ Register Voters
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'results' && (
          <div className="results-section">
            <div className="stats-card">
              <h2>Total Votes Cast</h2>
              <div className="total-votes">{totalVotes}</div>
            </div>

            {winner && (
              <div className="winner-card">
                <h3>🏆 Leading Party</h3>
                <div className="winner-info">
                  <p className="winner-party">{winner}</p>
                  <p className="winner-votes">{voteCount[winner]} votes</p>
                </div>
              </div>
            )}

            <div className="results-grid">
              {PARTIES.map((party) => (
                <div key={party} className="party-result-card">
                  <div className="party-header">
                    <h3>{party}</h3>
                    <span className={`badge ${winner === party ? 'winner' : ''}`}>
                      {voteCount[party] || 0}
                    </span>
                  </div>

                  <div className="progress-bar-container">
                    <div
                      className={`progress-bar ${winner === party ? 'winner-bar' : ''}`}
                      style={{ width: `${getPercentage(party)}%` }}
                    ></div>
                  </div>

                  <div className="party-stats">
                    <span className="votes">{voteCount[party] || 0} votes</span>
                    <span className="percentage">{getPercentage(party)}%</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="chart-container">
              <h3>Vote Distribution</h3>
              <div className="bar-chart">
                {PARTIES.map((party) => (
                  <div key={party} className="chart-bar">
                    <div className="bar-label">{party}</div>
                    <div className="bar-wrapper">
                      <div
                        className={`bar ${winner === party ? 'winner-bar' : ''}`}
                        style={{ height: totalVotes === 0 ? '0%' : `${(voteCount[party] / totalVotes * 100)}%` }}
                      ></div>
                    </div>
                    <div className="bar-value">{voteCount[party] || 0}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="admin-actions">
              <button
                onClick={() => setShowResetConfirm(true)}
                className="reset-button danger"
              >
                🔄 Reset All Votes
              </button>
            </div>

            {showResetConfirm && (
              <div className="modal-overlay">
                <div className="modal">
                  <h3>⚠️ Confirm Reset</h3>
                  <p>Are you sure you want to reset all votes? This action cannot be undone.</p>
                  <div className="modal-buttons">
                    <button onClick={handleResetVotes} className="confirm-button danger">
                      Yes, Reset All
                    </button>
                    <button onClick={() => setShowResetConfirm(false)} className="cancel-button">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'voters' && (
          <div className="voters-section">
            <div className="voters-header">
              <h2>Registered Voters</h2>
              <span className="voter-count">Total: {voters.length}</span>
            </div>

            {voters.length === 0 ? (
              <div className="empty-state">
                <p>No votes recorded yet.</p>
              </div>
            ) : (
              <div className="voters-table">
                <table>
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Voter ID</th>
                      <th>Party Voted</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {voters.map((voter, index) => (
                      <tr key={voter.id}>
                        <td>{index + 1}</td>
                        <td className="voter-id">{voter.voterId}</td>
                        <td>
                          <span className="party-badge">{voter.party}</span>
                        </td>
                        <td className="time">
                          {voter.votedAt?.toDate?.()?.toLocaleString?.() || 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'register' && (
          <div className="register-section">
            <div className="register-card">
              <h2>📋 Register New Voters</h2>
              <p className="register-description">
                Add voter IDs that will be allowed to participate in the election. Only registered voters will be able to cast their vote.
              </p>

              <form onSubmit={handleRegisterVoter} className="register-form">
                <div className="form-group">
                  <label htmlFor="voterId">Voter ID:</label>
                  <input
                    id="voterId"
                    type="text"
                    value={newVoterId}
                    onChange={(e) => setNewVoterId(e.target.value)}
                    placeholder="Enter Voter ID (e.g., V001, V123)"
                    disabled={registrationLoading}
                    className="voter-input"
                  />
                </div>

                {registrationMessage && (
                  <div className={`message ${registrationMessage.type}`}>
                    {registrationMessage.type === 'success' ? '✓' : '✗'} {registrationMessage.text}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={registrationLoading || !newVoterId.trim()}
                  className="register-button"
                >
                  {registrationLoading ? 'Registering...' : '➕ Register Voter'}
                </button>
              </form>

              <div className="registered-voters">
                <h3>Registered Voter IDs ({registeredVoters.length})</h3>
                
                {registeredVoters.length === 0 ? (
                  <div className="empty-state">
                    <p>No voters registered yet.</p>
                  </div>
                ) : (
                  <div className="voters-list">
                    <table>
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>Voter ID</th>
                          <th>Voting Status</th>
                          <th>Allowed?</th>
                          <th>Registered At</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {registeredVoters.map((voter, index) => {
                          const hasVoted = voters.some(v => v.voterId === voter.voterId);
                          const isAllowed = voter.allowed === true;
                          return (
                            <tr key={voter.id}>
                              <td>{index + 1}</td>
                              <td className="voter-id">{voter.voterId}</td>
                              <td>
                                <span className={`status-badge ${hasVoted ? 'voted' : 'pending'}`}>
                                  {hasVoted ? '✓ Voted' : '⏳ Pending'}
                                </span>
                              </td>
                              <td>
                                <span className={`allow-badge ${isAllowed ? 'allowed' : 'not-allowed'}`}>
                                  {isAllowed ? '✓ Allowed' : '✗ Not Allowed'}
                                </span>
                              </td>
                              <td className="time">
                                {voter.registeredAt?.toDate?.()?.toLocaleString?.() || 'N/A'}
                              </td>
                              <td>
                                <button
                                  onClick={() => handleToggleAllowVoter(voter.voterId, isAllowed)}
                                  className={`toggle-allow-button ${isAllowed ? 'disallow' : 'allow'}`}
                                  title={isAllowed ? 'Disallow this voter' : 'Allow this voter to vote'}
                                >
                                  {isAllowed ? '🚫 Disallow' : '✓ Allow'}
                                </button>
                                <button
                                  onClick={() => handleRemoveVoter(voter.voterId)}
                                  className="remove-button"
                                  title="Remove this voter"
                                >
                                  ✕
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
