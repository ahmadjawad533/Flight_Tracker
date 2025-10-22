const express = require('express');
const router = express.Router();
const Flight = require('../models/Flight');
const PriceData = require('../models/PriceData');

router.post('/', async (req, res) => {
  try {
    const { origin, destination, airline, flight_date } = req.body;
    
    const flightDate = new Date(flight_date);
    const trackingStartDate = new Date(flight_date);
    trackingStartDate.setMonth(trackingStartDate.getMonth() - 6);
    
    const flight = new Flight({
      route: { origin, destination, airline },
      flight_date: flightDate,
      tracking_start_date: trackingStartDate,
      tracking_interval_minutes: 10080 
    });
    
    await flight.save();
    
    res.status(201).json({
      success: true,
      message: 'Flight tracking started successfully',
      data: flight
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      error: error.message 
    });
  }
});

router.get('/', async (req, res) => {
  try {
    console.log('📋 Fetching all flights...'); 
    
    const flights = await Flight.find();
    
    console.log(`✅ Found ${flights.length} flights`); 
    
    res.json({
      success: true,
      count: flights.length,
      data: flights
    });
  } catch (error) {
    console.error('❌ Error fetching flights:', error); 
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

router.get('/:id/prices', async (req, res) => {
  try {
    const prices = await PriceData.find({ flight_id: req.params.id })
                                 .sort({ timestamp: 1 }); 
    
    res.json({
      success: true,
      count: prices.length,
      data: prices
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

module.exports = router;