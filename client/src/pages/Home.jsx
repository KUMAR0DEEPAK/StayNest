import { useEffect, useState, useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import { FaSearch, FaMapMarkerAlt, FaBed, FaDollarSign, FaSlidersH, FaStar } from 'react-icons/fa';
import studentRoomVideo from '../assets/student room video.mp4';

// 1. MINI CAROUSEL COMPONENT FOR PROPERTY CARDS
function CardImageGallery({ images, title, roomType, rent }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Stop routing from opening detail page
    if (images && images.length > 0) {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Stop routing from opening detail page
    if (images && images.length > 0) {
      setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const imageUrl = images?.[activeIndex]?.image_url || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="relative h-48 bg-brand-light/35 overflow-hidden group/img">
      {/* Photo */}
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-full object-cover transition-all duration-300 animate-fade-in"
      />
      
      {/* 3D Arrow Buttons Overlay (Visible on Card Hover) */}
      {images && images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 bg-brand-dark/80 hover:bg-brand-accent hover:text-brand-dark text-white w-7 h-7 rounded-full opacity-0 group-hover/img:opacity-100 transition-all duration-200 cursor-pointer flex items-center justify-center text-xs font-black shadow-md border border-brand-medium/30 z-10"
          >
            &#10094;
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-brand-dark/80 hover:bg-brand-accent hover:text-brand-dark text-white w-7 h-7 rounded-full opacity-0 group-hover/img:opacity-100 transition-all duration-200 cursor-pointer flex items-center justify-center text-xs font-black shadow-md border border-brand-medium/30 z-10"
          >
            &#10095;
          </button>

          {/* Dots Indicator Overlay */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 bg-brand-dark/40 px-2 py-1 rounded-full backdrop-blur-sm">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  index === activeIndex ? 'bg-white scale-125' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}

      {/* Badges */}
      <span className="absolute top-4 left-4 bg-brand-medium text-white text-xs font-black tracking-widest uppercase px-3 py-1 rounded-lg shadow-md border-b-2 border-brand-dark z-10">
        {roomType}
      </span>
      
      <span className="absolute bottom-4 right-4 bg-brand-dark/95 text-white text-sm font-black px-3.5 py-1.5 rounded-lg shadow-md flex items-center border border-brand-medium/20 z-10">
        <span className="text-brand-accent text-xs font-bold mr-0.5">$</span>
        <span>{rent}</span>
        <span className="text-[10px] text-gray-400 font-normal">/mo</span>
      </span>
    </div>
  );
}

export default function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Reference for guest hero video autoplay bypass
  const guestVideoRef = useRef(null);

  // Force mute and play on DOM ref to bypass Chrome autoplay policy in React
  useEffect(() => {
    if (!user && guestVideoRef.current) {
      guestVideoRef.current.muted = true;
      guestVideoRef.current.play().catch((err) => {
        console.log('Autoplay blocked:', err);
      });
    }
  }, [user]);

  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [roomType, setRoomType] = useState('');
  const [minRent, setMinRent] = useState('');
  const [maxRent, setMaxRent] = useState('');
  const [selectedSort, setSelectedSort] = useState('newest');

  // Handle redirect from guest city selection once logged in
  useEffect(() => {
    if (user) {
      const savedCity = localStorage.getItem('redirectCity');
      if (savedCity) {
        setCity(savedCity);
        localStorage.removeItem('redirectCity');
      }
    }
  }, [user]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        search,
        city,
        room_type: roomType,
        minRent,
        maxRent,
        sort: selectedSort,
        limit: 12
      });

      const response = await api.get(`/properties?${queryParams}`);
      if (response.data?.status === 'success') {
        setProperties(response.data.data);
        setTotalCount(response.data.totalCount);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProperties();
    }
  }, [city, roomType, selectedSort, user]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProperties();
  };

  // If visitor is not logged in, show the landing dashboard with app features
  if (!user) {
    const popularCities = [
      {
        name: 'Mumbai',
        iconicPhoto: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=500&q=80',
        description: 'IIT Bombay, Mumbai University'
      },
      {
        name: 'Delhi',
        iconicPhoto: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=500&q=80',
        description: 'Delhi University, JNU, IIT Delhi'
      },
      {
        name: 'Bangalore',
        iconicPhoto: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=500&q=80',
        description: 'IISc, Christ University, RVCE'
      },
      {
        name: 'Pune',
        iconicPhoto: 'https://images.unsplash.com/photo-1601999109332-542b18dbec57?auto=format&fit=crop&w=500&q=80',
        description: 'Pune University, Symbiosis, COEP'
      },
      {
        name: 'Hyderabad',
        iconicPhoto: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=500&q=80',
        description: 'IIT Hyderabad, BITS, HCU'
      },
      {
        name: 'Chennai',
        iconicPhoto: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=500&q=80',
        description: 'IIT Madras, Anna University'
      }
    ];

    const handleCityClick = (cityName) => {
      localStorage.setItem('redirectCity', cityName);
      navigate('/login');
    };

    return (
      <div className="space-y-16 max-w-6xl mx-auto">
        
        {/* Guest Hero Section (Full-Color Cinematic Video Banner - Rounded Corners Fixed) */}
        <section className="relative rounded-3xl p-8 md:p-16 border border-brand-medium/20 border-b-8 border-r-4 border-b-brand-medium/50 border-r-brand-medium/30 shadow-[0_15px_30px_rgba(144,105,86,0.06)] text-center space-y-8 overflow-hidden isolate transform-gpu">
          
          {/* Loop Video Background (Explicitly Rounded to fit frame) */}
          <video
            ref={guestVideoRef}
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0 blur-[3px] rounded-[22px]"
          >
            <source src={studentRoomVideo} type="video/mp4" />
          </video>

          <div className="max-w-3xl mx-auto space-y-6 relative z-10 text-white">
            <span className="bg-white/20 text-white border border-white/30 backdrop-blur-sm px-3.5 py-1 rounded-full text-xs font-black tracking-widest uppercase shadow-sm inline-block">
              🏠 StayNest Student Portal
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none text-white drop-shadow-md">
              Home away from home
            </h1>
            <p className="text-gray-100 text-base md:text-xl font-semibold leading-relaxed max-w-2xl mx-auto drop-shadow-sm">
              Book student accommodations near top universities and cities in India
            </p>

            {/* Feature Badges */}
            <div className="flex flex-wrap justify-center items-center gap-4 text-xs font-bold text-gray-200 pt-2">
              <span className="bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-xl shadow-sm">✓ Verified Properties</span>
              <span className="bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-xl shadow-sm">✓ 24/7 Assistance</span>
              <span className="bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-xl shadow-sm">✓ Lowest Price Guarantee</span>
            </div>
          </div>

          {/* Large Clean Search Bar */}
          <div className="max-w-2xl mx-auto relative z-10 pt-4">
            <form onSubmit={(e) => { e.preventDefault(); navigate('/login'); }} className="flex bg-white border border-brand-medium/25 border-b-4 border-r-2 border-b-brand-medium/40 border-r-brand-medium/20 rounded-2xl overflow-hidden shadow-md focus-within:ring-4 focus-within:ring-brand-accent/20 transition-all">
              <input
                type="text"
                placeholder="Search by City, University or Property..."
                disabled
                className="w-full px-6 py-4 text-sm font-semibold text-brand-dark placeholder-brand-medium/50 bg-white focus:outline-none cursor-pointer"
                onClick={() => navigate('/login')}
              />
              <button
                type="submit"
                className="bg-brand-medium hover:bg-brand-accent text-white px-8 font-black uppercase text-xs tracking-wider transition-all duration-150 cursor-pointer border-l border-brand-medium/10 flex items-center justify-center gap-1.5"
              >
                <FaSearch /> Search
              </button>
            </form>
          </div>
        </section>

        {/* Popular Cities Section */}
        <section className="space-y-6">
          <div className="text-center md:text-left space-y-1">
            <h2 className="text-2xl font-black text-brand-dark">Popular Cities Across India</h2>
            <p className="text-xs font-semibold text-brand-medium">Book student accommodations near top cities and universities around the country.</p>
          </div>

          {/* Grid of City Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {popularCities.map((city) => (
              <div
                key={city.name}
                onClick={() => handleCityClick(city.name)}
                className="group relative h-52 bg-white border border-brand-medium/10 border-b-6 border-r-2 border-b-brand-medium/45 border-r-brand-medium/25 rounded-2xl overflow-hidden shadow-sm hover:shadow-[0_15px_30px_rgba(144,105,86,0.1)] hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
              >
                {/* Image */}
                <img
                  src={city.iconicPhoto}
                  alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                {/* City name text */}
                <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                  <h3 className="text-xl font-black tracking-tight">{city.name}</h3>
                  <p className="text-[10px] text-white/80 font-bold tracking-wider uppercase leading-none">{city.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to action footer banner */}
        <section className="bg-white border border-brand-medium/10 border-b-6 border-r-2 border-b-brand-medium/40 border-r-brand-medium/25 rounded-3xl p-8 text-center space-y-4 shadow-sm max-w-3xl mx-auto">
          <h3 className="text-lg font-black text-brand-dark">Ready to find your StayNest?</h3>
          <p className="text-xs font-semibold text-brand-medium leading-relaxed max-w-md mx-auto">
            Log in to view dynamic price ranges, search local map guides, bookmark property favorites, and send instant booking requests.
          </p>
          <div className="flex gap-4 justify-center pt-2">
            <Link
              to="/login"
              className="bg-brand-medium hover:bg-brand-accent text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider border-b-4 border-r border-brand-dark active:border-b-0 active:border-r-0 active:translate-y-0.5 active:translate-x-0.5 transition-all duration-150 cursor-pointer"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-brand-light/50 hover:bg-brand-light text-brand-dark px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider border border-brand-medium/20 border-b-4 border-r border-b-brand-medium/35 active:border-b-0 active:border-r-0 active:translate-y-0.5 active:translate-x-0.5 transition-all duration-150 cursor-pointer"
            >
              Sign Up
            </Link>
          </div>
        </section>

      </div>
    );
  }

  return (
    <div className="space-y-12">
      
      {/* 3D Hero Banner (Warm sand and coffee tones with Cozy Room Image) */}
      <section className="relative bg-gradient-to-br from-brand-light via-white to-brand-light rounded-3xl p-8 md:p-12 border border-brand-medium/20 border-b-8 border-r-4 border-b-brand-medium/50 border-r-brand-medium/30 shadow-[0_15px_30px_rgba(144,105,86,0.06)] text-brand-dark flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* Left Column: Text Info */}
        <div className="relative z-10 flex-1 space-y-6">
          <span className="bg-brand-accent/20 text-brand-dark border border-brand-accent/30 px-3.5 py-1 rounded-full text-xs font-black tracking-widest uppercase shadow-sm inline-block">
            🏠 Find Your Nest
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight text-brand-dark">
            Premium Student Accommodations Made Simple
          </h1>
          <p className="text-brand-medium text-base md:text-lg font-semibold leading-relaxed">
            Explore verified listings near your college with high-speed WiFi, gym access, and student-focused community living.
          </p>
        </div>

        {/* Right Column: 3D-framed Cozy Room Image */}
        <div className="hidden md:block w-full max-w-sm rounded-2xl overflow-hidden border border-brand-medium/25 border-b-4 border-r border-b-brand-medium/40 border-r-brand-medium/20 shadow-md">
          <img
            src="https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=500&q=80"
            alt="Cozy StayNest Room"
            className="w-full h-56 object-cover"
          />
        </div>

      </section>

      {/* 3D Search Panel */}
      <section className="bg-white border border-brand-medium/20 border-b-6 border-r-4 border-b-brand-medium/40 border-r-brand-medium/20 rounded-2xl p-6 shadow-md">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-brand-medium/60 flex items-center gap-1.5">
              <FaSearch /> Search Keyword
            </label>
            <input
              type="text"
              placeholder="College, area..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-brand-light/20 border border-brand-medium/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-4 focus:ring-brand-accent/20 shadow-inner"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-brand-medium/60 flex items-center gap-1.5">
              <FaMapMarkerAlt /> City
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-brand-light/20 border border-brand-medium/20 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-4 focus:ring-brand-accent/20 shadow-inner cursor-pointer"
            >
              <option value="">All Cities</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Pune">Pune</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Chennai">Chennai</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-brand-medium/60 flex items-center gap-1.5">
              <FaBed /> Room Type
            </label>
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className="w-full bg-brand-light/20 border border-brand-medium/20 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-4 focus:ring-brand-accent/20 shadow-inner cursor-pointer"
            >
              <option value="">All Room Types</option>
              <option value="Single Room">Single Room</option>
              <option value="Double Room">Double Room</option>
              <option value="Triple Sharing">Triple Sharing</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-brand-medium hover:bg-brand-accent text-white font-black uppercase text-xs tracking-wider py-3.5 rounded-xl shadow-md border-b-4 border-r border-brand-dark active:border-b-0 active:border-r-0 active:translate-y-1 active:translate-x-0.5 transition-all duration-150 cursor-pointer flex justify-center items-center gap-2"
          >
            <FaSlidersH /> Apply Filters
          </button>
        </form>
      </section>

      {/* Catalog */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black text-brand-dark">
            {loading ? 'Searching Accommodations...' : `${totalCount} Properties Found`}
          </h2>
          
          <select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
            className="bg-white border border-brand-medium/20 border-b-2 border-r border-b-brand-medium/30 rounded-xl px-3 py-1.5 text-sm font-semibold text-brand-medium focus:outline-none cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 bg-gray-200/50 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-16 bg-white border border-dashed border-brand-medium/20 rounded-2xl">
            <p className="text-brand-medium font-semibold">No accommodations match your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {properties.map((property) => (
              <div
                key={property.id}
                className="group bg-white border border-brand-medium/10 border-b-6 border-r-2 border-b-brand-medium/40 border-r-brand-medium/25 rounded-2xl overflow-hidden shadow-sm hover:shadow-[0_20px_35px_-10px_rgba(144,105,86,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full"
              >
                <CardImageGallery
                  images={property.images}
                  title={property.title}
                  roomType={property.room_type}
                  rent={property.rent}
                />

                <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-brand-medium/60 uppercase tracking-widest">
                      <span>📍 {property.city}</span>
                      <span className="flex items-center gap-0.5 text-amber-500">
                        <FaStar />{' '}
                        {property.reviews && property.reviews.length > 0
                          ? (property.reviews.reduce((sum, r) => sum + r.rating, 0) / property.reviews.length).toFixed(1)
                          : 'New'}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-brand-dark group-hover:text-brand-accent transition-colors line-clamp-1">
                      {property.title}
                    </h3>
                    <p className="text-brand-medium text-xs line-clamp-2 leading-relaxed">
                      {property.description}
                    </p>
                  </div>

                  <Link
                    to={`/properties/${property.id}`}
                    className="w-full text-center bg-brand-light/50 hover:bg-brand-light text-brand-dark border border-brand-medium/20 border-b-4 border-r border-brand-medium/35 hover:border-b-brand-accent active:border-b-0 active:border-r-0 active:translate-y-1 active:translate-x-0.5 py-2.5 rounded-xl font-black uppercase text-xs tracking-wider transition-all duration-150 block cursor-pointer"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
