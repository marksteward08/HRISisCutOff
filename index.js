// index.js
import express from 'express';

const app = express();
const PORT = 3000;

let isCutOff = false;

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.json({ isCutOff: isCutOff });
});

app.get('/setCutOff', (req, res) => {
    isCutOff = true;
    console.log(isCutOff)
    res.json({ success: true, message: 'isCutOff set to true' });
})

app.get('/pauseCutOff', (req, res) => {
    isCutOff = false;
    console.log(isCutOff)
    res.json({ success: true ,message: 'isCutOff set to false' });
})

function scheduleMidnightReset() {
    const now = new Date();
    const nextMidnight = new Date();
    nextMidnight.setHours(24, 0, 0, 0); 
    const timeUntilMidnight = nextMidnight - now;

    setTimeout(() => {
        isCutOff = false; // Reset isCutOff
        console.log('isCutOff has been reset to false at midnight');
        scheduleMidnightReset(); // Schedule the next reset
    }, timeUntilMidnight);
}

// Start server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    scheduleMidnightReset(); // Start the midnight reset schedule
});
