const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Course = require('../models/Course');

// @route   GET api/students
// @desc    Get all students
// @access  Private
router.get('/', async (req, res) => {
  try {
    const students = await Student.find().populate('user', ['name', 'email']);
    res.json(students);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/students/:id
// @desc    Get student by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('user', ['name', 'email'])
      .populate('enrolledCourses');
    
    if (!student) {
      return res.status(404).json({ msg: 'Student not found' });
    }
    
    res.json(student);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Student not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET api/students/:id/attendance/:courseId
// @desc    Get student attendance for a specific course
// @access  Private
router.get('/:id/attendance/:courseId', async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const studentId = req.params.id;
    
    // Get all attendance records for this course
    const attendanceRecords = await Attendance.find({ course: courseId });
    
    let totalClasses = attendanceRecords.length;
    let attendedClasses = 0;
    
    // Count how many classes the student attended
    attendanceRecords.forEach(record => {
      const studentAttendance = record.students.find(
        s => s.student.toString() === studentId
      );
      
      if (studentAttendance && studentAttendance.present) {
        attendedClasses++;
      }
    });
    
    // Calculate attendance percentage
    const attendancePercentage = totalClasses > 0 
      ? (attendedClasses / totalClasses) * 100 
      : 0;
    
    res.json({
      totalClasses,
      attendedClasses,
      attendancePercentage: Math.round(attendancePercentage * 100) / 100
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;