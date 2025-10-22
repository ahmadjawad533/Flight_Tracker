const mongoose = require('mongoose');
const Flight = require('../models/Flight');
const PriceData = require('../models/PriceData');
require('dotenv').config();

// Sample flight data
const sampleFlights = [
  {
    route: { origin: 'LHE', destination: 'BKK', airline: 'PIA' },
    flight_date: new Date('2026-01-15'),
    tracking_start_date: new Date('2025-07-15')
  },
  {
    route: { origin: 'SIN', destination: 'BKK', airline: 'Singapore Airlines' },
    flight_date: new Date('2026-02-20'),
    tracking_start_date: new Date('2025-08-20')
  },
  {
    route: { origin: 'JED', destination: 'LHE', airline: 'Saudia' },
    flight_date: new Date('2026-03-10'),
    tracking_start_date: new Date('2025-09-10')
  }
];

// Generate random price data
const generatePriceData = async (flightId, startDate, endDate) => {
  const prices = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    // Generate random price between $300-$700
    const price = 300 + Math.random() * 400;
    
    prices.push({
      flight_id: flightId,
      timestamp: new Date(currentDate),
      price: Math.round(price),
      currency: 'USD'
    });
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return prices;
};

const seedDatabase = async () => {
  try {
    console.log('🔗 Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('🗑 Clearing old data...');
    await Flight.deleteMany({});
    await PriceData.deleteMany({});
    
    console.log('✈️ Seeding flights...');
    const flights = await Flight.insertMany(sampleFlights);
    
    console.log('💰 Generating price data...');
    for (const flight of flights) {
      const priceData = await generatePriceData(
        flight._id,
        flight.tracking_start_date,
        flight.flight_date
      );
      await PriceData.insertMany(priceData);
    }
    
    console.log('✅ Database seeded successfully!');
    console.log(`📊 Created ${flights.length} flights with price history`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();