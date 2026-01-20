import './Signup.css';

const Signup = ({ onSwitch }) => {
  return (
    <div className="signup-page">
      <div className="signup-left">
        <div className="brand">
          <img src="/Vector (2).png" alt="Productr logo" className="brand-logo" />
          <span className="brand-name">Productr</span>
        </div>
        <div className="hero-card" aria-hidden>
          <div className="hero-image" />
          <p className="hero-text">Join Productr<br />and start today</p>
        </div>
      </div>
      <div className="signup-right">
        <div className="form-box">
          <h2 className="form-title">Create your Productr Account</h2>
          <label className="form-label" htmlFor="name">Full Name</label>
          <input id="name" type="text" className="form-input" placeholder="Enter your name" />

          <label className="form-label" htmlFor="email">Email or Phone number</label>
          <input id="email" type="text" className="form-input" placeholder="Enter email or phone" />

          <label className="form-label" htmlFor="password">Password</label>
          <input id="password" type="password" className="form-input" placeholder="Enter password" />

          <button className="primary-btn">Sign Up</button>
          <div className="form-footer">
            <span>Already have an account?</span>
            <button className="link-btn" onClick={() => onSwitch && onSwitch('login')}>Login Here</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;