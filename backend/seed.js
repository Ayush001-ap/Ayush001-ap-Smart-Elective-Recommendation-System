require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const Student = require('./models/Student');
const Course = require('./models/Course');

const seedData = async () => {
  try {
    await connectDB();

    await Student.deleteMany({});
    await Course.deleteMany({});

    const adminPassword = await bcrypt.hash('admin123', 10);
    const studentPassword = await bcrypt.hash('student123', 10);

    await Student.create([
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: adminPassword,
        role: 'admin',
        completedCourses: ['Programming Fundamentals', 'Database Basics'],
        interests: ['AI', 'Data Science']
      },
      {
        name: 'Aarav Sharma',
        email: 'aarav@example.com',
        password: studentPassword,
        role: 'student',
        completedCourses: ['Programming Fundamentals', 'Web Basics', 'Statistics'],
        interests: ['AI', 'Web Development']
      },
      {
        name: 'Priya Mehta',
        email: 'priya@example.com',
        password: studentPassword,
        role: 'student',
        completedCourses: ['Programming Fundamentals', 'Database Basics', 'Machine Learning Basics'],
        interests: ['Data Science', 'AI']
      }
    ]);

    await Course.create([
      {
        name: 'Deep Learning',
        description: 'Introduction to neural networks and deep learning architectures.',
        category: 'AI',
        difficultyLevel: 'Advanced',
        prerequisites: ['Machine Learning Basics']
      },
      {
        name: 'Natural Language Processing',
        description: 'Foundations of text analytics and NLP techniques.',
        category: 'AI',
        difficultyLevel: 'Intermediate',
        prerequisites: ['Programming Fundamentals']
      },
      {
        name: 'Advanced Web Development',
        description: 'Build scalable web applications with modern backend patterns.',
        category: 'Web Development',
        difficultyLevel: 'Intermediate',
        prerequisites: ['Web Basics', 'Programming Fundamentals']
      },
      {
        name: 'Big Data Analytics',
        description: 'Analyze large-scale datasets and distributed processing concepts.',
        category: 'Data Science',
        difficultyLevel: 'Advanced',
        prerequisites: ['Statistics', 'Database Basics']
      },
      {
        name: 'Data Visualization',
        description: 'Learn visual communication of data insights.',
        category: 'Data Science',
        difficultyLevel: 'Beginner',
        prerequisites: ['Statistics']
      }
    ]);

    console.log('Seed data inserted successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seedData();
