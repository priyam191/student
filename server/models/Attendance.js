const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AttendanceSchema = new Schema({
  course: {
    type: Schema.Types.ObjectId,
    ref: 'course',
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  students: [
    {
      student: {
        type: Schema.Types.ObjectId,
        ref: 'student'
      },
      present: {
        type: Boolean,
        default: false
      }
    }
  ],
  markedBy: {
    type: Schema.Types.ObjectId,
    ref: 'teacher'
  }
});

module.exports = Attendance = mongoose.model('attendance', AttendanceSchema);