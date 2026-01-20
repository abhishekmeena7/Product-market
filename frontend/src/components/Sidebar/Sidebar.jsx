import './Sidebar.css';

const Sidebar = ({ page, setPage }) => (
  <aside className="home-sidebar">
    <div className="brand">
      <span className="brand-name">Productr</span>
      <img src="/Vector (2).png" alt="Productr" className="brand-logo" />
    </div>
    <nav className="home-nav">
      <button
        className={`home-link ${page === 'home' ? 'active' : ''}`}
        onClick={() => setPage('home')}
      >Home</button>
      <button
        className={`home-link ${page === 'products' ? 'active' : ''}`}
        onClick={() => setPage('products')}
      >Products</button>
    </nav>
    <div className="home-actions">
      <button className="logout-btn" onClick={() => setPage('login')}>Logout</button>
    </div>
  </aside>
);

export default Sidebar;
