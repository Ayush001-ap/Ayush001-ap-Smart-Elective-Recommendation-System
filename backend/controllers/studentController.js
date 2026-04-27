const Student = require('../models/Student');

const updateInterests = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { interests } = req.body;

    if (!Array.isArray(interests)) {
      return res.status(400).json({ message: 'Interests must be an array of strings' });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    student.interests = interests.map(i => i.trim()).filter(i => i !== '');
    await student.save();

    return res.status(200).json({ 
      message: 'Interests updated successfully', 
      interests: student.interests 
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  updateInterests
};
