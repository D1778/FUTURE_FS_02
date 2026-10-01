const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./models');

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

let dbReady = false;
app.use('/api', (req, res, next) => {
  if (!dbReady) {
    return res.status(503).json({ message: 'Server is starting, please try again in a moment.' });
  }
  next();
});

// ── Routes ──
app.use('/api/auth', require('./routes/auth'));
app.use('/api/leads', require('./routes/leads'));

app.get('/', (req, res) => {
  res.json({ message: 'LeadPilot server is running!' });
});

const PORT = process.env.PORT || 5000;

// Start listening immediately so requests are answered (instead of hanging or
// being refused) while the database connects; retry the DB connection on failure.
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
    await sequelize.sync({ alter: true });
    dbReady = true;
  } catch (err) {
    console.error('❌ Database connection failed, retrying in 5s:', err.message);
    setTimeout(connectDB, 5000);
  }
};
connectDB();
