const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Course = require('../models/Course');

// @route   POST api/attendance
// @desc    Mark attendance for a course
// @access  Private (Teacher only)
router.post('/', async (req, res) => {
  try {
    const { courseId, date, students, teacherId } = req.body;
    
    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }
    
    // Check if attendance for this course on this date already exists
    const existingAttendance = await Attendance.findOne({
      course: courseId,
      date: new Date(date)
    });
    
    if (existingAttendance) {
      // Update existing attendance
      existingAttendance.students = students;
      await existingAttendance.save();
      
      return res.json(existingAttendance);
    }
    
    // Create new attendance record
    const newAttendance = new Attendance({
      course: courseId,
      date: new Date(date),
      students,
      markedBy: teacherId
    });
    
    // Increment total classes for the course
    course.totalClasses += 1;
    await course.save();
    
    const attendance = await newAttendance.save();
    res.json(attendance);
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/attendance/course/:courseId
// @desc    Get all attendance for a course
// @access  Private
router.get('/course/:courseId', async (req, res) => {
  try {
    const attendance = await Attendance.find({ course: req.params.courseId })
      .populate({
        path: 'students.student',
        populate: {
          path: 'user',
          select: 'name'
        }
      })
      .sort({ date: -1 });
    
    res.json(attendance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
