const Course = require('../models/Course');

const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    return res.status(200).json(courses);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const addCourse = async (req, res) => {
  try {
    const { name, description, category, difficultyLevel, prerequisites } = req.body;

    if (!name || !description || !category || !difficultyLevel) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existing = await Course.findOne({ name });
    if (existing) {
      return res.status(409).json({ message: 'Course already exists' });
    }

    const course = await Course.create({
      name,
      description,
      category,
      difficultyLevel,
      prerequisites: prerequisites || []
    });

    return res.status(201).json({ message: 'Course added', course });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCourse = await Course.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    return res.status(200).json({ message: 'Course updated', course: updatedCourse });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    return res.status(200).json({ message: 'Course deleted' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getCourses,
  addCourse,
  updateCourse,
  deleteCourse
};
