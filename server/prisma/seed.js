import prisma from '../src/config/db.js';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🧹 Cleaning up database...');
  await prisma.favorite.deleteMany();
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.image.deleteMany();
  await prisma.propertyAmenity.deleteMany();
  await prisma.property.deleteMany();
  await prisma.amenity.deleteMany();
  await prisma.user.deleteMany();

  console.log('🔑 Creating dummy users...');
  const hashedPassword = await bcrypt.hash('password123', 12);

  const owner = await prisma.user.create({
    data: {
      full_name: 'Rahul Sharma',
      email: 'owner@example.com',
      password: hashedPassword,
      phone: '9876543210',
      role: 'OWNER',
      profile_image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
    }
  });

  const student = await prisma.user.create({
    data: {
      full_name: 'Amit Patel',
      email: 'student@example.com',
      password: hashedPassword,
      phone: '8765432109',
      role: 'STUDENT',
      profile_image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80'
    }
  });

  console.log('✨ Seeding default amenities...');
  const wifi = await prisma.amenity.create({ data: { name: 'WiFi' } });
  const ac = await prisma.amenity.create({ data: { name: 'Air Conditioning' } });
  const laundry = await prisma.amenity.create({ data: { name: 'Laundry' } });
  const parking = await prisma.amenity.create({ data: { name: 'Parking' } });
  const food = await prisma.amenity.create({ data: { name: 'Food Included' } });
  const gym = await prisma.amenity.create({ data: { name: 'Gym' } });
  const furnished = await prisma.amenity.create({ data: { name: 'Furnished' } });
  const security = await prisma.amenity.create({ data: { name: '24/7 Security' } });

  const amenitiesList = [wifi, ac, laundry, parking, food, gym, furnished, security];

  // Curated Unsplash photo packs (each pack contains 4 matching photos: bedroom, desk, kitchen, bathroom)
  const imagePacks = [
    [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'
    ],
    [
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502005229762-fc1b2b812ca5?auto=format&fit=crop&w=800&q=80'
    ],
    [
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80'
    ],
    [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
    ]
  ];

  console.log('🏠 Seeding core accommodations...');

  // Mumbai Studio (4 photos)
  const p1 = await prisma.property.create({
    data: {
      owner_id: owner.id,
      title: 'Premium Studio Suite near IIT Bombay',
      description: 'Fully furnished premium studio apartment designed for students. Quiet, secure, and located within walking distance to IIT campus. Features 24/7 security, high-speed fiber internet, and modular kitchen accessories.',
      rent: 650,
      deposit: 1300,
      address: 'Hiranandani Gardens, Powai',
      city: 'Mumbai',
      room_type: 'Single Room',
      available_rooms: 2,
      images: {
        create: imagePacks[0].map(url => ({ image_url: url }))
      },
      amenities: {
        create: [{ amenity_id: wifi.id }, { amenity_id: ac.id }, { amenity_id: furnished.id }, { amenity_id: security.id }]
      }
    }
  });

  // Delhi Shared PG (4 photos)
  const p2 = await prisma.property.create({
    data: {
      owner_id: owner.id,
      title: 'Cozy Shared Accommodation near North Campus',
      description: 'Spacious double sharing rooms ideal for friends or students looking to share living expenses. Includes home-style meals, housekeeping daily, and laundry facilities on-site. Very vibrant community.',
      rent: 320,
      deposit: 640,
      address: 'Hudson Lane, GTB Nagar',
      city: 'Delhi',
      room_type: 'Double Room',
      available_rooms: 4,
      images: {
        create: imagePacks[1].map(url => ({ image_url: url }))
      },
      amenities: {
        create: [{ amenity_id: wifi.id }, { amenity_id: laundry.id }, { amenity_id: food.id }, { amenity_id: furnished.id }]
      }
    }
  });

  // Bangalore Triple PG (4 photos)
  const p3 = await prisma.property.create({
    data: {
      owner_id: owner.id,
      title: 'Modern Triple Sharing PG near IISc',
      description: 'Affordable triple-sharing pg setup for students. Close to IISc and local bus transits. Rent includes high-speed WiFi, gym access, shared parking, and round-the-clock water and power supply.',
      rent: 220,
      deposit: 440,
      address: 'Mathikere, near IISc Main Gate',
      city: 'Bangalore',
      room_type: 'Triple Sharing',
      available_rooms: 6,
      images: {
        create: imagePacks[2].map(url => ({ image_url: url }))
      },
      amenities: {
        create: [{ amenity_id: wifi.id }, { amenity_id: gym.id }, { amenity_id: parking.id }]
      }
    }
  });

  console.log('🚀 Generating 30 new listings distributed across 6 cities with 4 photos each...');

  const sampleAreas = {
    Mumbai: ['Bandra West', 'Andheri East', 'Powai', 'Vile Parle', 'Kharghar'],
    Delhi: ['Gole Market', 'Hauz Khas', 'Karol Bagh', 'Connaught Place', 'Saket'],
    Bangalore: ['Koramangala', 'Indiranagar', 'HSR Layout', 'Whitefield', 'Jayanagar'],
    Pune: ['Viman Nagar', 'Kothrud', 'Hinjewadi', 'Baner', 'Kalyani Nagar'],
    Hyderabad: ['Gachibowli', 'Madhapur', 'Jubilee Hills', 'Kondapur', 'Banjara Hills'],
    Chennai: ['Adyar', 'Velachery', 'Nungambakkam', 'OMR Road', 'T Nagar']
  };

  const roomTypes = ['Single Room', 'Double Room', 'Triple Sharing'];
  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai'];

  for (let i = 1; i <= 30; i++) {
    const city = cities[i % cities.length];
    const areas = sampleAreas[city];
    const address = `${areas[i % areas.length]}, Sector ${i * 2}`;
    
    const roomType = roomTypes[i % roomTypes.length];
    const rent = 180 + (i * 18) - (i % 3 ? 10 : 0);
    const deposit = rent * 2;
    const available_rooms = 1 + (i % 5);

    const activePack = imagePacks[i % imagePacks.length];
    const selectedAmenities = amenitiesList.slice(0, 3 + (i % 5));

    await prisma.property.create({
      data: {
        owner_id: owner.id,
        title: `${roomType} near Hub ${i} in ${city}`,
        description: `Premium accommodation situated in the student hub of ${city}. Located close to local transit, restaurants, and top universities. Includes study tables, wardrobes, and shared lounge areas. Secure building.`,
        rent,
        deposit,
        address,
        city,
        room_type: roomType,
        available_rooms,
        images: {
          create: activePack.map(url => ({ image_url: url }))
        },
        amenities: {
          create: selectedAmenities.map(amenity => ({ amenity_id: amenity.id }))
        }
      }
    });
  }

  console.log('💬 Seeding review details...');
  await prisma.review.create({
    data: {
      property_id: p1.id,
      student_id: student.id,
      rating: 5,
      review: 'Absolutely amazing place! It is super quiet and perfect for studying. The WiFi speed is incredible.'
    }
  });

  await prisma.review.create({
    data: {
      property_id: p2.id,
      student_id: student.id,
      rating: 4,
      review: 'Great food and clean environment. Highly recommend the double sharing option.'
    }
  });

  console.log('✅ 33 Total accommodations seeded successfully. Every listing has 4 photos, distributed across 6 Indian cities!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
