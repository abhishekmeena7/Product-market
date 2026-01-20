import { useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import Home from '../src/components/pages/Home/Home';
import Products  from '../src/components/pages/Products/Products';
import Login from '../src/components/pages/Login/Login';
import Signup from '../src/components/pages/Signup/Signup';


function App() {
  // Restore last page if authenticated; else default to login
  const [page, setPageState] = useState(() => {
    const isAuth = localStorage.getItem('auth') === 'true';
    const last = localStorage.getItem('page');
    return isAuth ? (last || 'home') : 'login';
  });

  const setPage = (next) => {
    setPageState(next);
    if (next === 'login') {
      localStorage.removeItem('auth');
      localStorage.removeItem('page');
    } else {
      localStorage.setItem('page', next);
    }
  };

  const handleLogin = () => {
    localStorage.setItem('auth', 'true');
    setPage('home');
  };

  if (page === 'login') {
    return <Login onLogin={handleLogin} onSwitch={setPage} />;
  }
  if (page === 'signup') {
    return <Signup onSwitch={setPage} />;
  }

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar page={page} setPage={setPage} />
      {page === 'home' && <Home setPage={setPage} />}
      {page === 'products' && <Products setPage={setPage} />}
      {/* chat removed */}
    </div>
  );
}

export default App;
