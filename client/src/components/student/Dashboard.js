import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [courses, setCourses] = useState([]);
  const [attendanceSummary, setAttendanceSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        // First get the student profile using the user ID
        const resStudent = await axios.get('/api/students');
        const studentData = resStudent.data.find(s => s.user._id === user._id);
        
        if (studentData) {
          setStudent(studentData);
          
          // Fetch the full student details with enrolled courses
          const resFullStudent = await axios.get(`/api/students/${studentData._id}`);
          setStudent(resFullStudent.data);
          
          // Get the attendance summary for each enrolled course
          const attendanceSummaryData = {};
          
          for (const course of resFullStudent.data.enrolledCourses) {
            const resAttendance = await axios.get(
              `/api/students/${studentData._id}/attendance/${course._id}`
            );
            attendanceSummaryData[course._id] = resAttendance.data;
          }
          
          setAttendanceSummary(attendanceSummaryData);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching student data:', err);
        setLoading(false);
      }
    };
    
    if (user) {
      fetchStudentData();
    }
  }, [user]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!student) {
    return <div className="not-found">Student profile not found</div>;
  }

  return (
    <div className="student-dashboard">
      <div className="dashboard-header">
        <h1>Student Dashboard</h1>
        <div className="student-info">
          <h2>{student.user.name}</h2>
          <p><strong>Student ID:</strong> {student.studentId}</p>
          <p><strong>Department:</strong> {student.department}</p>
          <p><strong>Year:</strong> {student.year}</p>
        </div>
      </div>
      
      <div className="enrolled-courses">
        <h2>Enrolled Courses</h2>
        {student.enrolledCourses.length === 0 ? (
          <p>You are not enrolled in any courses.</p>
        ) : (
          <div className="courses-list">
            {student.enrolledCourses.map(course => {
              const attendanceData = attendanceSummary[course._id] || {
                totalClasses: 0,
                attendedClasses: 0,
                attendancePercentage: 0
              };
              
              return (
                <div key={course._id} className="course-card">
                  <h3>{course.courseName}</h3>
                  <p><strong>Course Code:</strong> {course.courseCode}</p>
                  <div className="attendance-summary">
                    <div className="progress-bar">
                      <div 
                        className={`progress ${attendanceData.attendancePercentage < 75 ? 'warning' : ''}`}
                        style={{ width: `${attendanceData.attendancePercentage}%` }}
                      ></div>
                    </div>
                    <p>
                      <strong>Attendance:</strong> {attendanceData.attendancePercentage.toFixed(2)}%
                      ({attendanceData.attendedClasses}/{attendanceData.totalClasses} classes)
                    </p>
                  </div>
                  <div className="course-actions">
                    <Link 
                      to={`/student/attendance/${course._id}`} 
                      className="btn btn-primary"
                    >
                      View Detailed Attendance
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;