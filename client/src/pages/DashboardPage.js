import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import './DashboardPage.css';

// Toast component
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return <div className={`toast ${type}`}>{message}</div>;
}

// Skeleton row for loading state
function SkeletonRow() {
  return (
    <tr>
      {[...Array(8)].map((_, i) => (
        <td key={i}>
          <div className="skeleton skeleton-text" />
        </td>
      ))}
    </tr>
  );
}

export default function DashboardPage() {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({});
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const fetchData = async () => {
    try {
      const [leadsRes, statsRes] = await Promise.all([
        API.get(`/leads?search=${search}&status=${filter}`),
        API.get('/leads/stats/summary')
      ]);
      setLeads(leadsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [search, filter]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const handleDelete = async (id, name) => {
    const confirm = window.confirm(`Are you sure you want to delete ${name}?`);
    if (!confirm) return;

    try {
      await API.delete(`/leads/${id}`);
      showToast(`${name} deleted successfully`, 'success');
      fetchData();
    } catch (err) {
      showToast('Failed to delete lead', 'error');
    }
  };

  return (
    <div className="dashboard page-enter">

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>Welcome, {username}</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="stats-bar">
        {[
          { label: 'Total Leads', value: stats.total, cls: '' },
          { label: 'New', value: stats.newLeads, cls: 'new' },
          { label: 'Contacted', value: stats.contacted, cls: 'contacted' },
          { label: 'Converted', value: stats.converted, cls: 'converted' },
          { label: 'Lost', value: stats.lost, cls: 'lost' },
        ].map((s, i) => (
          <div
            key={s.label}
            className={`stat-card card-hover animate-fadeIn delay-${i + 1}`}
          >
            <h3 className={s.cls}>{s.value || 0}</h3>
            <p>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="filters animate-fadeIn">
        <input
          placeholder="🔍 Search by name or email..."
          onChange={e => setSearch(e.target.value)}
        />
        <select onChange={e => setFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="converted">Converted</option>
          <option value="lost">Lost</option>
        </select>
      </div>

      {/* Leads Table */}
      <div className="table-container animate-fadeIn">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Source</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-leads">
                  No leads found
                </td>
              </tr>
            ) : (
              leads.map((lead, index) => (
                <tr
                  key={lead.id}
                  className="animate-fadeIn"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <td>{index + 1}</td>
                  <td><strong>{lead.name}</strong></td>
                  <td>{lead.email}</td>
                  <td>{lead.phone || '—'}</td>
                  <td>{lead.source}</td>
                  <td>
                    <span className={`badge ${lead.status}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
                  <td style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      className="view-btn"
                      onClick={() => navigate(`/leads/${lead.id}`)}
                    >
                      View
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(lead.id, lead.name)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}