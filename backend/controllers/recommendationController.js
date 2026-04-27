const Course = require('../models/Course');
const Student = require('../models/Student');

const normalize = (value) => value.toLowerCase().trim();

const getRecommendations = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const courses = await Course.find();
    const completed = new Set(student.completedCourses.map(normalize));
    const interests = new Set(student.interests.map(normalize));

    const results = courses.map((course) => {
      const coursePrereqs = course.prerequisites.map(normalize);
      const missingPrereqs = coursePrereqs.filter((pre) => !completed.has(pre));
      const interestMatched = interests.has(normalize(course.category));
      const eligible = interestMatched && missingPrereqs.length === 0;

      let reason = 'Eligible based on interests and prerequisites.';

      if (!interestMatched && missingPrereqs.length > 0) {
        reason = `Not eligible: category does not match interests and missing prerequisites: ${missingPrereqs.join(', ')}`;
      } else if (!interestMatched) {
        reason = 'Not eligible: category does not match student interests.';
      } else if (missingPrereqs.length > 0) {
        reason = `Not eligible: missing prerequisites: ${missingPrereqs.join(', ')}`;
      }

      return {
        courseId: course._id,
        name: course.name,
        category: course.category,
        difficultyLevel: course.difficultyLevel,
        prerequisites: course.prerequisites,
        eligible,
        reason
      };
    });

    const eligibleResults = results.filter((item) => item.eligible);
    if (eligibleResults.length > 0) {
      const eligibleIds = eligibleResults.map((item) => item.courseId);
      await Course.updateMany({ _id: { $in: eligibleIds } }, { $inc: { recommendationCount: 1 } });
    }

    return res.status(200).json({
      student: {
        id: student._id,
        name: student.name,
        interests: student.interests,
        completedCourses: student.completedCourses
      },
      recommendations: results
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const selectCourse = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { courseName } = req.body;

    if (!courseName) {
      return res.status(400).json({ message: 'courseName is required' });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const alreadySelected = student.selectedCourses.some(
      (name) => normalize(name) === normalize(courseName)
    );

    if (alreadySelected) {
      return res.status(200).json({ message: 'Course already selected' });
    }

    student.selectedCourses.push(courseName);
    await student.save();

    return res.status(200).json({ message: 'Course selected successfully', selectedCourses: student.selectedCourses });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getRecommendations,
  selectCourse
};
