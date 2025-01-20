const Session = require('../models/Session');
const User = require('../models/User');
const mongoose = require('mongoose');


const createSession = async (req, res) => {
  const { clientId, therapistId, appointmentDate, privateNotes, sharedNotes } = req.body;
  try {
    const therapist = await User.findById(therapistId);
    if (!therapist) return res.status(404).send('Therapist not found');
    const newSession = new Session({
      clientId,
      therapistId,
      appointmentDate,
      sessionNotes: {
        privateNotes,
        sharedNotes,
      },
    });
    await newSession.save();
    return res.status(201).json(newSession);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error');
  }
};


const getSessionsByClient = async (req, res) => {
  const clientId = req.user.id;
  try {
    const sessions = await Session.find({ clientId }).populate('clientId', 'name email').populate('therapistId', 'name email');
    return res.json(sessions);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error');
  }
};


const getSessionsByTherapist = async (req, res) => {
  const therapistId = req.user.id; 
  try {
    const sessions = await Session.find({ therapistId }).populate('clientId', 'name email ').populate('therapistId', 'name email'); 
    return res.json(sessions);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error');
  }
};



const updateSessionNotes = async (req, res) => {
  const { sessionId, sharedNotes, emotion } = req.body;
  try {
    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    session.sessionNotes.privateNotes = JSON.stringify(emotion); // Serialize the object
    session.sessionNotes.sharedNotes = sharedNotes;
    await session.save();
    return res.status(200).json(session);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error');
  }
};


const deleteSession = async (req, res) => {
  const { sessionId } = req.params;  
  try {
    const result = await Session.deleteOne({ _id: sessionId });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Session not found' });  
    }
    return res.status(200).json({ message: 'Session deleted successfully' }); 
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error');  
  }
};

const updatedAppointment = async (req, res) => {
  const { sessionId } = req.params; 
  const { sessionNotes, appointmentDate } = req.body;  
  try {
    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    session.sessionNotes = {
      sharedNotes: sessionNotes.sharedNotes,
    };
    session.appointmentDate = appointmentDate; 
    await session.save(); 
    return res.status(200).json(session);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error');
  }
};

const chatList = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send('Invalid user ID');
    }
    const user = await User.findById(userId);
    if (!user) return res.status(404).send('User not found');
    let usersList = [];
    if (user.role === 'Client') {
      const sessions = await Session.find({ clientId: userId }).populate('therapistId', 'name email');
      usersList = sessions.map(session => session.therapistId);
    } else if (user.role === 'Therapist') {
      const sessions = await Session.find({ therapistId: userId }).populate('clientId', 'name email');
      usersList = sessions.map(session => session.clientId);
    } else {
      return res.status(400).send('Invalid user role');
    }
    return res.json(usersList);
  } catch (err) {
    console.error("Error in chatList:", err);
    return res.status(500).send('Server error');
  }
};

module.exports = {getSessionsByTherapist , createSession, getSessionsByClient, updateSessionNotes , updatedAppointment, deleteSession, chatList };


