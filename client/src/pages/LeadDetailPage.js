import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import './LeadDetailPage.css';

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);
  return <div className={`toast ${type}`}>{message}</div>;
}

export default function LeadDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const fetchLead = useCallback(async () => {
    try {
      const { data } = await API.get(`/leads/${id}`);
      setLead(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchLead(); }, [fetchLead]);

  const updateStatus = async (status) => {
    try {
      await API.patch(`/leads/${id}/status`, { status });
      showToast(`Status updated to ${status}!`, 'success');
      fetchLead();
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const addNote = async () => {
    if (!note.trim()) return;
    setSaving(true);
    try {
      await API.post(`/leads/${id}/notes`, { text: note });
      setNote('');
      showToast('Note added successfully!', 'success');
      fetchLead();
    } catch (err) {
      showToast('Failed to add note', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="detail-page">
        <div className="navbar">
          <h1>LeadPilot</h1>
        </div>
        <div className="detail-content">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card">
              <div className="skeleton skeleton-card" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!lead) return <div className="loading">Lead not found.</div>;

  return (
    <div className="detail-page page-enter">

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Navbar */}
      <div className="navbar animate-fadeIn">
        <h1>LeadPilot</h1>
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
      </div>

      <div className="detail-content">

        {/* Lead Info */}
        <div className="card card-hover animate-fadeIn delay-1">
          <h2>👤 Lead Information</h2>
          <div className="info-grid">
            {[
              { label: 'Full Name', value: lead.name },
              { label: 'Email', value: lead.email },
              { label: 'Phone', value: lead.phone || '—' },
              { label: 'Source', value: lead.source },
              { label: 'Date Added', value: new Date(lead.createdAt).toLocaleDateString() },
              { label: 'Last Updated', value: new Date(lead.updatedAt).toLocaleDateString() },
            ].map((item) => (
              <div className="info-item" key={item.label}>
                <label>{item.label}</label>
                <p>{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="card card-hover animate-fadeIn delay-2">
          <h2>📊 Update Status</h2>
          <div className="status-buttons">
            {['new', 'contacted', 'converted', 'lost'].map(s => (
              <button
                key={s}
                className={`status-btn ${s} ${lead.status === s ? 'active' : ''}`}
                onClick={() => updateStatus(s)}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="card card-hover animate-fadeIn delay-3">
          <h2>📝 Follow-up Notes</h2>
          <div className="notes-list">
            {!lead.notes || lead.notes.length === 0 ? (
              <p className="no-notes">No notes yet. Add your first follow-up note below.</p>
            ) : (
              lead.notes.map((n, i) => (
                <div
                  className="note-item animate-slideDown"
                  key={i}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <p>{n.text}</p>
                  <small>{new Date(n.createdAt).toLocaleString()}</small>
                </div>
              ))
            )}
          </div>
          <textarea
            className="note-input"
            placeholder="Write your follow-up note here..."
            value={note}
            onChange={e => setNote(e.target.value)}
          />
          <button
            className="add-note-btn"
            onClick={addNote}
            disabled={saving}
          >
            {saving ? '⏳ Saving...' : '+ Add Note'}
          </button>
        </div>

      </div>
    </div>
  );
}