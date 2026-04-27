const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_change_me';
const ADMIN_ACCESS_PASSCODE = process.env.ADMIN_ACCESS_PASSCODE || 'admin@123';
const RESERVED_ADMIN_EMAIL = 'admin@example.com';

const createToken = (student) => {
  return jwt.sign(
    {
      id: student._id,
      email: student.email,
      role: student.role
    },
    JWT_SECRET,
    { expiresIn: '1d' }
  );
};

const register = async (req, res) => {
  try {
    const { name, email, password, completedCourses, interests } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    if (email.toLowerCase() === RESERVED_ADMIN_EMAIL) {
      return res.status(403).json({ message: 'This email is reserved for admin login' });
    }

    const existing = await Student.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await Student.create({
      name,
      email,
      password: hashedPassword,
      completedCourses: completedCourses || [],
      interests: interests || []
    });

    const token = createToken(student);

    return res.status(201).json({
      message: 'Registered successfully',
      token,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        completedCourses: student.completedCourses,
        interests: student.interests,
        role: student.role
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, role, adminPasscode } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Email, password and role are required' });
    }

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (student.role !== role) {
      return res.status(403).json({ message: `This account is not registered as ${role}` });
    }

    if (role === 'admin' && adminPasscode !== ADMIN_ACCESS_PASSCODE) {
      return res.status(403).json({ message: 'Invalid admin passcode' });
    }

    const token = createToken(student);

    return res.status(200).json({
      message: 'Login successful',
      token,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        completedCourses: student.completedCourses,
        interests: student.interests,
        role: student.role
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  register,
  login
};
