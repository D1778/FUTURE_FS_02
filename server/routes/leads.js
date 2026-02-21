const router = require('express').Router();
const { Lead } = require('../models');
const protect = require('../middleware/auth');
const { Op } = require('sequelize');

// ─── PUBLIC: Submit a lead (from contact form) ───
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, source } = req.body;
    const lead = await Lead.create({ name, email, phone, source });
    res.json({ message: 'Lead submitted successfully!', lead });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── PROTECTED: Get all leads (with search + filter) ───
router.get('/', protect, async (req, res) => {
  try {
    const { status, search } = req.query;
    let where = {};

    if (status) where.status = status;

    if (search) {
      where[Op.or] = [
        { name:  { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    const leads = await Lead.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });

    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── PROTECTED: Get single lead ───
router.get('/:id', protect, async (req, res) => {
  try {
    const lead = await Lead.findByPk(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── PROTECTED: Update lead status ───
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const lead = await Lead.findByPk(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    lead.status = req.body.status;
    await lead.save();

    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── PROTECTED: Add a note to a lead ───
router.post('/:id/notes', protect, async (req, res) => {
  try {
    const lead = await Lead.findByPk(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    // Get existing notes and add new one
    const notes = lead.notes || [];
    notes.push({
      text: req.body.text,
      createdAt: new Date().toISOString()
    });

    lead.notes = notes;
    await lead.save();

    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── PROTECTED: Delete a lead ───
router.delete('/:id', protect, async (req, res) => {
  try {
    const lead = await Lead.findByPk(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    await lead.destroy();
    res.json({ message: 'Lead deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── PROTECTED: Analytics summary ───
router.get('/stats/summary', protect, async (req, res) => {
  try {
    const total     = await Lead.count();
    const newLeads  = await Lead.count({ where: { status: 'new' } });
    const contacted = await Lead.count({ where: { status: 'contacted' } });
    const converted = await Lead.count({ where: { status: 'converted' } });
    const lost      = await Lead.count({ where: { status: 'lost' } });

    res.json({ total, newLeads, contacted, converted, lost });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;