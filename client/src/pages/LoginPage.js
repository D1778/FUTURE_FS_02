import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import './LoginPage.css';

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await API.post('/auth/login', form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      navigate('/');
    } catch (err) {
      if (err.response && [400, 401].includes(err.response.status)) {
        setError('Invalid username or password');
      } else if (err.response) {
        setError(err.response.data?.message || 'Server error. Please try again.');
      } else {
        setError('Cannot reach the server. It may be waking up - please try again in a minute.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box animate-scaleIn">

        {/* Logo */}
        <div className="login-logo">
          <h1>LeadPilot</h1>
          <p>Admin Login</p>
        </div>

        {/* Error Message */}
        {error && <div className="error-msg">{error}</div>}

        {/* Form */}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

      </div>
    </div>
  );
}