import React from 'react';

const HomePage = ({ onStudentLogin, onAdminLogin }) => {
  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>🎓 University Result Portal</h1>
        <p className="subtitle">SRM Institute of Science & Technology, Tiruchirappalli</p>
        <p className="description">
          Secure, validated, and transparent result management system 
          integrating Formal Language Automata, Computer Networks, and Full Stack Development concepts.
        </p>
      </div>

      <div className="login-options">
        <div className="option-card student-option">
          <h3>👨‍🎓 Student Portal</h3>
          <p>View your semester results with secure validation</p>
          <button onClick={onStudentLogin} className="option-btn primary">
            Student Login
          </button>
        </div>

        <div className="option-card admin-option">
          <h3>👨‍🏫 Admin Portal</h3>
          <p>Manage results and student data</p>
          <button onClick={onAdminLogin} className="option-btn secondary">
            Admin Login
          </button>
        </div>
      </div>

      <div className="features-section">
        <h2>✨ Core Features</h2>
        <div className="features-grid">
          <div className="feature">
            <div className="feature-icon">🔒</div>
            <h4>Formal Language Validation</h4>
            <p>Regex and automata-based input validation</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🌐</div>
            <h4>Network Routing Simulation</h4>
            <p>Visual data flow demonstration</p>
          </div>
          <div className="feature">
            <div className="feature-icon">📊</div>
            <h4>Real-time Results</h4>
            <p>Instant access to academic performance</p>
          </div>
          <div className="feature">
            <div className="feature-icon">✅</div>
            <h4>Error Prevention</h4>
            <p>Automatic data integrity checks</p>
          </div>
        </div>
      </div>

      <div className="course-integration">
        <h2>📚 Course Integration</h2>
        <div className="course-cards">
          <div className="course-card">
            <h4>21CSC301T - Formal Language Automata</h4>
            <p>Regex validation, finite automata concepts, input parsing</p>
          </div>
          <div className="course-card">
            <h4>21CSC302J - Computer Networks</h4>
            <p>Client-server architecture, data routing simulation</p>
          </div>
          <div className="course-card">
            <h4>21CSE354T - Full Stack Development</h4>
            <p>React frontend, component architecture, responsive design</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;