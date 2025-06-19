import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const ViewAttendance = () => {
  const [course, setCourse] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [attendanceSummary, setAttendanceSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const { courseId } = useParams();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get course details
        const resCourse = await axios.get(`/api/courses/${courseId}`);
        setCourse(resCourse.data);
        
        // Get attendance records for this course
        const resAttendance = await axios.get(`/api/attendance/course/${courseId}`);
        setAttendance(resAttendance.data);
        
        // Get student profile
        const resStudents = await axios.get('/api/students');
        const studentData = resStudents.data.find(s => s.user._id === user._id);
        
        if (studentData) {
          // Get attendance summary
          const resSummary = await axios.get(
            `/api/students/${studentData._id}/attendance/${courseId}`
          );
          setAttendanceSummary(resSummary.data);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching attendance data:', err);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [courseId, user]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!course) {
    return <div className="not-found">Course not found</div>;
  }

  return (
    <div className="view-attendance">
      <div className="back-link">
        <Link to="/student/dashboard">&larr; Back to Dashboard</Link>
      </div>
      
      <div className="attendance-header">
        <h1>{course.courseName} Attendance</h1>
        <p><strong>Course Code:</strong> {course.courseCode}</p>
        <p>
          <strong>Instructor:</strong> {course.teacher && course.teacher.user 
            ? course.teacher.user.name 
            : 'Not assigned'}
        </p>
      </div>
      
      {attendanceSummary && (
        <div className="attendance-summary">
          <h2>Attendance Summary</h2>
          <div className="summary-details">
            <div className="summary-item">
              <span className="label">Total Classes:</span>
              <span className="value">{attendanceSummary.totalClasses}</span>
            </div>
            <div className="summary-item">
              <span className="label">Classes Attended:</span>
              <span className="value">{attendanceSummary.attendedClasses}</span>
            </div>
            <div className="summary-item">
              <span className="label">Attendance Percentage:</span>
              <span className={`value ${attendanceSummary.attendancePercentage < 75 ? 'warning' : ''}`}>
                {attendanceSummary.attendancePercentage.toFixed(2)}%
              </span>
            </div>
          </div>
          
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className={`progress ${attendanceSummary.attendancePercentage < 75 ? 'warning' : ''}`}
                style={{ width: `${attendanceSummary.attendancePercentage}%` }}
              ></div>
            </div>
          </div>
          
          {attendanceSummary.attendancePercentage < 75 && (
            <div className="attendance-warning">
              Your attendance is below 75%. Please ensure regular attendance to meet course requirements.
            </div>
          )}
        </div>
      )}
      
      <div className="attendance-detail">
        <h2>Attendance Records</h2>
        {attendance.length === 0 ? (
          <p>No attendance records found for this course.</p>
        ) : (
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map(record => {
                // Find this student's attendance status
                const studentRecord = record.students.find(
                  s => s.student && s.student.user && s.student.user._id === user._id
                );
                
                const date = new Date(record.date).toLocaleDateString();
                const status = studentRecord?.present ? 'Present' : 'Absent';
                
                return (
                  <tr key={record._id}>
                    <td>{date}</td>
                    <td className={status === 'Present' ? 'present' : 'absent'}>
                      {status}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ViewAttendance;