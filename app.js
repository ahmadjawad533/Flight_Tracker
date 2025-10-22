const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`);
  next();
});

// IMPORT ROUTES
try {
  const flightRoutes = require('./routes/flights');
  const searchRoutes = require('./routes/search');
  
  app.use('/api/flights', flightRoutes);
  app.use('/api/search', searchRoutes);
  
  console.log('✅ Routes loaded successfully');
} catch (error) {
  console.error('❌ Route loading error:', error);
}

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Flight Price Tracker API is running!',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Flight Price Tracker API',
    endpoints: {
      health: '/health',
      flights: '/api/flights',
      search: '/api/search'
    }
  });
});

app.use('*', (req, res) => {
  console.log(`❌ Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.use((error, req, res, next) => {
  console.error('Error:', error.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Flight Price Tracker API running on port ${PORT}`);
});