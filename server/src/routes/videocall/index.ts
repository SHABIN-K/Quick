import express from 'express';
import { pusherServer } from '../../config/pusher';

const router = express.Router();

// Route to initiate a call
router.post('/call', (req, res) => {
  const { from, to } = req.body;

  // Trigger a "call" event to the recipient
  pusherServer.trigger(`video-call-${to}`, 'call', { from });

  res.sendStatus(200);
});

// Route to answer a call
router.post('/answer', (req, res) => {
  const { caller, recipient } = req.body;

  // Trigger an "answer" event to the caller
  pusherServer.trigger(`video-call-${caller}`, 'answer', { recipient });

  res.sendStatus(200);
});

// Route to reject a call
router.post('/reject', (req, res) => {
  const { caller, recipient } = req.body;

  // Trigger a "reject" event to the caller
  pusherServer.trigger(`video-call-${caller}`, 'reject', { recipient });

  res.sendStatus(200);
});

export default router;
