import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const StudentDashboard = ({ onBack }) => {
  const [rollNumber, setRollNumber] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE_URL = 'http://localhost:5000/api';

  const fetchResults = async () => {
    if (!rollNumber.trim()) {
      setError('Please enter roll number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/results/student/${rollNumber}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'No results found');
      }

      setStudentData(data);
    } catch (error) {
      setError(error.message);
      setStudentData(null);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    if (!studentData) return;

    try {
      const doc = new jsPDF();
      
      // Title
      doc.setFontSize(20);
      doc.setTextColor(40, 40, 40);
      doc.text('UNIVERSITY RESULT PORTAL', 105, 15, { align: 'center' });
      
      // Student Info
      doc.setFontSize(12);
      doc.text(`Student Name: ${studentData.student.studentName}`, 20, 30);
      doc.text(`Roll Number: ${studentData.student.rollNumber}`, 20, 40);
      doc.text(`Department: ${studentData.student.department}`, 20, 50);
      doc.text(`Semester: ${studentData.student.semester}`, 20, 60);
      
      // Results Table
      const tableColumn = ["Course Code", "Course Name", "Marks", "Grade", "Semester"];
      const tableRows = [];
      
      studentData.results.forEach(result => {
        const grade = result.marks >= 90 ? 'A+' :
                     result.marks >= 80 ? 'A' :
                     result.marks >= 70 ? 'B' :
                     result.marks >= 60 ? 'C' :
                     result.marks >= 50 ? 'D' : 'F';
                     
        const resultData = [
          result.courseCode,
          result.courseName,
          result.marks.toString(),
          grade,
          result.semester.toString()
        ];
        tableRows.push(resultData);
      });

      // Add table using autoTable
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 70,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [41, 128, 185] }
      });

      // Footer
      const finalY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('Generated on: ' + new Date().toLocaleDateString(), 20, finalY);
      doc.text('Official Result Document', 105, finalY, { align: 'center' });
      
      // Save PDF
      doc.save(`Result_${studentData.student.rollNumber}.pdf`);
    } catch (pdfError) {
      console.error('PDF generation error:', pdfError);
      alert('PDF generation failed. Please try again.');
    }
  };

  return (
    <div className="student-dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h2>🎓 Student Result Portal</h2>
          <p>Check your results and download marksheet</p>
        </div>

        <div className="search-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Enter Roll Number (e.g., 21CSC201J)"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === 'Enter' && fetchResults()}
            />
            <button onClick={fetchResults} disabled={loading}>
              {loading ? '🔍 Searching...' : '📊 Get Results'}
            </button>
          </div>
          
          {error && <div className="error-message">❌ {error}</div>}
        </div>

        {studentData && (
          <div className="results-section">
            <div className="student-info">
              <h3>Student Information</h3>
              <div className="info-grid">
                <div><strong>Name:</strong> {studentData.student.studentName}</div>
                <div><strong>Roll No:</strong> {studentData.student.rollNumber}</div>
                <div><strong>Department:</strong> {studentData.student.department}</div>
                <div><strong>Semester:</strong> {studentData.student.semester}</div>
              </div>
            </div>

            <div className="results-table">
              <h3>Academic Results</h3>
              <table>
                <thead>
                  <tr>
                    <th>Course Code</th>
                    <th>Course Name</th>
                    <th>Marks</th>
                    <th>Grade</th>
                    <th>Semester</th>
                  </tr>
                </thead>
                <tbody>
                  {studentData.results.map((result, index) => {
                    const grade = result.marks >= 90 ? 'A+' :
                                 result.marks >= 80 ? 'A' :
                                 result.marks >= 70 ? 'B' :
                                 result.marks >= 60 ? 'C' :
                                 result.marks >= 50 ? 'D' : 'F';
                    return (
                      <tr key={index}>
                        <td>{result.courseCode}</td>
                        <td>{result.courseName}</td>
                        <td className={result.marks < 50 ? 'fail' : ''}>{result.marks}</td>
                        <td className={`grade ${grade}`}>{grade}</td>
                        <td>{result.semester}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="pdf-section">
              <button onClick={generatePDF} className="pdf-btn">
                📄 Download PDF Marksheet
              </button>
              <p className="note">Official result document with university seal</p>
            </div>
          </div>
        )}

        <button onClick={onBack} className="back-btn">
          ← Back to Home
        </button>
      </div>
    </div>
  );
};

export default StudentDashboard;