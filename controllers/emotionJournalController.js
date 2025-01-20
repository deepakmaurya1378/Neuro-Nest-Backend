const EmotionJournal = require('../models/EmotionJournal');


const createEmotionEntry = async (req, res) => {
  const { emotion, intensity, notes, triggers } = req.body;
  try {
    const clientId = req.user.id;
    const journal = await EmotionJournal.findOne({ clientId });

    if (!journal) {
      const newJournal = new EmotionJournal({
        clientId,
        entries: [{ emotion, intensity, notes, triggers }],
      });
      await newJournal.save();
      return res.status(201).json(newJournal);
    } else {
      journal.entries.push({ emotion, intensity, notes, triggers });
      await journal.save();
      return res.status(200).json(journal);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error');
  }
};

// Get the emotion journal of a specific client
const getEmotionJournal = async (req, res) => {
  const clientId = req.user.id;
  try {
    const journal = await EmotionJournal.findOne({ clientId });
    if (!journal) {
      return res.status(404).json({ message: 'Emotion journal not found' });
    }
    return res.json(journal);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error');
  }
};


const deleteEmotionEntry = async (req, res) => {
  const { entryId } = req.params; // Extract entryId from URL params
  const clientId = req.user.id;
  try {
  
    const journal = await EmotionJournal.findOne({ clientId });
    if (!journal) {
      return res.status(404).json({ message: 'Emotion journal not found' });
    }

    const entryIndex = journal.entries.findIndex(entry => entry._id.toString() === entryId);
    
    if (entryIndex === -1) {
      return res.status(404).json({ message: 'Emotion entry not found' });
    }

    journal.entries.splice(entryIndex, 1);
    
    await journal.save();
    
    return res.status(200).json({ message: 'Emotion entry deleted successfully', journal });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error');
  }
};

module.exports = { createEmotionEntry, getEmotionJournal, deleteEmotionEntry };
