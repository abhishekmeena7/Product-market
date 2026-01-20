const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();
connectDB();
// Configure CORS with env-based frontend origin and dev defaults
const devOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];
const envOrigin = process.env.FRONTEND_ORIGIN;
const allowedOrigins = [envOrigin, ...devOrigins].filter(Boolean);

app.use(cors({
	origin: allowedOrigins.length ? allowedOrigins : true,
}));
// Increase body size limit to allow base64 image payloads
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// REST routes
app.use('/api/otp', require('./routes/otp'));
app.use('/api/products', require('./routes/products'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
