import express from 'express';
import fetch from 'node-fetch'; 
import cors from 'cors';

const app = express();
const PORT = 3000;

let isCutOff = false;

// Middleware
app.use(express.json());

app.use(cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST'], // Allow specific HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
}));

// Routes
app.get('/', (req, res) => {
    res.json({ isCutOff: isCutOff });
});

app.get('/setCutOff', (req, res) => {
    isCutOff = true;
    console.log(isCutOff);
    res.json({ success: true, message: 'isCutOff set to true' });
});

app.get('/pauseCutOff', (req, res) => {
    isCutOff = false;
    res.json({ success: true, message: 'isCutOff set to false' });
});

//Reset isCutOff at midnight
function scheduleMidnightReset() {
    const now = new Date();
    const nextMidnight = new Date();
    nextMidnight.setHours(24, 0, 0, 0); // Set to midnight of the next day
    const timeUntilMidnight = nextMidnight - now;

    setTimeout(() => {
        isCutOff = false;
        console.log('isCutOff has been reset to false at midnight');
        scheduleMidnightReset(); // Schedule the next reset
    }, timeUntilMidnight);
}

function startPing() {
    const url = 'https://hrisiscutoff.onrender.com/';

    setInterval(async () => {
        try {
            const res = await fetch(url);
            if (res.ok) {
                console.log('success');
            } else {
                console.error(`Ping failed with status: ${res.status}`);
            }
        } catch (err) {
            console.error('Ping error:', err.message);
        }
    }, 10 * 60 * 1000); 
}

// Start server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    scheduleMidnightReset();
    startPing(); // Start pinging the external server
});
