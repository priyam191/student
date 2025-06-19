const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  studentId: {
    type: String,
    required: true,
    unique: true
  },
  department: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  enrolledCourses: [
    {
      type: Schema.Types.ObjectId,
      ref: 'course'
    }
  ]
});

module.exports = Student = mongoose.model('student', StudentSchema);
