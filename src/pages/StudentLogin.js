import React from 'react';

function StudentLogin() {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h2>Student Login</h2>
      <form>
        <input 
          type="text" 
          placeholder="Enter Roll Number (e.g., 21ABC123)" 
          style={{ 
            padding: '12px', 
            margin: '10px', 
            width: '250px',
            fontSize: '16px',
            border: '2px solid #ddd',
            borderRadius: '5px'
          }}
        />
        <br />
        <button type="submit" style={{ 
          padding: '12px 30px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px'
        }}>
          View My Results
        </button>
      </form>
    </div>
  );
}

export default StudentLogin;