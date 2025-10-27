import React, { useState } from 'react';
import './App.css';

// Import from components folder (where your files actually are)
import HomePage from './components/HomePage';
import StudentLogin from './components/StudentLogin';
import AdminLogin from './components/AdminLogin';
import ResultsPage from './components/ResultsPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [studentData, setStudentData] = useState(null);

  const handleStudentLogin = (rollNumber) => {
    // For demo - create mock student data
    const mockStudentData = {
      rollNumber: rollNumber,
      name: "John Doe", 
      semester: "3rd Year - 1st Semester",
      courses: [
        { code: "21CSC301T", name: "Formal Language Automata", grade: "A", marks: 92 },
        { code: "21CSC302J", name: "Computer Networks", grade: "B+", marks: 85 },
        { code: "21CSE354T", name: "Full Stack Development", grade: "A", marks: 95 }
      ]
    };
    setStudentData(mockStudentData);
    setCurrentPage('results');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setStudentData(null);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'student':
        return <StudentLogin onLogin={handleStudentLogin} onBack={handleBackToHome} />;
      case 'admin':
        return <AdminLogin onBack={handleBackToHome} />;
      case 'results':
        return <ResultsPage studentData={studentData} onBack={handleBackToHome} />;
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

  return (
    <div className="App">
      {renderCurrentPage()}
    </div>
  );
}

export default App;