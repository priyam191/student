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

// ...existing code...

// @route   PUT api/attendance/course/:courseId
// @desc    Edit attendance for a course on a specific date
// @access  Private (Teacher only)
router.put('/course/:courseId', async (req, res) => {
  try {
    const { date, students, teacherId } = req.body;
    const { courseId } = req.params;

    // Find the attendance record for the course and date
    const attendance = await Attendance.findOne({
      course: courseId,
      date: new Date(date)
    });

    if (!attendance) {
      return res.status(404).json({ msg: 'Attendance record not found for this date.' });
    }

    // Update students and markedBy fields
    attendance.students = students;
    attendance.markedBy = teacherId || attendance.markedBy;
    await attendance.save();

    // Populate for response
    const updatedAttendance = await Attendance.findById(attendance._id)
      .populate({
        path: 'students.student',
        populate: {
          path: 'user',
          select: 'name'
        }
      });

    res.json(updatedAttendance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ...existing code...

module.exports = router;
