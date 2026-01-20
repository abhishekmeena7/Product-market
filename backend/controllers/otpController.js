exports.sendOtp = (req, res) => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  res.json({ otp });
};

exports.verifyOtp = (req, res) => {
  const { otp, enteredOtp } = req.body;
  res.json({ success: otp === enteredOtp });
};
