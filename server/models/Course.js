const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  courseCode: {
    type: String,
    required: true,
    unique: true
  },
  courseName: {
    type: String,
    required: true
  },
  teacher: {
    type: Schema.Types.ObjectId,
    ref: 'teacher'
  },
  students: [
    {
      type: Schema.Types.ObjectId,
      ref: 'student'
    }
  ],
  totalClasses: {
    type: Number,
    default: 0
  }
});

module.exports = Course = mongoose.model('course', CourseSchema);