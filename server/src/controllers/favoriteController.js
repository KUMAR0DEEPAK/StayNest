import prisma from '../config/db.js';

// @desc    Add a property to favorites
// @route   POST /api/favorites
// @access  Protected (Student Only)
export const addToFavorites = async (req, res) => {
  try {
    const { property_id } = req.body;

    if (req.user.role !== 'STUDENT') {
      return res.status(403).json({ error: 'Only students can save favorites.' });
    }

    if (!property_id) {
      return res.status(400).json({ error: 'Please provide a property ID.' });
    }

    // Check if property exists
    const property = await prisma.property.findUnique({ where: { id: property_id } });
    if (!property) {
      return res.status(404).json({ error: 'Property not found.' });
    }

    // Check if already favorited
    const existingFavorite = await prisma.favorite.findFirst({
      where: {
        property_id,
        student_id: req.user.id
      }
    });

    if (existingFavorite) {
      return res.status(400).json({ error: 'Property is already in your favorites.' });
    }

    // Create favorite
    const favorite = await prisma.favorite.create({
      data: {
        property_id,
        student_id: req.user.id
      },
      include: {
        property: true
      }
    });

    res.status(201).json({ status: 'success', data: favorite });
  } catch (error) {
    console.error('Add Favorite Error:', error);
    res.status(500).json({ error: 'Internal server error adding to favorites.' });
  }
};

// @desc    Get student's favorite properties
// @route   GET /api/favorites
// @access  Protected (Student Only)
export const getMyFavorites = async (req, res) => {
  try {
    if (req.user.role !== 'STUDENT') {
      return res.status(403).json({ error: 'Only students have a favorites list.' });
    }

    const favorites = await prisma.favorite.findMany({
      where: { student_id: req.user.id },
      include: {
        property: {
          include: {
            images: true,
            amenities: { include: { amenity: true } }
          }
        }
      },
      orderBy: { id: 'desc' } // Prisma generated uuid is sorted
    });

    res.status(200).json({ status: 'success', results: favorites.length, data: favorites });
  } catch (error) {
    console.error('Get Favorites Error:', error);
    res.status(500).json({ error: 'Internal server error fetching favorites.' });
  }
};

// @desc    Remove a property from favorites
// @route   DELETE /api/favorites/:propertyId
// @access  Protected (Student Only)
export const removeFromFavorites = async (req, res) => {
  try {
    const { propertyId } = req.params;

    if (req.user.role !== 'STUDENT') {
      return res.status(403).json({ error: 'Only students have a favorites list.' });
    }

    // Find the record
    const favorite = await prisma.favorite.findFirst({
      where: {
        property_id: propertyId,
        student_id: req.user.id
      }
    });

    if (!favorite) {
      return res.status(404).json({ error: 'Favorite record not found.' });
    }

    // Delete it
    await prisma.favorite.delete({ where: { id: favorite.id } });

    res.status(200).json({ status: 'success', message: 'Removed from favorites.' });
  } catch (error) {
    console.error('Remove Favorite Error:', error);
    res.status(500).json({ error: 'Internal server error removing favorite.' });
  }
};
