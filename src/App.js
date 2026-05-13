import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Voter from './pages/Voter';
import Admin from './pages/Admin';
import Login from './pages/Login';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminLogout, setAdminLogout] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAdminLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setAdminLogout(true);
      setTimeout(() => setAdminLogout(false), 3000);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        {adminLogout && <div className="logout-notification">Admin logged out successfully!</div>}
        
        <Routes>
          <Route path="/voter" element={<Voter />} />
          <Route 
            path="/admin/*" 
            element={user ? <Admin user={user} onLogout={handleAdminLogout} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/login" 
            element={user ? <Navigate to="/admin" /> : <Login />} 
          />
          <Route path="/" element={<Navigate to="/voter" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
