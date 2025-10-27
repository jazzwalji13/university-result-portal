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

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Invalid credentials. Use admin/admin123 for demo.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCredentials({ username: '', password: '' });
    setCsvData([]);
    setUploadStatus('');
    setValidationErrors([]);
  };

  // Handle CSV file selection
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setUploadStatus('❌ Please select a CSV file');
      return;
    }

    setUploadStatus('📁 Processing CSV file...');
    parseCSVFile(file);
  };

  // Parse CSV file
  const parseCSVFile = (file) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const csvText = e.target.result;
        console.log('Raw CSV text:', csvText);
        
        const parsedData = parseCSVText(csvText);
        console.log('Parsed data:', parsedData);
        
        // Validate the parsed data
        const errors = validateCSVData(parsedData);
        
        if (errors.length > 0) {
          setValidationErrors(errors);
          setUploadStatus('❌ Validation errors found');
        } else {
          setCsvData(parsedData);
          setValidationErrors([]);
          setUploadStatus(`✅ Successfully parsed ${parsedData.length} records`);
        }
      } catch (error) {
        setUploadStatus('❌ Error parsing CSV file: ' + error.message);
        console.error('CSV Parse Error:', error);
      }
    };
    
    reader.onerror = () => {
      setUploadStatus('❌ Error reading file');
    };
    
    reader.readAsText(file);
  };

  // CSV Parser
  const parseCSVText = (csvText) => {
    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length < 2) {
      throw new Error('CSV must have header and at least one data row');
    }

    const headers = lines[0].split(',').map(header => header.trim());
    
    const expectedHeaders = ['rollNumber', 'courseCode', 'marks', 'studentName'];
    if (!expectedHeaders.every(header => headers.includes(header))) {
      throw new Error('CSV must contain columns: rollNumber, courseCode, marks, studentName');
    }

    const data = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      console.log(`Processing line ${i}:`, line);
      
      // Use regex to split by commas but ignore commas inside quotes
      const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(value => {
        let cleaned = value.trim();
        // Remove surrounding quotes if they exist
        if ((cleaned.startsWith('"') && cleaned.endsWith('"')) || 
            (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
          cleaned = cleaned.slice(1, -1);
        }
        return cleaned;
      });
      
      console.log(`Line ${i} values:`, values);

      if (values.length === headers.length) {
        const row = {};
        headers.forEach((header, index) => {
          row[header] = values[index];
        });
        data.push(row);
      }
    }

    console.log('Final parsed data:', data);
    return data;
  };

  // FIXED VALIDATION - Correct regex patterns
  const validateCSVData = (data) => {
    const errors = [];

    data.forEach((row, index) => {
      const rowNumber = index + 2;

      // Clean the data before validation
      const cleanRollNumber = String(row.rollNumber || '').trim().toUpperCase();
      const cleanCourseCode = String(row.courseCode || '').trim().toUpperCase();
      const cleanStudentName = String(row.studentName || '').trim();
      
      console.log(`Validating row ${rowNumber}:`, { 
        rawRoll: row.rollNumber, 
        cleanRoll: cleanRollNumber,
        rawCourse: row.courseCode,
        cleanCourse: cleanCourseCode,
        marks: row.marks,
        studentName: row.studentName
      });

      // FIXED: Validate roll number format: 21CSC201J (9 characters with ending letter)
      const rollNumberRegex = /^[0-9]{2}[A-Z]{3}[0-9]{3}[A-Z]$/;
      if (!rollNumberRegex.test(cleanRollNumber)) {
        errors.push(`Row ${rowNumber}: Invalid roll number format "${row.rollNumber}". Expected: 21ABC123J`);
      }

      // FIXED: Validate course code format: 21CSC301T (9 characters with ending letter)
      const courseCodeRegex = /^[0-9]{2}[A-Z]{3}[0-9]{3}[A-Z]$/;
      if (!courseCodeRegex.test(cleanCourseCode)) {
        errors.push(`Row ${rowNumber}: Invalid course code format "${row.courseCode}". Expected: 21ABC123T`);
      }

      // Validate marks (0-100)
      const marks = parseInt(row.marks);
      if (isNaN(marks) || marks < 0 || marks > 100) {
        errors.push(`Row ${rowNumber}: Marks must be between 0-100 - "${row.marks}"`);
      }

      // Validate student name
      if (!cleanStudentName || cleanStudentName.length < 2) {
        errors.push(`Row ${rowNumber}: Student name is required and must be at least 2 characters`);
      }
    });

    return errors;
  };

  // Simulate upload to backend
  const handleUploadToServer = async () => {
    if (csvData.length === 0) {
      setUploadStatus('❌ No data to upload');
      return;
    }

    setIsUploading(true);
    setUploadStatus('⏳ Uploading to server...');

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setUploadStatus(`✅ Successfully uploaded ${csvData.length} records to database!`);
      setCsvData([]);
      setValidationErrors([]);
      
      const fileInput = document.getElementById('csv-file');
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      setUploadStatus('❌ Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Download CSV template
  const downloadTemplate = () => {
    const template = `rollNumber,courseCode,marks,studentName
21CSC201J,21CSC301T,85,John Doe
21CSC202J,21CSC301T,92,Jane Smith
21CSC203J,21CSC301T,78,Mike Johnson
21CSC204J,21CSC302T,88,Sarah Wilson
21CSC205J,21CSE354T,95,David Brown`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'result_upload_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    setUploadStatus('📋 Template downloaded successfully!');
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
              />
              <label htmlFor="csv-file" className="file-label">
                📁 Choose CSV File
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
                  {isUploading ? '⏳ Uploading...' : `📤 Upload ${csvData.length} Records`}
                </button>
              </div>
            )}
          </div>

          <div className="admin-features">
            <div className="feature-card">
              <h3>👥 Student Management</h3>
              <p>Manage student records and data</p>
              <button className="feature-btn">
                Manage Students
              </button>
            </div>

            <div className="feature-card">
              <h3>📊 Analytics</h3>
              <p>View performance analytics and reports</p>
              <button className="feature-btn">
                View Analytics
              </button>
            </div>

            <div className="feature-card">
              <h3>🎓 Course Management</h3>
              <p>Manage courses and curriculum</p>
              <button className="feature-btn">
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

export default AdminLogin;