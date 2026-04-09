// backend/routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// ─────────────────────────────────────────────────────────
//  GET /api/booking?bookingId=BK001&memberId=MEM101
// ─────────────────────────────────────────────────────────
router.get('/booking', async (req, res, next) => {
  try {
    const { bookingId, memberId } = req.query;

    // ── Validation ────────────────────────────────────────
    if (!bookingId || bookingId.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Booking ID is required and cannot be empty.'
      });
    }

    if (!memberId || memberId.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Member ID is required and cannot be empty.'
      });
    }

    // ── DB Query ──────────────────────────────────────────
    const booking = await Booking.findOne({
      booking_id: bookingId.trim().toUpperCase(),
      member_id: memberId.trim().toUpperCase()
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No booking found for Booking ID '${bookingId}' and Member ID '${memberId}'.`
      });
    }

    // ── Store in session ──────────────────────────────────
    req.session.currentBooking = booking;

    res.cookie('lastSearched', bookingId, {
      maxAge: 30 * 60 * 1000,
      httpOnly: true
    });

    return res.status(200).json({
      success: true,
      booking
    });

  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────────────
//  PUT /api/booking/:id
// ─────────────────────────────────────────────────────────
router.put('/booking/:id', async (req, res, next) => {
  try {
    const { seat_preference, booking_duration } = req.body;
    const bookingId = req.params.id.toUpperCase();

    // ── Validation ────────────────────────────────────────
    const allowedSeats = ['Window', 'Corner', 'Center'];

    if (seat_preference && !allowedSeats.includes(seat_preference)) {
      return res.status(400).json({
        success: false,
        message: 'seat_preference must be Window, Corner, or Center.'
      });
    }

    if (booking_duration !== undefined) {
      const dur = Number(booking_duration);

      if (isNaN(dur) || dur < 1 || dur > 8) {
        return res.status(400).json({
          success: false,
          message: 'booking_duration must be a number between 1 and 8.'
        });
      }
    }

    // ── Fetch record ──────────────────────────────────────
    const booking = await Booking.findOne({ booking_id: bookingId });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking record not found.'
      });
    }

    // ── Business Rule ─────────────────────────────────────
    if (booking.status === 'checked_in') {
      return res.status(403).json({
        success: false,
        message: 'Update not allowed: booking is already checked in.'
      });
    }

    // ── Update ────────────────────────────────────────────
    if (seat_preference) {
      booking.seat_preference = seat_preference;
    }

    if (booking_duration) {
      booking.booking_duration = Number(booking_duration);
    }

    await booking.save();

    // ── Clear session ─────────────────────────────────────
    req.session.currentBooking = null;

    return res.status(200).json({
      success: true,
      message: 'Booking updated successfully.',
      booking
    });

  } catch (err) {
    next(err);
  }
});

module.exports = router;