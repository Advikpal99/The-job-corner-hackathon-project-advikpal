// Node.js Express backend for The Job Corner with static file serving

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Serve static files (HTML, CSS, JS) from the current directory
app.use(express.static(path.join(__dirname)));

// In-memory job store (replace with DB for production)
let jobs = [];

// Get all jobs
app.get('/api/jobs', (req, res) => {
    res.json(jobs);
});

// Post a new job
app.post('/api/jobs', (req, res) => {
    const { jobType, businessName, city, jobProfile, estimatedPay, contactInfo } = req.body;
    if (!jobType || !businessName || !city || !jobProfile || !estimatedPay || !contactInfo) {
        return res.status(400).json({ error: 'All fields required' });
    }
    const job = { id: Date.now(), jobType, businessName, city, jobProfile, estimatedPay, contactInfo };
    jobs.unshift(job);
    res.json({ success: true, job });
});

// Multer for file uploads (resume)
const upload = multer({ dest: 'uploads/' });

// Apply for a job
app.post('/api/apply', upload.single('resume'), (req, res) => {
    const { jobId, applicantContact } = req.body;
    if (!jobId || !applicantContact || !req.file) {
        return res.status(400).json({ error: 'All fields required' });
    }
    // In production, save application to DB and handle file securely
    res.json({ success: true, message: 'Application received!' });
});

// Health check
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`TJC backend running at http://localhost:${PORT}`);
});
