// routes/search.js
const express = require('express');
const router = express.Router();
const Flight = require('../models/Flight');
const PriceData = require('../models/PriceData');

router.get('/', async (req, res) => {
  try {
    const { q, origin, destination, airline } = req.query;
    
    const searchConditions = {};
    
    if (q) {
      searchConditions.$or = [
        { 'route.origin': new RegExp(q, 'i') },
        { 'route.destination': new RegExp(q, 'i') },
        { 'route.airline': new RegExp(q, 'i') }
      ];
    }
    
    if (origin) searchConditions['route.origin'] = new RegExp(origin, 'i');
    if (destination) searchConditions['route.destination'] = new RegExp(destination, 'i');
    if (airline) searchConditions['route.airline'] = new RegExp(airline, 'i');

    const flights = await Flight.find(searchConditions);

    const flightsWithPrices = await Promise.all(
      flights.map(async (flight) => {
        const latestPrice = await PriceData.findOne(
          { flight_id: flight._id },
          {},
          { sort: { timestamp: -1 } }
        );
        
        return {
          ...flight.toObject(),
          latest_price: latestPrice ? {
            price: latestPrice.price,
            currency: latestPrice.currency,
            timestamp: latestPrice.timestamp
          } : null
        };
      })
    );

    res.json({
      success: true,
      count: flightsWithPrices.length,
      data: flightsWithPrices
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

module.exports = router;