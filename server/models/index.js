const sequelize = require('../config/database');
const User = require('./User');
const Lead = require('./Lead');

module.exports = { sequelize, User, Lead };