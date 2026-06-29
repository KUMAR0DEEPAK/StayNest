import prisma from '../config/db.js';

// @desc    Create a new booking request
// @route   POST /api/bookings
// @access  Protected (Student Only)
export const createBooking = async (req, res) => {
  try {
    const { property_id, move_in_date } = req.body;

    // 1. Ensure the user is a STUDENT
    if (req.user.role !== 'STUDENT') {
      return res.status(403).json({ error: 'Only students can request property bookings.' });
    }

    if (!property_id || !move_in_date) {
      return res.status(400).json({ error: 'Please provide property ID and move-in date.' });
    }

    // 2. Check if property exists and has available rooms
    const property = await prisma.property.findUnique({ where: { id: property_id } });
    if (!property) {
      return res.status(404).json({ error: 'Property not found.' });
    }

    if (property.available_rooms <= 0) {
      return res.status(400).json({ error: 'Sorry, this property has no rooms available.' });
    }

    // 3. Create the booking request with default status 'PENDING'
    const booking = await prisma.booking.create({
      data: {
        property_id,
        student_id: req.user.id,
        move_in_date: new Date(move_in_date),
        booking_status: 'PENDING'
      },
      include: {
        property: true
      }
    });

    res.status(201).json({ status: 'success', data: booking });
  } catch (error) {
    console.error('Create Booking Error:', error);
    res.status(500).json({ error: 'Internal server error during booking creation.' });
  }
};

// @desc    Get bookings (Students get their bookings, Owners get bookings requested for their properties)
// @route   GET /api/bookings
// @access  Protected
export const getMyBookings = async (req, res) => {
  try {
    let bookings;

    if (req.user.role === 'STUDENT') {
      // Students see only their requested bookings
      bookings = await prisma.booking.findMany({
        where: { student_id: req.user.id },
        include: {
          property: {
            include: { owner: { select: { full_name: true, email: true, phone: true } } }
          }
        },
        orderBy: { created_at: 'desc' }
      });
    } else if (req.user.role === 'OWNER') {
      // Owners see bookings requested for properties they own
      bookings = await prisma.booking.findMany({
        where: {
          property: {
            owner_id: req.user.id
          }
        },
        include: {
          property: true,
          student: { select: { full_name: true, email: true, phone: true, profile_image: true } }
        },
        orderBy: { created_at: 'desc' }
      });
    } else {
      // Admins see all bookings
      bookings = await prisma.booking.findMany({
        include: { property: true, student: true },
        orderBy: { created_at: 'desc' }
      });
    }

    res.status(200).json({ status: 'success', results: bookings.length, data: bookings });
  } catch (error) {
    console.error('Get Bookings Error:', error);
    res.status(500).json({ error: 'Internal server error fetching bookings.' });
  }
};

// @desc    Update booking status (Accept/Reject by Owner, Cancel by Student)
// @route   PUT /api/bookings/:id
// @access  Protected
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'ACCEPTED', 'REJECTED', 'CANCELLED'

    if (!['ACCEPTED', 'REJECTED', 'CANCELLED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid booking status.' });
    }

    // 1. Fetch current booking details
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { property: true }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking request not found.' });
    }

    const currentStatus = booking.booking_status;

    // 2. Permission checks & state transitions
    if (status === 'CANCELLED') {
      // Only the student who booked it can cancel it
      if (booking.student_id !== req.user.id) {
        return res.status(403).json({ error: 'You do not have permission to cancel this booking.' });
      }
    } else {
      // Only the owner of the property can ACCEPT or REJECT
      if (booking.property.owner_id !== req.user.id) {
        return res.status(403).json({ error: 'Only the property owner can accept or reject bookings.' });
      }
    }

    // 3. Database transaction to update status & update available room count
    const updatedBooking = await prisma.$transaction(async (tx) => {
      // Update status
      const updated = await tx.booking.update({
        where: { id },
        data: { booking_status: status }
      });

      // Handle room availability count
      if (status === 'ACCEPTED' && currentStatus !== 'ACCEPTED') {
        // If accepting a booking, reduce available rooms by 1
        if (booking.property.available_rooms <= 0) {
          throw new Error('No rooms available left to accept booking.');
        }
        await tx.property.update({
          where: { id: booking.property_id },
          data: { available_rooms: { decrement: 1 } }
        });
      } else if (
        (status === 'CANCELLED' || status === 'REJECTED') &&
        currentStatus === 'ACCEPTED'
      ) {
        // If an already accepted booking is cancelled/rejected, put the room back
        await tx.property.update({
          where: { id: booking.property_id },
          data: { available_rooms: { increment: 1 } }
        });
      }

      return updated;
    });

    res.status(200).json({ status: 'success', data: updatedBooking });
  } catch (error) {
    console.error('Update Booking Error:', error);
    if (error.message === 'No rooms available left to accept booking.') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error during booking update.' });
  }
};
