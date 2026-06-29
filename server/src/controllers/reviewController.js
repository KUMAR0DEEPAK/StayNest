import prisma from '../config/db.js';

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Protected (Student Only)
export const createReview = async (req, res) => {
  try {
    const { property_id, rating, review } = req.body;

    if (req.user.role !== 'STUDENT') {
      return res.status(403).json({ error: 'Only students can leave reviews.' });
    }

    if (!property_id || !rating || !review) {
      return res.status(400).json({ error: 'Please provide property ID, rating, and review text.' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be an integer between 1 and 5.' });
    }

    // Check if property exists
    const property = await prisma.property.findUnique({ where: { id: property_id } });
    if (!property) {
      return res.status(404).json({ error: 'Property not found.' });
    }

    // Create the review
    const newReview = await prisma.review.create({
      data: {
        property_id,
        student_id: req.user.id,
        rating: Number(rating),
        review
      },
      include: {
        student: { select: { full_name: true, profile_image: true } }
      }
    });

    res.status(201).json({ status: 'success', data: newReview });
  } catch (error) {
    console.error('Create Review Error:', error);
    res.status(500).json({ error: 'Internal server error during review creation.' });
  }
};

// @desc    Get all reviews for a specific property
// @route   GET /api/reviews/:propertyId
// @access  Public
export const getPropertyReviews = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { property_id: propertyId },
      include: {
        student: { select: { full_name: true, profile_image: true } }
      },
      orderBy: { created_at: 'desc' }
    });

    res.status(200).json({ status: 'success', results: reviews.length, data: reviews });
  } catch (error) {
    console.error('Get Reviews Error:', error);
    res.status(500).json({ error: 'Internal server error fetching reviews.' });
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Protected (Student Who Wrote It Only)
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, review } = req.body;

    const existingReview = await prisma.review.findUnique({ where: { id } });
    if (!existingReview) {
      return res.status(404).json({ error: 'Review not found.' });
    }

    // Check ownership
    if (existingReview.student_id !== req.user.id) {
      return res.status(403).json({ error: 'You do not have permission to edit this review.' });
    }

    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        rating: rating ? Number(rating) : undefined,
        review
      }
    });

    res.status(200).json({ status: 'success', data: updatedReview });
  } catch (error) {
    console.error('Update Review Error:', error);
    res.status(500).json({ error: 'Internal server error during review update.' });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Protected (Student Who Wrote It / Admin Only)
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const existingReview = await prisma.review.findUnique({ where: { id } });
    if (!existingReview) {
      return res.status(404).json({ error: 'Review not found.' });
    }

    // Check ownership or admin role
    if (existingReview.student_id !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'You do not have permission to delete this review.' });
    }

    await prisma.review.delete({ where: { id } });

    res.status(200).json({ status: 'success', message: 'Review deleted successfully.' });
  } catch (error) {
    console.error('Delete Review Error:', error);
    res.status(500).json({ error: 'Internal server error during review deletion.' });
  }
};
