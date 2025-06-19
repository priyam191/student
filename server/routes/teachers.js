const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');
const User = require('../models/User');

// @route   GET api/teachers
// @desc    Get all teachers
// @access  Private
router.get('/', async (req, res) => {
  try {
    const teachers = await Teacher.find().populate('user', ['name', 'email']);
    res.json(teachers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/teachers/:id
// @desc    Get teacher by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id)
      .populate('user', ['name', 'email'])
      .populate('teachingCourses');
    
    if (!teacher) {
      return res.status(404).json({ msg: 'Teacher not found' });
    }
    
    res.json(teacher);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Teacher not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;