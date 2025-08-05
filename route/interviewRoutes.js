// routes/interviewRoutes.js

import express from 'express';
import multer from 'multer';

import {
  submitAnswer,
  getInterviewResults,
  proctorImage,
  submitVoiceAnswer,
  getVoiceInterviewResults,
  handleRealTimeVoice
} from '../controllers/interviewController.js';

import {
  generateVoiceInterview,
  processVoiceInput,
  generateVoiceResponse
} from '../controllers/voiceController.js';

import { generateInterview } from '../controllers/geminiController.js';

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

// Voice interview routes
router.post('/voice/start', generateVoiceInterview);
router.post('/voice/input', processVoiceInput);


router.post('/voice/generate-speech', async (req, res) => {
  try {
    const { text, emotion = 'neutral' } = req.body;
    if (!text) return res.status(400).json({ message: 'Text is required' });
    const audioContent = await generateVoiceResponse(text, emotion);
    res.json({ success: true, audioContent: audioContent.toString('base64'), text });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to generate speech', error: error.message });
  }
});

router.post('/voice/:interviewId/answer', submitVoiceAnswer);
router.get('/voice/:interviewId/results', getVoiceInterviewResults);
router.post('/voice/:interviewId/realtime', handleRealTimeVoice);

// Text interview routes
router.post('/start', generateInterview);
router.post('/:interviewId/answer', submitAnswer);
router.get('/:interviewId/results', getInterviewResults);

router.post('/speak', async (req, res) => {
  try {
    const { text, emotion = 'neutral' } = req.body;
    if (!text) return res.status(400).json({ message: 'Text is required' });
    const audioContent = await generateVoiceResponse(text, emotion);
    res.json({ success: true, audioContent: audioContent.toString('base64'), text });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to generate speech', error: error.message });
  }
});

// Proctoring
router.post('/:interviewId/proctor', upload.single('image'), proctorImage);

export default router;
