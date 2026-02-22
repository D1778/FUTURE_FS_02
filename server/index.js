const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://leadpilot-frontend-rg0m.onrender.com',
    'https://leadpilot-frontend-szk8.onrender.com'
  ],
  credentials: true
}));
app.use(express.json());

// ── Routes ── (moved outside sequelize block)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/leads', require('./routes/leads'));

app.get('/', (req, res) => {
  res.json({ message: 'LeadPilot server is running!' });
});

const { sequelize } = require('./models');
const PORT = process.env.PORT || 5000;

sequelize
  .authenticate()
  .then(() => {
    console.log('✅ MySQL connected successfully');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Full error:', err);
    process.exit(1);
  });