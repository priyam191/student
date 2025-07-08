require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Student = require('./models/Student');
const Teacher = require('./models/Teacher');
const Course = require('./models/Course');
const Attendance = require('./models/Attendance');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Seed data
const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Student.deleteMany({});
    await Teacher.deleteMany({});
    await Course.deleteMany({});
    await Attendance.deleteMany({});

    console.log('Database cleared');

    // Create teacher users
    const teacher1Password = await bcrypt.hash('password123', 10);
    const teacher2Password = await bcrypt.hash('password123', 10);

    const teacherUser1 = await User.create({
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@example.com',
      password: teacher1Password,
      role: 'teacher'
    });

    const teacherUser2 = await User.create({
      name: 'Prof. Michael Chen',
      email: 'michael.chen@example.com',
      password: teacher2Password,
      role: 'teacher'
    });

    // Create teachers
    const teacher1 = await Teacher.create({
      user: teacherUser1._id,
      teacherId: 'T10001',
      department: 'Computer Science'
    });

    const teacher2 = await Teacher.create({
      user: teacherUser2._id,
      teacherId: 'T10002',
      department: 'Mathematics'
    });

    // Create courses
    const course1 = await Course.create({
      courseCode: 'CS101',
      courseName: 'Introduction to JAVA Programming',
      teacher: teacher1._id,
      totalClasses: 0
    });

    const course2 = await Course.create({
      courseCode: 'CS202',
      courseName: 'Data Structures',
      teacher: teacher1._id,
      totalClasses: 0
    });

    const course3 = await Course.create({
      courseCode: 'MATH101',
      courseName: 'Calculus I',
      teacher: teacher2._id,
      totalClasses: 0
    });

    const course4 = await Course.create({
      courseCode: 'CS502',
      courseName: 'DATABASE MANAGEMENT SYSTEMS',
      teacher: teacher2._id,
      totalClasses: 0
    });

    const course5 = await Course.create({
      courseCode: 'CS504 B',
      courseName: 'CRYPTOGRAPHY AND NETWORK SECURITY',
      teacher: teacher2._id,
      totalClasses: 0
    });


    // Update teacher courses
    await Teacher.findByIdAndUpdate(teacher1._id, {
      teachingCourses: [course1._id, course2._id]
    });

    await Teacher.findByIdAndUpdate(teacher2._id, {
      teachingCourses: [course3._id , course4._id, course5._id]
    });


    // Create student users (10 students)
    const students = [];
    const studentUsers = [];

    for (let i = 1; i <= 10; i++) {
      const studentPassword = await bcrypt.hash('password123', 10);
      const studentUser = await User.create({
        name: `Student ${i}`,
        email: `student${i}@example.com`,
        password: studentPassword,
        role: 'student'
      });

      studentUsers.push(studentUser);

      const student = await Student.create({
        user: studentUser._id,
        studentId: `S2000${i}`,
        department: i <= 5 ? 'Computer Science' : 'Mathematics',
        year: Math.floor(Math.random() * 4) + 1,
        enrolledCourses: i <= 5 ? [course1._id, course3._id, course4._id] : [course2._id, course3._id, course5._id]
      });

      students.push(student);

      // Add students to courses
      if (i <= 5) {
        await Course.findByIdAndUpdate(course1._id, {
          $push: { students: student._id }
        });
      } else {
        await Course.findByIdAndUpdate(course2._id, {
          $push: { students: student._id }
        });
      }

      await Course.findByIdAndUpdate(course3._id, {
        $push: { students: student._id }
      });

      await Course.findByIdAndUpdate(course4._id, {
        $push: { students: student._id }
      });

      await Course.findByIdAndUpdate(course5._id, {
        $push: { students: student._id }
      });
    }

    // Create some attendance records
    // For CS101
    const courseOneStudents = students.slice(0, 7).map(s => s._id);
    const today = new Date();
    
    // Create attendance for past 5 classes for course1
    for (let i = 1; i <= 5; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i * 2);
      
      const attendanceList = [];
      courseOneStudents.forEach(studentId => {
        // Random attendance (70% chance of being present)
        attendanceList.push({
          student: studentId,
          present: Math.random() < 0.7
        });
      });
      
      await Attendance.create({
        course: course1._id,
        date,
        students: attendanceList,
        markedBy: teacher1._id
      });
      
      // Increment total classes for course1
      await Course.findByIdAndUpdate(course1._id, {
        $inc: { totalClasses: 1 }
      });
    }
    
    // Create attendance for past 4 classes for course3
    const courseThreeStudents = students.map(s => s._id);
    for (let i = 1; i <= 4; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i * 3);
      
      const attendanceList = [];
      courseThreeStudents.forEach(studentId => {
        // Random attendance (80% chance of being present)
        attendanceList.push({
          student: studentId,
          present: Math.random() < 0.8
        });
      });
      
      await Attendance.create({
        course: course3._id,
        date,
        students: attendanceList,
        markedBy: teacher2._id
      });
      
      // Increment total classes for course3
      await Course.findByIdAndUpdate(course3._id, {
        $inc: { totalClasses: 1 }
      });
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();