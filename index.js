import express from 'express';
import fetch from 'node-fetch'; 
import cors from 'cors';

const app = express();
const PORT = 3000;

let isCutOff = false;

// Middleware
app.use(express.json());

app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
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
    startPing(); // Start pinging the external server
});
