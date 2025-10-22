const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  route: {
    origin: { type: String, required: true },      
    destination: { type: String, required: true }, 
    airline: { type: String, required: true }      
  },
  flight_date: { type: Date, required: true },     
  tracking_start_date: { type: Date, required: true }, 
  tracking_interval_minutes: { type: Number, default: 10080 } 
}, {
  timestamps: true 
});

module.exports = mongoose.model('Flight', flightSchema);