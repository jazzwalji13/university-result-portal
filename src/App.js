import React, { useState } from 'react';
import AdminLogin from './components/AdminLogin';
import StudentDashboard from './components/StudentDashboard';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('home');

  const renderHomePage = () => (
    <div className="home-container">
      <div className="hero-section">
        <h1>🎓 University Result Portal</h1>
        <p>Manage and access academic results seamlessly</p>
      </div>
      
      <div className="role-selection">
        <div className="role-card" onClick={() => setCurrentView('admin')}>
          <div className="role-icon">👨‍🏫</div>
          <h3>Admin Login</h3>
          <p>Manage results, upload bulk data, and analytics</p>
          <button className="role-btn">Admin Access</button>
        </div>
        
        <div className="role-card" onClick={() => setCurrentView('student')}>
          <div className="role-icon">🎓</div>
          <h3>Student Portal</h3>
          <p>Check your results and download marksheets</p>
          <button className="role-btn">View Results</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="App">
      {currentView === 'home' && renderHomePage()}
      {currentView === 'admin' && <AdminLogin onBack={() => setCurrentView('home')} />}
      {currentView === 'student' && <StudentDashboard onBack={() => setCurrentView('home')} />}
    </div>
  );
}

export default App;