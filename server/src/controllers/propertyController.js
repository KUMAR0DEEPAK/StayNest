import prisma from '../config/db.js';

// @desc    Create a new property listing
// @route   POST /api/properties
// @access  Protected (Owner Only)
export const createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      rent,
      deposit,
      address,
      city,
      room_type,
      available_rooms,
      latitude,
      longitude,
      amenityIds, // Array of amenity IDs, e.g., [1, 3, 5]
      imageUrls // Array of image URLs, e.g., ["url1", "url2"]
    } = req.body;

    // Fetch all current database amenities to resolve actual autoincrement IDs dynamically
    const dbAmenities = await prisma.amenity.findMany({
      orderBy: { id: 'asc' }
    });

    const actualAmenityIds = amenityIds
      ? amenityIds.map((frontendId) => {
          const match = dbAmenities[Number(frontendId) - 1];
          return match ? match.id : null;
        }).filter(id => id !== null)
      : [];

    // 2. Create the property, connect amenities and create images
    const property = await prisma.property.create({
      data: {
        title,
        description,
        rent: Number(rent),
        deposit: Number(deposit),
        address,
        city,
        room_type,
        available_rooms: Number(available_rooms),
        latitude: latitude ? Number(latitude) : null,
        longitude: longitude ? Number(longitude) : null,
        owner_id: req.user.id, // Set by the protect middleware
        // Link multiple amenities via join table using mapped database IDs
        amenities: {
          create: actualAmenityIds.map((id) => ({
            amenity: { connect: { id: Number(id) } }
          }))
        },
        // Link multiple images
        images: {
          create: imageUrls
            ? imageUrls.map((url) => ({ image_url: url }))
            : []
        }
      },
      include: {
        amenities: {
          include: {
            amenity: true
          }
        },
        images: true
      }
    });

    res.status(201).json({ status: 'success', data: property });
  } catch (error) {
    console.error('Create Property Error:', error);
    res.status(500).json({ error: 'Internal server error during property creation.' });
  }
};

// @desc    Get all properties (with advanced filters, sorting, and pagination)
// @route   GET /api/properties
// @access  Public
export const getAllProperties = async (req, res) => {
  try {
    const {
      city,
      room_type,
      minRent,
      maxRent,
      amenities, // Comma-separated names, e.g., "WiFi,Gym"
      search,    // Keyword search in title/description
      sort,      // "price_asc", "price_desc", "newest"
      page = 1,
      limit = 10
    } = req.query;

    // 1. Build dynamic filters
    const where = {};

    if (city) {
      where.city = { equals: city, mode: 'insensitive' };
    }

    if (room_type) {
      where.room_type = { equals: room_type, mode: 'insensitive' };
    }

    if (minRent || maxRent) {
      where.rent = {};
      if (minRent) where.rent.gte = Number(minRent);
      if (maxRent) where.rent.lte = Number(maxRent);
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (amenities) {
      const amenityList = amenities.split(',');
      where.amenities = {
        some: {
          amenity: {
            name: { in: amenityList }
          }
        }
      };
    }

    // 2. Build sorting options
    let orderBy = { created_at: 'desc' }; // Default: Newest first
    if (sort === 'price_asc') orderBy = { rent: 'asc' };
    if (sort === 'price_desc') orderBy = { rent: 'desc' };

    // 3. Pagination calculation
    const parsedPage = Number(page);
    const parsedLimit = Number(limit);
    const skip = (parsedPage - 1) * parsedLimit;

    // 4. Fetch properties & total count in parallel
    const [properties, totalCount] = await Promise.all([
      prisma.property.findMany({
        where,
        orderBy,
        skip,
        take: parsedLimit,
        include: {
          images: true,
          amenities: {
            include: {
              amenity: true
            }
          },
          reviews: true
        }
      }),
      prisma.property.count({ where })
    ]);

    res.status(200).json({
      status: 'success',
      results: properties.length,
      totalCount,
      totalPages: Math.ceil(totalCount / parsedLimit),
      currentPage: parsedPage,
      data: properties
    });
  } catch (error) {
    console.error('Get All Properties Error:', error);
    res.status(500).json({ error: 'Internal server error fetching listings.' });
  }
};

// @desc    Get detailed property by ID
// @route   GET /api/properties/:id
// @access  Public
export const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            full_name: true,
            email: true,
            phone: true,
            profile_image: true
          }
        },
        images: true,
        amenities: {
          include: {
            amenity: true
          }
        },
        reviews: {
          include: {
            student: {
              select: { id: true, full_name: true, profile_image: true }
            }
          },
          orderBy: { created_at: 'desc' }
        }
      }
    });

    if (!property) {
      return res.status(404).json({ error: 'Property not found.' });
    }

    res.status(200).json({ status: 'success', data: property });
  } catch (error) {
    console.error('Get Property By ID Error:', error);
    res.status(500).json({ error: 'Internal server error fetching property details.' });
  }
};

