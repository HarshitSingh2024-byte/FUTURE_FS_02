const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

const ADMIN_USER = process.env.ADMIN_USER || 'atom';
const ADMIN_PASS = process.env.ADMIN_PASS || '1234';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'crm-admin-token-2026';

app.use(cors({ origin: /^http:\/\/localhost(:\d+)?$/ }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'crm',
  multipleStatements: false,
});

db.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err.message);
    process.exit(1);
  }
  console.log('MySQL Connected');
});

const requireAuth = (req, res, next) => {
  const token = req.headers['x-admin-token'];
  if (token && token === ADMIN_TOKEN) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized' });
};

app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    return res.json({ token: ADMIN_TOKEN });
  }
  return res.status(401).json({ error: 'Invalid credentials' });
});

app.get('/leads', requireAuth, (req, res) => {
  db.query('SELECT * FROM leads ORDER BY created_at DESC', (error, results) => {
    if (error) return res.status(500).json({ error: error.message });
    return res.json(results);
  });
});

app.post('/leads', requireAuth, (req, res) => {
  const { name, email, source, status = 'new', notes = '' } = req.body;
  if (!name || !email || !source) {
    return res.status(400).json({ error: 'Name, email, and source are required.' });
  }

  db.query(
    'INSERT INTO leads (name, email, source, status, notes) VALUES (?, ?, ?, ?, ?)',
    [name, email, source, status, notes],
    (error, result) => {
      if (error) return res.status(500).json({ error: error.message });
      return res.json({ id: result.insertId, message: 'Lead created' });
    }
  );
});

app.put('/leads/:id', requireAuth, (req, res) => {
  const { name, email, source, status, notes } = req.body;
  const fields = [];
  const values = [];

  if (name !== undefined) {
    fields.push('name = ?');
    values.push(name);
  }
  if (email !== undefined) {
    fields.push('email = ?');
    values.push(email);
  }
  if (source !== undefined) {
    fields.push('source = ?');
    values.push(source);
  }
  if (status !== undefined) {
    fields.push('status = ?');
    values.push(status);
  }
  if (notes !== undefined) {
    fields.push('notes = ?');
    values.push(notes);
  }

  if (!fields.length) {
    return res.status(400).json({ error: 'No fields provided to update.' });
  }

  values.push(req.params.id);
  db.query(
    `UPDATE leads SET ${fields.join(', ')} WHERE id = ?`,
    values,
    (error) => {
      if (error) return res.status(500).json({ error: error.message });
      return res.json({ message: 'Lead updated' });
    }
  );
});

app.delete('/leads/:id', requireAuth, (req, res) => {
  db.query('DELETE FROM leads WHERE id = ?', [req.params.id], (error) => {
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ message: 'Lead deleted' });
  });
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));