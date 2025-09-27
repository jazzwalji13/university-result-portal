import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>University Result Portal</h1>
      <p>Secure, validated, and transparent result management system</p>
      
      <div style={{ marginTop: '30px' }}>
        <Link to="/student">
          <button style={{ 
            margin: '10px', 
            padding: '15px 30px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}>
            Student Login
          </button>
        </Link>
        <Link to="/admin">
          <button style={{ 
            margin: '10px', 
            padding: '15px 30px',
            backgroundColor: '#008CBA',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}>
            Admin Login
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Home;