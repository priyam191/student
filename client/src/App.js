import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Home from './components/layout/Home';
import Login from './components/auth/Login';
import StudentDashboard from './components/student/Dashboard';
import TeacherDashboard from './components/teacher/Dashboard';
import CourseDetails from './components/courses/CourseDetails';
import MarkAttendance from './components/teacher/MarkAttendance';
import ViewAttendance from './components/student/ViewAttendance';
import PrivateRoute from './components/routing/PrivateRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <div className="container">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/login" component={Login} />
              <PrivateRoute 
                exact 
                path="/student/dashboard" 
                component={StudentDashboard} 
                role="student" 
              />
              <PrivateRoute 
                exact 
                path="/teacher/dashboard" 
                component={TeacherDashboard} 
                role="teacher" 
              />
              <PrivateRoute 
                exact 
                path="/course/:id" 
                component={CourseDetails} 
              />
              <PrivateRoute 
                exact 
                path="/course/:id/mark-attendance" 
                component={MarkAttendance} 
                role="teacher" 
              />
              <PrivateRoute 
                exact 
                path="/student/attendance/:courseId" 
                component={ViewAttendance} 
                role="student" 
              />
              <Redirect to="/" />
            </Switch>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;