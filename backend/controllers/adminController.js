const Student = require('../models/Student');
const Course = require('../models/Course');

const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({}, '-password').sort({ createdAt: -1 });
    return res.status(200).json(students);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalAdmins = await Student.countDocuments({ role: 'admin' });

    const mostRecommended = await Course.find()
      .sort({ recommendationCount: -1 })
      .limit(5)
      .select('name category recommendationCount');

    const topSelectedCourses = await Student.aggregate([
      { $unwind: { path: '$selectedCourses', preserveNullAndEmptyArrays: false } },
      {
        $group: {
          _id: '$selectedCourses',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const interestTrends = await Student.aggregate([
      { $unwind: { path: '$interests', preserveNullAndEmptyArrays: false } },
      {
        $group: {
          _id: '$interests',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    return res.status(200).json({
      totalStudents,
      totalCourses,
      totalAdmins,
      mostRecommended,
      topSelectedCourses,
      interestTrends
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllStudents,
  getAnalytics
};
