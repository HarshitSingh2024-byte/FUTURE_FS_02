import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE = 'http://localhost:5000';

function App() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [authToken, setAuthToken] = useState(localStorage.getItem('crmToken') || '');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newLead, setNewLead] = useState({ name: '', email: '', source: '', notes: '' });
  const [editingId, setEditingId] = useState(null);
  const [editFields, setEditFields] = useState({ status: 'new', notes: '' });

  const api = axios.create({
    baseURL: API_BASE,
    headers: authToken ? { 'x-admin-token': authToken } : {},
  });

  useEffect(() => {
    if (authToken) {
      loadLeads();
    }
  }, [authToken]);

  const loadLeads = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/leads');
      setLeads(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to load leads.');
    } finally {
      setLoading(false);
    }
  };


  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const response = await axios.post(`${API_BASE}/auth/login`, {
        username,
        password,
      });
      const token = response.data.token;
      setAuthToken(token);
      localStorage.setItem('crmToken', token);
      setUsername('');
      setPassword('');
    } catch (err) {
      const apiError = err.response?.data?.error;
      setError(apiError || 'Invalid username or password.');
    }
  };

  const handleLogout = () => {
    setAuthToken('');
    setLeads([]);
    localStorage.removeItem('crmToken');
  };

  const handleCreateLead = async (event) => {
    event.preventDefault();
    setError('');

    if (!newLead.name || !newLead.email || !newLead.source) {
      setError('Please enter name, email, and source.');
      return;
    }

    try {
      await api.post('/leads', newLead);
      setNewLead({ name: '', email: '', source: '', notes: '' });
      loadLeads();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create lead.');
    }
  };

  const handleUpdateLead = async (leadId) => {
    setError('');
    try {
      await api.put(`/leads/${leadId}`, {
        status: editFields.status,
        notes: editFields.notes,
      });
      setEditingId(null);
      loadLeads();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update lead.');
    }
  };

  const handleDeleteLead = async (leadId) => {
    if (!window.confirm('Delete this lead permanently?')) return;
    setError('');
    try {
      await api.delete(`/leads/${leadId}`);
      loadLeads();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete lead.');
    }
  };

  const summary = leads.reduce(
    (counts, lead) => {
      counts.total += 1;
      if (lead.status === 'new') counts.new += 1;
      if (lead.status === 'contacted') counts.contacted += 1;
      if (lead.status === 'converted') counts.converted += 1;
      return counts;
    },
    { total: 0, new: 0, contacted: 0, converted: 0 }
  );

  const filteredLeads = statusFilter === 'all' ? leads : leads.filter((lead) => lead.status === statusFilter);

  if (!authToken) {
    return (
      <div className="app login-layout">
        <div className="login-panel">
          <h1>CRM Admin Login</h1>
          <p>Securely manage website leads and track follow-up activity.</p>
          <form className="login-form" onSubmit={handleLogin}>
            <label>
              Username
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="atom"
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="1234"
              />
            </label>
            <button className="btn primary" type="submit">
              Sign In
            </button>
            {error && <div className="error-box">{error}</div>}
          </form>
          <div className="login-note">
            <strong>Demo credentials:</strong> atom / 1234
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>CRM Lead Management</h1>
          <p>Leads collected from the website contact form are stored, tracked, and updated here.</p>
        </div>
        <button className="btn secondary" onClick={handleLogout}>
          Sign Out
        </button>
      </header>

      <div className="container">
        <div className="stats-grid">
          <div className="card">
            <h3>Total Leads</h3>
            <strong>{summary.total}</strong>
          </div>
          <div className="card">
            <h3>New</h3>
            <strong>{summary.new}</strong>
          </div>
          <div className="card">
            <h3>Contacted</h3>
            <strong>{summary.contacted}</strong>
          </div>
          <div className="card">
            <h3>Converted</h3>
            <strong>{summary.converted}</strong>
          </div>
        </div>

        <section className="panel split-panel">
          <div className="panel-content">
            <h2>Add New Lead</h2>
            <form className="form-grid" onSubmit={handleCreateLead}>
              <label>
                Name
                <input
                  value={newLead.name}
                  onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                  placeholder="Full name"
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  value={newLead.email}
                  onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                  placeholder="name@example.com"
                />
              </label>
              <label>
                Source
                <input
                  value={newLead.source}
                  onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
                  placeholder="Website form"
                />
              </label>
              <label className="full-width">
                Notes
                <textarea
                  rows="4"
                  value={newLead.notes}
                  onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
                  placeholder="Follow-up notes or context"
                />
              </label>
              <button className="btn primary" type="submit">
                Add Lead
              </button>
            </form>
          </div>

          <div className="panel-content">
            <h2>View & Filter</h2>
            <div className="filter-buttons">
              {['all', 'new', 'contacted', 'converted'].map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className={`btn filter ${statusFilter === filter ? 'active' : ''}`}
                  onClick={() => setStatusFilter(filter)}
                >
                  {filter === 'all' ? 'All Leads' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
            <div className="quick-actions">
              <button className="btn secondary" type="button" onClick={loadLeads}>
                Refresh Leads
              </button>
              <p className="small-note">Data persists to the database and reloads on every change.</p>
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Lead List</h2>
              <p>{filteredLeads.length} leads displayed</p>
            </div>
            {loading && <span className="loading">Loading…</span>}
          </div>

          {error && <div className="error-box">{error}</div>}

          <div className="tableBox">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Source</th>
                  <th>Status</th>
                  <th>Notes</th>
                  <th className="actions-column">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id}>
                    <td>{lead.name}</td>
                    <td>{lead.email}</td>
                    <td>{lead.source}</td>
                    <td>
                      <span className={`status ${lead.status}`}>{lead.status}</span>
                    </td>
                    <td>
                      {editingId === lead.id ? (
                        <textarea
                          rows="2"
                          value={editFields.notes}
                          onChange={(e) => setEditFields({ ...editFields, notes: e.target.value })}
                        />
                      ) : (
                        <div className="notes-cell">{lead.notes || 'No notes yet'}</div>
                      )}
                    </td>
                    <td className="actions-column">
                      {editingId === lead.id ? (
                        <div className="row-actions">
                          <select
                            value={editFields.status}
                            onChange={(e) => setEditFields({ ...editFields, status: e.target.value })}
                          >
                            <option value="new">new</option>
                            <option value="contacted">contacted</option>
                            <option value="converted">converted</option>
                          </select>
                          <button className="btn small primary" type="button" onClick={() => handleUpdateLead(lead.id)}>
                            Save
                          </button>
                          <button className="btn small secondary" type="button" onClick={() => setEditingId(null)}>
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="row-actions">
                          <button
                            className="btn small"
                            type="button"
                            onClick={() => {
                              setEditingId(lead.id);
                              setEditFields({ status: lead.status, notes: lead.notes || '' });
                            }}
                          >
                            Edit
                          </button>
                          <button className="btn small danger" type="button" onClick={() => handleDeleteLead(lead.id)}>
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
