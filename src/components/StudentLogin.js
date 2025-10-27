import React, { useState } from 'react';

const StudentLogin = ({ onLogin, onBack }) => {
  const [rollNumber, setRollNumber] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateRollNumber = (roll) => {
    const rollNumberRegex = /^[0-9]{2}[A-Za-z]{3}[0-9]{3}$/;
    return rollNumberRegex.test(roll);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!rollNumber.trim()) {
      setError('Please enter your roll number');
      return;
    }

    if (!validateRollNumber(rollNumber)) {
      setError('Invalid format! Must be: 2 numbers + 3 letters + 3 numbers (e.g., 21CSC201J)');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onLogin(rollNumber.toUpperCase());
    }, 1500);
  };

  return (
    <div className="student-login-page">
      <div className="login-container">
        <div className="login-header">
          <h2>🎓 Student Login</h2>
          <p>Enter your roll number to access your results</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="rollNumber">Roll Number</label>
            <input
              id="rollNumber"
              type="text"
              value={rollNumber}
              onChange={(e) => {
                setRollNumber(e.target.value.toUpperCase());
                setError('');
              }}
              placeholder="e.g., 21CSC201J"
              className={error ? 'error' : ''}
              disabled={isLoading}
            />
          </div>

          {error && <div className="error-message">❌ {error}</div>}

          <button 
            type="submit" 
            className={`submit-btn ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Validating...
              </>
            ) : (
              'View My Results'
            )}
          </button>
        </form>

        <div className="login-info">
          <h4>📋 Format Requirements</h4>
          <ul>
            <li>• 2 digits (Year) + 3 letters (Branch) + 3 digits (Number)</li>
            <li>• Example: <code>21CSC201J</code></li>
            <li>• Case insensitive</li>
          </ul>
        </div>

        <button onClick={onBack} className="back-btn">
          ← Back to Home
        </button>
      </div>
    </div>
  );
};

export default StudentLogin;