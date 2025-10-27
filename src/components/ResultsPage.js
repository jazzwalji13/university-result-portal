import React from 'react';

const ResultsPage = ({ studentData, onBack }) => {
  // Default mock data if no studentData provided
  const results = studentData || {
    rollNumber: "21CSC201J",
    name: "John Doe",
    semester: "3rd Year - 1st Semester",
    program: "B.Tech Computer Science and Engineering",
    courses: [
      { code: "21CSC301T", name: "Formal Language Automata", grade: "A", marks: 92, credits: 3 },
      { code: "21CSC302J", name: "Computer Networks", grade: "B+", marks: 85, credits: 4 },
      { code: "21CSE354T", name: "Full Stack Development", grade: "A", marks: 95, credits: 3 },
      { code: "21MAT301M", name: "Discrete Mathematics", grade: "A-", marks: 88, credits: 4 },
      { code: "21CSE351T", name: "Software Engineering", grade: "B+", marks: 87, credits: 3 }
    ]
  };

  const calculateSGPA = () => {
    const gradePoints = {
      'A': 10, 'A-': 9, 'B+': 8, 'B': 7, 'B-': 6, 'C': 5, 'F': 0
    };
    
    let totalCredits = 0;
    let totalPoints = 0;
    
    results.courses.forEach(course => {
      const points = gradePoints[course.grade] || 0;
      totalPoints += points * course.credits;
      totalCredits += course.credits;
    });
    
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
  };

  return (
    <div className="results-page">
      <div className="results-container">
        <div className="results-header">
          <h2>🎓 Academic Results</h2>
          <p>SRM Institute of Science and Technology, Tiruchirappalli</p>
        </div>

        <div className="student-info-card">
          <h3>Student Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Name:</label>
              <span>{results.name}</span>
            </div>
            <div className="info-item">
              <label>Roll Number:</label>
              <span>{results.rollNumber}</span>
            </div>
            <div className="info-item">
              <label>Program:</label>
              <span>{results.program}</span>
            </div>
            <div className="info-item">
              <label>Semester:</label>
              <span>{results.semester}</span>
            </div>
          </div>
        </div>

        <div className="results-card">
          <h3>Course Performance</h3>
          <div className="results-table-container">
            <table className="results-table">
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>Course Name</th>
                  <th>Credits</th>
                  <th>Grade</th>
                  <th>Marks</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {results.courses.map((course, index) => (
                  <tr key={index}>
                    <td>{course.code}</td>
                    <td>{course.name}</td>
                    <td>{course.credits}</td>
                    <td className={`grade grade-${course.grade}`}>{course.grade}</td>
                    <td>{course.marks}/100</td>
                    <td className="status-pass">Completed</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="performance-summary">
          <h3>Performance Summary</h3>
          <div className="summary-grid">
            <div className="summary-card">
              <h4>Semester GPA</h4>
              <div className="gpa-value">{calculateSGPA()}</div>
              <p>Out of 10.0</p>
            </div>
            <div className="summary-card">
              <h4>Total Credits</h4>
              <div className="credits-value">{results.courses.reduce((sum, course) => sum + course.credits, 0)}</div>
              <p>This Semester</p>
            </div>
            <div className="summary-card">
              <h4>Overall Status</h4>
              <div className="status-pass">PASS</div>
              <p>All courses completed</p>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button className="print-btn">🖨️ Print Results</button>
          <button className="download-btn">📥 Download PDF</button>
          <button onClick={onBack} className="back-btn">← Back to Home</button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;