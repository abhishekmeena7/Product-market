const express = require('express');

const router = express.Router();

// In-memory store: { identifier: { code, expiresAt } }
const otpStore = new Map();

const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

// Email delivery handled on frontend via EmailJS; backend only generates/stores.

// Request OTP
router.post('/send', async (req, res) => {
  try {
    const { identifier } = req.body; // email or phone
    if (!identifier) return res.status(400).json({ error: 'identifier is required' });

    const code = generateOtp();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
    otpStore.set(identifier, { code, expiresAt });

    // Return OTP so frontend can send via EmailJS (email) or show for phone in dev.
    return res.json({ success: true, otp: code });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'failed to send otp' });
  }
});

// Verify OTP
router.post('/verify', (req, res) => {
  try {
    const { identifier, otp } = req.body;
    if (!identifier || !otp) return res.status(400).json({ error: 'identifier and otp are required' });

    const entry = otpStore.get(identifier);
    if (!entry) return res.status(400).json({ valid: false, error: 'no otp requested' });

    const now = Date.now();
    if (now > entry.expiresAt) {
      otpStore.delete(identifier);
      return res.status(400).json({ valid: false, error: 'otp expired' });
    }

    const valid = entry.code === otp;
    if (valid) otpStore.delete(identifier);
    return res.json({ valid });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'failed to verify otp' });
  }
});

module.exports = router;
