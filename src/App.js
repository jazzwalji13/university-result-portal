import React, { useState } from 'react';
import './App.css';

// Separate component for Student Login to maintain input focus
function StudentLogin({ onBack }) {
  const [rollNumber, setRollNumber] = useState('');
  const [error, setError] = useState('');

  // Validate roll number format (e.g., 21ABC123)
  const validateRollNumber = (roll) => {
    const regex = /^[0-9]{2}[A-Za-z]{3}[0-9]{3}$/;
    return regex.test(roll);
  };

  const handleStudentLogin = (e) => {
    e.preventDefault();
    setError('');

    if (!rollNumber) {
      setError('Please enter your roll number');
      return;
    }

    if (!validateRollNumber(rollNumber)) {
      setError('Invalid format! Use: 21ABC123 (2 numbers + 3 letters + 3 numbers)');
      return;
    }

    // If valid, show results
    alert(`✅ Valid roll number: ${rollNumber.toUpperCase()}\nFetching results...`);
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>🎓 Student Login</h2>
        <p>Enter your SRM University roll number</p>
        
        <form onSubmit={handleStudentLogin}>
          <input
            type="text"
            value={rollNumber}
            onChange={(e) => {
              setRollNumber(e.target.value.toUpperCase());
              setError(''); // Clear error when typing
            }}
            placeholder="e.g., 21CSC201J"
            className="roll-input"
            autoFocus // This automatically focuses the input
          />
          {error && <div className="error-message">❌ {error}</div>}
          
          <button type="submit" className="login-btn">
            View My Results
          </button>
        </form>

        <button onClick={onBack} className="back-btn">
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

// Separate component for Admin Page
function AdminPage({ onBack }) {
  return (
    <div className="login-page">
      <div className="login-box">
        <h2>👨‍🏫 Faculty/Admin Portal</h2>
        <p>Upload student results and manage data</p>
        
        <div className="admin-features">
          <button className="admin-option">
            📤 Upload Results (CSV)
          </button>
          <button className="admin-option">
            👥 Manage Students
          </button>
          <button className="admin-option">
            📊 View Analytics
          </button>
        </div>

        <button onClick={onBack} className="back-btn">
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

// Separate component for Home Page
function HomePage({ onStudentLogin, onAdminLogin }) {
  return (
    <div className="home-page">
      <div className="container">
        <h1>🎓 University Result Portal</h1>
        <p>SRM Institute of Science & Technology, Tiruchirappalli</p>
        
        <div className="button-container">
          <button 
            className="btn student-btn" 
            onClick={onStudentLogin}
          >
            Student Login
          </button>
          <button 
            className="btn admin-btn" 
            onClick={onAdminLogin}
          >
            Faculty/Admin Login
          </button>
        </div>

        <div className="features">
          <h2>✨ Key Features</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <h3>🔒 Secure Validation</h3>
              <p>Roll numbers and marks are validated before storage</p>
            </div>
            <div className="feature-card">
              <h3>📊 Real-time Results</h3>
              <p>Instant access to semester results</p>
            </div>
            <div className="feature-card">
              <h3>🌐 Data Flow Visualization</h3>
              <p>See how data travels through the system</p>
            </div>
            <div className="feature-card">
              <h3>✅ Error Prevention</h3>
              <p>Automatic checks prevent wrong data entry</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main App Component
function App() {
  const [currentPage, setCurrentPage] = useState('home');

  // Render the current page
  const renderPage = () => {
    switch (currentPage) {
      case 'student':
        return <StudentLogin onBack={() => setCurrentPage('home')} />;
      case 'admin':
        return <AdminPage onBack={() => setCurrentPage('home')} />;
      case 'home':
      default:
        return (
          <HomePage 
            onStudentLogin={() => setCurrentPage('student')} 
            onAdminLogin={() => setCurrentPage('admin')} 
          />
        );
    }
  };

  return renderPage();
}

export default App;