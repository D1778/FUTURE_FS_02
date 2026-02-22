const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://leadpilot-frontend-szk8.onrender.com'
  ],
  credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'LeadPilot server is running!' });
});

console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);

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
    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/leads', require('./routes/leads'));
  })
  .catch((err) => {
    console.error('❌ Full error:', err);
    process.exit(1);
  });