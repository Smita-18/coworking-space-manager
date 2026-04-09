// backend/models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  booking_id: {
    type: String,
    required: true,
    unique: true
  },
  member_id: {
    type: String,
    required: true
  },
  member_name: {
    type: String,
    required: true
  },
  space_type: {
    type: String,
    required: true
  },
  seat_preference: {
    type: String,
    required: true
  },
  booking_duration: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  booking_date: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: [
      'pending',
      'confirmed',
      'checked_in',
      'completed',
      'cancelled'
    ],
    default: 'pending'
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', bookingSchema);