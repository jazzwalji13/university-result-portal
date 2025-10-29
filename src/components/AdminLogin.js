import React, { useState } from 'react';

const AdminLogin = ({ onBack }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [csvData, setCsvData] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  // Backend API base URL - POINTS TO YOUR SQLITE BACKEND
  const API_BASE_URL = 'http://localhost:5000/api';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const result = await response.json();

      if (result.success) {
        setIsLoggedIn(true);
        setError('');
        // Store token for future requests
        localStorage.setItem('adminToken', result.token);
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (error) {
      setError('Cannot connect to server. Make sure backend is running on port 5000.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCredentials({ username: '', password: '' });
    setCsvData([]);
    setUploadStatus('');
    setValidationErrors([]);
    localStorage.removeItem('adminToken');
  };

  // Handle CSV file selection - CONNECTED TO BACKEND
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setUploadStatus('❌ Please select a CSV file');
      return;
    }

    setUploadStatus('📁 Processing CSV file...');
    uploadCSVToBackend(file);
  };

  // UPDATED: Upload CSV to SQLite backend
 const uploadCSVToBackend = async (file) => {
  setIsUploading(true);
  
  try {
    const fileText = await readFileAsText(file);
    
    const response = await fetch(`${API_BASE_URL}/upload/csv-results`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: fileText,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Upload failed');
    }

   // Handle different response scenarios
if (result.errors && result.errors.length > 0) {
  setValidationErrors(result.errors);
  setUploadStatus('❌ Validation errors found during upload');
} else if (result.warnings && result.warnings.length > 0) {
  // Show updates as positive messages
  const updateMessages = result.warnings.map(warning => 
    warning.replace('Updated existing result for', '✅ Updated')
  );
  setValidationErrors(updateMessages);
  setUploadStatus(`✅ Successfully processed ${result.totalRecords} records!`);
} else {
  setCsvData(result.results || []);
  setValidationErrors([]);
  setUploadStatus(`✅ Successfully uploaded ${result.savedRecords} new records!`);
}

  } catch (error) {
    console.error('Upload error:', error);
    setUploadStatus(`❌ Upload failed: ${error.message}`);
  } finally {
    setIsUploading(false);
  }
};
  // Helper function to read file as text
  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };

  // UPDATED: Real backend upload to publish results
  const handleUploadToServer = async () => {
    if (csvData.length === 0) {
      setUploadStatus('❌ No data to upload');
      return;
    }

    setIsUploading(true);
    setUploadStatus('⏳ Publishing results to students...');

    try {
      // Extract unique roll numbers from csvData
      const rollNumbers = [...new Set(csvData.map(row => row.rollNumber))];
      
      const response = await fetch(`${API_BASE_URL}/results/publish`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rollNumbers }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Publish failed');
      }

      setUploadStatus(`✅ Successfully published ${result.modifiedCount} results to students!`);
      setCsvData([]);
      setValidationErrors([]);
      
      // Clear file input
      const fileInput = document.getElementById('csv-file');
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      setUploadStatus(`❌ Publish failed: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Download CSV template - UPDATED WITH UNIQUE DATA
const downloadTemplate = () => {
  const template = `rollNumber,courseCode,marks,studentName,courseName,semester,examType,published
21CSC201J,21CSC301T,85,John Doe,Data Structures,3,Final,true
21CSC202J,21CSC301T,92,Jane Smith,Data Structures,3,Final,true
21CSC203J,21CSC302T,78,Mike Johnson,Algorithms,3,Final,true
21CSC204J,21MAT101T,88,Sarah Wilson,Mathematics,3,Final,true
21CSC205J,21PHY201T,95,David Brown,Physics,3,Final,true
21CSC206J,21CSC303T,82,Emily Davis,Database Systems,3,Final,true
21CSC207J,21MAT102T,76,Robert Wilson,Calculus,3,Final,true
21CSC208J,21CSC304T,89,Lisa Anderson,Web Development,3,Final,true
21CSC209J,21PHY202T,91,James Miller,Electronics,3,Final,true
21CSC210J,21CSC305T,84,Sophia Lee,Software Engineering,3,Final,true`;

  const blob = new Blob([template], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'result_upload_template.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
  
  setUploadStatus('📋 Template downloaded successfully! Use unique roll numbers and course codes.');
};

  // FIXED: Student Management Handler
  const handleStudentManagement = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/students`);
      const data = await response.json();
      setUploadStatus(`🎓 Student Management: ${data.total} students in database`);
      
      // Show student list
      if (data.students && data.students.length > 0) {
        const studentList = data.students.slice(0, 3).map(s => 
          `${s.rollNumber} - ${s.studentName}`
        ).join(', ');
        setUploadStatus(prev => prev + ` | Recent: ${studentList}...`);
      }
    } catch (error) {
      setUploadStatus('❌ Cannot connect to student database');
    }
  };

  // FIXED: Analytics Handler
  const handleViewAnalytics = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/results/stats`);
      const data = await response.json();
      setUploadStatus(
        `📊 Analytics: ${data.totalResults} total results, ${data.publishedResults} published, ${data.totalStudents} students`
      );
    } catch (error) {
      setUploadStatus('❌ Cannot load analytics data');
    }
  };

  // FIXED: Course Management Handler
  const handleCourseManagement = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/results/stats`);
      const data = await response.json();
      
      if (data.courseStats && data.courseStats.length > 0) {
        const courseInfo = data.courseStats.slice(0, 3).map(c => 
          `${c.courseCode} (Avg: ${Math.round(c.averageMarks)})`
        ).join(', ');
        setUploadStatus(`📚 Course Management: ${data.courseStats.length} courses | ${courseInfo}...`);
      } else {
        setUploadStatus('📚 Course Management: No courses found');
      }
    } catch (error) {
      setUploadStatus('❌ Cannot load course data');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="admin-login-page">
        <div className="login-container">
          <div className="login-header">
            <h2>🔐 Admin Login</h2>
            <p>Access the administration portal</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                placeholder="Enter username"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                placeholder="Enter password"
                required
              />
            </div>

            {error && <div className="error-message">❌ {error}</div>}

            <button type="submit" className="submit-btn">
              Login as Admin
            </button>
          </form>

          <div className="demo-credentials">
            <h4>Demo Credentials</h4>
            <p>Username: <code>admin</code></p>
            <p>Password: <code>admin123</code></p>
          </div>

          <button onClick={onBack} className="back-btn">
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h2>👨‍🏫 Admin Dashboard</h2>
          <p>Connected to SQLite Database</p>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>

        <div className="dashboard-content">
          <div className="upload-section">
            <h3>📤 Bulk Result Upload (CSV)</h3>
            
            <div className="template-section">
              <p>Download CSV template with proper format:</p>
              <button onClick={downloadTemplate} className="template-btn">
                📋 Download Template
              </button>
            </div>

            <div className="upload-area">
              <input
                type="file"
                id="csv-file"
                accept=".csv"
                onChange={handleFileUpload}
                className="file-input"
                disabled={isUploading}
              />
              <label htmlFor="csv-file" className="file-label">
                {isUploading ? '⏳ Processing...' : '📁 Choose CSV File'}
              </label>
            </div>

            {uploadStatus && (
              <div className={`status-message ${uploadStatus.includes('❌') ? 'error' : 'success'}`}>
                {uploadStatus}
              </div>
            )}

            {validationErrors.length > 0 && (
              <div className="errors-panel">
                <h4>❌ Validation Errors:</h4>
                <div className="errors-list">
                  {validationErrors.slice(0, 5).map((error, index) => (
                    <div key={index} className="error-item">• {error}</div>
                  ))}
                  {validationErrors.length > 5 && (
                    <div className="error-item">... and {validationErrors.length - 5} more errors</div>
                  )}
                </div>
              </div>
            )}

            {csvData.length > 0 && (
              <div className="data-preview">
                <h4>📊 Data Preview (First 3 records):</h4>
                <div className="preview-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Roll Number</th>
                        <th>Student Name</th>
                        <th>Course Code</th>
                        <th>Marks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {csvData.slice(0, 3).map((row, index) => (
                        <tr key={index}>
                          <td>{row.rollNumber}</td>
                          <td>{row.studentName}</td>
                          <td>{row.courseCode}</td>
                          <td>{row.marks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {csvData.length > 3 && (
                  <p className="preview-note">... and {csvData.length - 3} more records</p>
                )}

                <button 
                  onClick={handleUploadToServer}
                  disabled={isUploading || validationErrors.length > 0}
                  className="upload-btn"
                >
                  {isUploading ? '⏳ Publishing...' : `📤 Publish ${csvData.length} Results`}
                </button>
              </div>
            )}
          </div>

          <div className="admin-features">
            <div className="feature-card">
              <h3>👥 Student Management</h3>
              <p>Manage student records and data</p>
              <button 
                onClick={handleStudentManagement}
                className="feature-btn"
              >
                Manage Students
              </button>
            </div>

            <div className="feature-card">
              <h3>📊 Analytics</h3>
              <p>View performance analytics and reports</p>
              <button 
                onClick={handleViewAnalytics}
                className="feature-btn"
              >
                View Analytics
              </button>
            </div>

            <div className="feature-card">
              <h3>🎓 Course Management</h3>
              <p>Manage courses and curriculum</p>
              <button 
                onClick={handleCourseManagement}
                className="feature-btn"
              >
                Manage Courses
              </button>
            </div>
          </div>
        </div>

        <button onClick={onBack} className="back-btn">
          ← Back to Home
        </button>
      </div>
    </div>
  );
};

// MAKE SURE THIS EXPORT STATEMENT IS AT THE END
export default AdminLogin;