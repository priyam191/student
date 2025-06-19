const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// @route   GET api/courses
// @desc    Get all courses
// @access  Private
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('teacher', 'teacherId')
      .populate({
        path: 'teacher',
        populate: {
          path: 'user',
          select: 'name'
        }
      });
    
    res.json(courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/courses/:id
// @desc    Get course by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate({
        path: 'teacher',
        populate: {
          path: 'user',
          select: 'name'
        }
      })
      .populate({
        path: 'students',
        populate: {
          path: 'user',
          select: 'name'
        }
      });
    
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }
    
    res.json(course);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Course not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
// @route   POST api/courses