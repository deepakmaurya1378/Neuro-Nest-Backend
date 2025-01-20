const User = require('../models/User');

const getTherapists = async (req, res) => {
  try {
    const therapists = await User.find({ role: 'Therapist' }).select('-password'); // Exclude passwords for security
    return res.json(therapists);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server error');
  }
};

module.exports = { getTherapists };
