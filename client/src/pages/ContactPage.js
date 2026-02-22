import { useState } from 'react';
import API from '../api';
import './ContactPage.css';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    source: 'Website Form',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await API.post('/leads', form);
      setSubmitted(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Success screen after submission
  if (submitted) {
    return (
      <div className="contact-container">
        <div className="contact-box success-box">
          <div className="success-icon">✅</div>
          <h2>Thank You!</h2>
          <p>We've received your message and will get back to you within 24 hours.</p>
          <button
            className="submit-btn"
            onClick={() => {
              setSubmitted(false);
              setForm({ name: '', email: '', phone: '', source: 'Website Form', message: '' });
            }}
          >
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-container">
      <div className="contact-box">

        {/* Header */}
        <div className="contact-header">
          <h1>LeadPilot</h1>
          <h2>Get In Touch</h2>
          <p>Fill in the form below and we'll get back to you shortly.</p>
        </div>

        {/* Error */}
        {error && <div className="error-msg">{error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>How did you find us?</label>
              <select
                name="source"
                value={form.source}
                onChange={handleChange}
              >
                <option value="Website Form">Website Form</option>
                <option value="Google">Google</option>
                <option value="Facebook">Facebook</option>
                <option value="Instagram">Instagram</option>
                <option value="Referral">Referral</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group full-width">
            <label>Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Sending...' : 'Send Message →'}
          </button>
        </form>

      </div>
    </div>
  );
}