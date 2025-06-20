import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const TeacherDashboard = () => {
  const url = process.env.API_URL;
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        // First get the teacher profile using the user ID
        const resTeachers = await axios.get(`${url}/api/teachers`);
        const teacherData = resTeachers.data.find(t => t.user._id === user._id);
        
        if (teacherData) {
          // Get full teacher details with courses
          const resFullTeacher = await axios.get(`${url}/api/teachers/${teacherData._id}`);
          setTeacher(resFullTeacher.data);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching teacher data:', err);
        setLoading(false);
      }
    };
    
    if (user) {
      fetchTeacherData();
    }
  }, [user]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!teacher) {
    return <div className="not-found">Teacher profile not found</div>;
  }

  return (
    <div className="teacher-dashboard">
      <div className="dashboard-header">
        <h1>Teacher Dashboard</h1>
        <div className="teacher-info">
          <h2>{teacher.user.name}</h2>
          <p><strong>Teacher ID:</strong> {teacher.teacherId}</p>
          <p><strong>Department:</strong> {teacher.department}</p>
        </div>
      </div>
      
      <div className="teaching-courses">
        <h2>Teaching Courses</h2>
        {teacher.teachingCourses.length === 0 ? (
          <p>You are not assigned to any courses.</p>
        ) : (
          <div className="courses-list">
            {teacher.teachingCourses.map(course => (
              <div key={course._id} className="course-card">
                <h3>{course.courseName}</h3>
                <p><strong>Course Code:</strong> {course.courseCode}</p>
                <p><strong>Total Classes:</strong> {course.totalClasses}</p>
                <div className="course-actions">
                  <Link 
                    to={`/course/${course._id}`} 
                    className="btn btn-secondary"
                  >
                    View Course Details
                  </Link>
                  <Link 
                    to={`/course/${course._id}/mark-attendance`} 
                    className="btn btn-primary"
                  >
                    Mark Attendance
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;