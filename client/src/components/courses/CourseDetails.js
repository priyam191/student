import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const CourseDetails = () => {
  const url = "https://student-backend-t4wm.onrender.com";
  const [course, setCourse] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [studentAttendance, setStudentAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { role } = useContext(AuthContext);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        // Get course details
        const resCourse = await axios.get(`${url}/api/courses/${id}`);
        setCourse(resCourse.data);
        
        // Get attendance records for this course
        const resAttendance = await axios.get(`${url}/api/attendance/course/${id}`);
        setAttendanceRecords(resAttendance.data);
        
        // Calculate attendance percentage for each student
        const attendanceStats = {};
        
        if (resCourse.data.students && resCourse.data.students.length > 0) {
          resCourse.data.students.forEach(student => {
            let totalPresent = 0;
            
            resAttendance.data.forEach(record => {
              const studentRecord = record.students.find(
                s => s.student?._id === student._id
              );
              
              if (studentRecord && studentRecord.present) {
                totalPresent++;
              }
            });
            
            const totalClasses = resAttendance.data.length;
            const percentage = totalClasses > 0 
              ? (totalPresent / totalClasses) * 100 
              : 0;
            
            attendanceStats[student._id] = {
              totalPresent,
              totalClasses,
              percentage
            };
          });
        }
        
        setStudentAttendance(attendanceStats);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching course data:', err);
        setLoading(false);
      }
    };
    
    fetchCourseData();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!course) {
    return <div className="not-found">Course not found</div>;
  }

  return (
    <div className="course-details">
      <div className="back-link">
        <Link to={role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard'}>
          &larr; Back to Dashboard
        </Link>
      </div>
      
      <div className="course-header">
        <h1>{course.courseName}</h1>
        <p><strong>Course Code:</strong> {course.courseCode}</p>
        <p>
          <strong>Instructor:</strong> {course.teacher && course.teacher.user 
            ? course.teacher.user.name 
            : 'Not assigned'}
        </p>
        <p><strong>Total Classes:</strong> {course.totalClasses}</p>
      </div>
      
      {role === 'teacher' && (
        <div className="teacher-actions">
          <Link 
            to={`/course/${course._id}/mark-attendance`} 
            className="btn btn-primary"
          >
            Mark Attendance
          </Link>
        </div>
      )}
      
      {role === 'teacher' && (
        <div className="students-list">
          <h2>Enrolled Students</h2>
          {course.students.length === 0 ? (
            <p>No students enrolled in this course.</p>
          ) : (
            <table className="students-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Attendance</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {course.students.map(student => {
                  const stats = studentAttendance[student._id] || {
                    totalPresent: 0,
                    totalClasses: 0,
                    percentage: 0
                  };
                  
                  return (
                    <tr key={student._id}>
                      <td>{student.studentId}</td>
                      <td>{student.user.name}</td>
                      <td>{stats.totalPresent}/{stats.totalClasses}</td>
                      <td className={stats.percentage < 75 ? 'warning' : ''}>
                        {stats.percentage.toFixed(2)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
      
      <div className="attendance-history">
        <h2>Attendance History</h2>
        {attendanceRecords.length === 0 ? (
          <p>No attendance records for this course.</p>
        ) : (
          <table className="attendance-history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Present Count</th>
                <th>Absent Count</th>
                {role === 'teacher' && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {attendanceRecords.map(record => {
                const presentCount = record.students.filter(s => s.present).length;
                const absentCount = record.students.length - presentCount;
                const date = new Date(record.date).toLocaleDateString();
                
                return (
                  <tr key={record._id}>
                    <td>{date}</td>
                    <td>{presentCount}</td>
                    <td>{absentCount}</td>
                    {role === 'teacher' && (
                      <td>
                        <button className="btn btn-sm">Edit</button>
                      </td>
                    )}
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

export default CourseDetails;