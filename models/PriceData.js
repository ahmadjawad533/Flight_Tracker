const mongoose = require('mongoose');

// This stores price history for each flight
const priceDataSchema = new mongoose.Schema({
  flight_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flight',
    required: true
  },
  timestamp: { type: Date, required: true }, // When price was recorded
  price: { type: Number, required: true },   // Ticket price
  currency: { type: String, default: 'USD' }, // Currency
  source: { type: String, default: 'scraper' } // How we got the price
}, {
  timestamps: true
});

module.exports = mongoose.model('PriceData', priceDataSchema);