// @desc    Update property details
// @route   PUT /api/properties/:id
// @access  Protected (Owner Only)
export const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      rent,
      deposit,
      address,
      city,
      room_type,
      available_rooms,
      latitude,
      longitude,
      amenityIds
    } = req.body;

    // 1. Fetch property to check ownership
    const property = await prisma.property.findUnique({ where: { id } });

    if (!property) {
      return res.status(404).json({ error: 'Property not found.' });
    }

    // 2. Ensure only the owner can edit
    if (property.owner_id !== req.user.id) {
      return res.status(403).json({ error: 'You do not have permission to update this property.' });
    }

    // Fetch all current database amenities to resolve actual autoincrement IDs dynamically
    const dbAmenities = await prisma.amenity.findMany({
      orderBy: { id: 'asc' }
    });

    const actualAmenityIds = amenityIds
      ? amenityIds.map((frontendId) => {
          const match = dbAmenities[Number(frontendId) - 1];
          return match ? match.id : null;
        }).filter(id => id !== null)
      : [];

    // 3. Clear old amenities if new ones are passed
    if (amenityIds) {
      await prisma.propertyAmenity.deleteMany({
        where: { property_id: id }
      });
    }

    // 4. Update fields
    const updatedProperty = await prisma.property.update({
      where: { id },
      data: {
        title,
        description,
        rent: rent ? Number(rent) : undefined,
        deposit: deposit ? Number(deposit) : undefined,
        address,
        city,
        room_type,
        available_rooms: available_rooms !== undefined ? Number(available_rooms) : undefined,
        latitude: latitude ? Number(latitude) : undefined,
        longitude: longitude ? Number(longitude) : undefined,
        // Re-create many-to-many relationship using resolved database IDs
        amenities: amenityIds
          ? {
              create: actualAmenityIds.map((id) => ({
                amenity: { connect: { id: Number(id) } }
              }))
            }
          : undefined
      },
      include: {
        amenities: {
          include: {
            amenity: true
          }
        }
      }
    });

    res.status(200).json({ status: 'success', data: updatedProperty });
  } catch (error) {
    console.error('Update Property Error:', error);
    res.status(500).json({ error: 'Internal server error during update.' });
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Protected (Owner/Admin Only)
export const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await prisma.property.findUnique({ where: { id } });

    if (!property) {
      return res.status(404).json({ error: 'Property not found.' });
    }

    // Ensure user is the Owner of the property or an Admin
    if (property.owner_id !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'You do not have permission to delete this listing.' });
    }

    // Delete property (onDelete: Cascade in Prisma handles child rows automatically)
    await prisma.property.delete({ where: { id } });

    res.status(200).json({ status: 'success', message: 'Property deleted successfully.' });
  } catch (error) {
    console.error('Delete Property Error:', error);
    res.status(500).json({ error: 'Internal server error during deletion.' });
  }
};
