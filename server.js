const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files (the dashboard)
app.use(express.static(path.join(__dirname, 'public')));

// Store data in memory (and write to file for persistence)
let latestData = [];
const dataFile = path.join(__dirname, 'data.json');

// Load initial data if exists
if (fs.existsSync(dataFile)) {
    try {
        latestData = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    } catch (e) {
        console.error("Error reading data file:", e);
    }
}

// API to receive data from n8n
app.post('/api/update', (req, res) => {
    // n8n will send the data in the body
    const data = req.body;
    
    if (Array.isArray(data)) {
        latestData = data;
    } else if (data && data.data && Array.isArray(data.data)) {
        latestData = data.data;
    } else if (data && typeof data === 'object') {
        latestData = [data]; // fallback for single object
    } else {
        latestData = [];
    }

    // Save to file so it survives restarts
    fs.writeFileSync(dataFile, JSON.stringify(latestData, null, 2));
    
    console.log("Received updated data from n8n with", latestData.length, "items.");
    res.json({ success: true, message: "Data updated successfully", count: latestData.length });
});

// API for dashboard to fetch data
app.get('/api/data', (req, res) => {
    res.json(latestData);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
