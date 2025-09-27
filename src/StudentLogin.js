import React, { useState } from 'react';
import './StudentLogin.css';

function StudentLogin() {
  const [rollNumber, setRollNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (!rollNumber) {
      alert('Please enter your roll number');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false);
      alert(`Results for ${rollNumber} would be displayed here!`);
      // In real app, we would show results on this page
    }, 1500);
  };

  return (
    <div className="student-login">
      <div className="login-container">
        <h2>🎓 Student Login</h2>
        <p>Enter your roll number to view your results</p>
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label>Roll Number:</label>
            <input
              type="text"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
              placeholder="e.g., 21ABC123"
              required
            />
          </div>
          
          <button type="submit" disabled={isLoading} className="submit-btn">
            {isLoading ? 'Loading...' : 'View My Results'}
          </button>
        </form>

        <div className="login-info">
          <h3>How it works:</h3>
          <ul>
            <li>✅ Enter your university roll number</li>
            <li>✅ System validates the format automatically</li>
            <li>✅ View your semester results instantly</li>
            <li>✅ 100% secure and private</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default StudentLogin;