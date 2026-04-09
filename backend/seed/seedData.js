// backend/seed/seedData.js
require('dotenv').config();

const mongoose = require('mongoose');
const Booking = require('../models/Booking');

const sampleData = [
  {
    booking_id: 'BK001',
    member_id: 'MEM101',
    member_name: 'Arjun Sharma',
    space_type: 'Hot Desk',
    seat_preference: 'Window',
    booking_duration: 4,
    booking_date: '2025-07-15',
    status: 'confirmed'
  },
  {
    booking_id: 'BK002',
    member_id: 'MEM102',
    member_name: 'Priya Nair',
    space_type: 'Private Office',
    seat_preference: 'Corner',
    booking_duration: 8,
    booking_date: '2025-07-16',
    status: 'checked_in' // <- UPDATE BLOCKED
  },
  {
    booking_id: 'BK003',
    member_id: 'MEM103',
    member_name: 'Rahul Verma',
    space_type: 'Meeting Room',
    seat_preference: 'Center',
    booking_duration: 2,
    booking_date: '2025-07-17',
    status: 'pending'
  },
  {
    booking_id: 'BK004',
    member_id: 'MEM104',
    member_name: 'Sneha Reddy',
    space_type: 'Hot Desk',
    seat_preference: 'Corner',
    booking_duration: 3,
    booking_date: '2025-07-18',
    status: 'confirmed'
  },
  {
    booking_id: 'BK005',
    member_id: 'MEM105',
    member_name: 'Karthik Menon',
    space_type: 'Hot Desk',
    seat_preference: 'Window',
    booking_duration: 6,
    booking_date: '2025-07-19',
    status: 'cancelled'
  },
  {
    booking_id: 'BK006',
    member_id: 'MEM106',
    member_name: 'Divya Krishnan',
    space_type: 'Private Office',
    seat_preference: 'Center',
    booking_duration: 5,
    booking_date: '2025-07-20',
    status: 'pending'
  }
];

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    await Booking.deleteMany({}); // clear existing data
    await Booking.insertMany(sampleData);

    console.log('Sample data inserted successfully!');
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });