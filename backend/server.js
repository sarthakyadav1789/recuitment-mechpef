const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');

const app  = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mechapef';

// ── MIDDLEWARE ──
app.use(cors());
app.use(express.json());

// ── MONGODB CONNECTION ──
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✓ MongoDB connected'))
  .catch(err => { console.error('✗ MongoDB error:', err.message); process.exit(1); });

// ── SCHEMA & MODEL ──
const registrationSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, trim: true, lowercase: true },
  eventName: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now }
});

const Registration = mongoose.model('Registration', registrationSchema);

// ── ROUTES ──

// POST /register  — create new registration
app.post('/register', async (req, res) => {
  const { name, email, eventName } = req.body;

  if (!name || !email || !eventName) {
    return res.status(400).json({
      success: false,
      message: 'name, email, and eventName are required.'
    });
  }

  // Basic email format check
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email address.' });
  }

  try {
    const reg = await Registration.create({ name, email, eventName });
    return res.status(201).json({
      success: true,
      message: 'Registration successful.',
      registration: reg
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// GET /registrations  — fetch all registrations
app.get('/registrations', async (req, res) => {
  try {
    const registrations = await Registration.find().sort({ createdAt: -1 });
    return res.json({ success: true, count: registrations.length, registrations });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'MechaPEF API is running ⚙', status: 'ok' });
});

// ── START ──
app.listen(PORT, () => {
  console.log(`⚙  MechaPEF server running at http://localhost:${PORT}`);
});
