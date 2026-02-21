const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Lead = sequelize.define('Lead', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  source: {
    type: DataTypes.STRING,
    defaultValue: 'Website Form'
  },
  status: {
    type: DataTypes.ENUM('new', 'contacted', 'converted', 'lost'),
    defaultValue: 'new'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: '[]',  // stored as JSON string
    get() {
      const val = this.getDataValue('notes');
      return val ? JSON.parse(val) : [];
    },
    set(val) {
      this.setDataValue('notes', JSON.stringify(val));
    }
  }
}, {
  timestamps: true  // adds createdAt and updatedAt automatically
});

module.exports = Lead;