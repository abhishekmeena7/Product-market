import { useRef, useState } from 'react';
import './Login.css';

const Login = ({ onLogin, onSwitch }) => {
  const [identifier, setIdentifier] = useState('');
  const [step, setStep] = useState('request'); // request | verify | success
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const otpRefs = Array.from({ length: 6 }).map(() => useRef(null));
  const [devOtp, setDevOtp] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Backend base from env; empty string keeps Vite proxy working in dev
  const BACKEND_BASE = import.meta.env?.VITE_BACKEND_URL || '';
  const API_BASE = `${BACKEND_BASE}/api/otp`;

  const onSendOtp = async () => {
    setError('');
    if (!identifier.trim()) {
      setError('Please enter email or phone');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to send OTP');
      setDevOtp(data.otp || '');
      setStep('verify');
      // Show top toast for 5 seconds
      setShowOtpModal(true);
      setTimeout(() => setShowOtpModal(false), 5000);
      // Reset OTP boxes
      setOtpDigits(['', '', '', '', '', '']);
      // Focus first box
      setTimeout(() => otpRefs[0].current && otpRefs[0].current.focus(), 50);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const onVerifyOtp = async () => {
    setError('');
    const otp = otpDigits.join('');
    if (!otp.trim() || otp.length !== 6) {
      setError('Please enter OTP');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, otp }),
      });
      const data = await res.json();
      if (!res.ok || !data.valid) throw new Error(data.error || 'Invalid OTP');
      setStep('success');
      setTimeout(() => onLogin && onLogin(), 300);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const onResendOtp = async () => {
    await onSendOtp();
  };

  const onDigitChange = (index, val) => {
    const c = val.replace(/\D/g, '').slice(0, 1);
    setOtpDigits(prev => {
      const next = [...prev];
      next[index] = c;
      return next;
    });
    if (c && index < 5) {
      // move focus to next
      otpRefs[index + 1].current && otpRefs[index + 1].current.focus();
    }
  };

  const onDigitKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs[index - 1].current && otpRefs[index - 1].current.focus();
    }
  };

  const onPasteOtp = (e) => {
    const text = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6);
    if (!text) return;
    e.preventDefault();
    const arr = text.split('');
    setOtpDigits([arr[0]||'', arr[1]||'', arr[2]||'', arr[3]||'', arr[4]||'', arr[5]||'']);
    // focus last filled
    const last = Math.min(text.length - 1, 5);
    otpRefs[last].current && otpRefs[last].current.focus();
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="brand">
          <img src="/Vector (2).png" alt="Productr logo" className="brand-logo" />
          <span className="brand-name">Productr</span>
        </div>
        <div className="hero-card" aria-hidden>
          <div className="hero-image" />
          <p className="hero-text">Uplist your<br />product to market</p>
        </div>
      </div>
      <div className="login-right">
        <div className="form-box">
          <h2 className="form-title">Login to your Productr Account</h2>

          {step === 'request' && (
            <>
              <label className="form-label" htmlFor="loginId">Email or Phone number</label>
              <input
                id="loginId"
                type="text"
                className="form-input"
                placeholder="Enter email or phone number"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
              <button className="primary-btn" onClick={onSendOtp} disabled={loading}>
                {loading ? 'Sending...' : 'Login'}
              </button>
            </>
          )}

          {step === 'verify' && (
            <div className="otp-box">
              <label className="form-label">Enter 6-digit OTP</label>
              <div className="otp-inputs" onPaste={onPasteOtp}>
                {otpDigits.map((d, i) => (
                  <input
                    key={i}
                    ref={otpRefs[i]}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    className="otp-digit"
                    value={d}
                    onChange={(e) => onDigitChange(i, e.target.value)}
                    onKeyDown={(e) => onDigitKeyDown(i, e)}
                  />
                ))}
              </div>
              <div className="otp-actions">
                <button className="primary-btn" onClick={onVerifyOtp} disabled={loading}>
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
                <button className="link-btn" type="button" onClick={onResendOtp}>Resend OTP</button>
              </div>
              
            </div>
          )}

          {step === 'success' && (
            <div className="otp-success">Logged in successfully.</div>
          )}

          {error && <div className="form-error">{error}</div>}

          <div className="form-footer">
            <span>Don't have a Productr Account</span>
            <button className="link-btn" onClick={() => onSwitch && onSwitch('signup')}>SignUp Here</button>
          </div>
        </div>
      </div>

      {showOtpModal && (
        <div className="otp-top-toast">
          <div className="otp-modal-code">{devOtp}</div>
        </div>
      )}
    </div>
  );
};

export default Login;
