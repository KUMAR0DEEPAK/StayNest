import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import { FaMapMarkerAlt, FaBed, FaDollarSign, FaUser, FaPhone, FaEnvelope, FaCalendarAlt, FaStar, FaHeart } from 'react-icons/fa';

export default function PropertyDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Booking Form States
  const [moveInDate, setMoveInDate] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  // Favorites States
  const [isFavorite, setIsFavorite] = useState(false);

  // Review States
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewError, setReviewError] = useState('');

  const fetchProperty = async () => {
    try {
      const response = await api.get(`/properties/${id}`);
      if (response.data?.status === 'success') {
        setProperty(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching property:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkFavoriteStatus = async () => {
    if (!user || user.role !== 'STUDENT') return;
    try {
      const response = await api.get('/favorites');
      if (response.data?.status === 'success') {
        const found = response.data.data.some(fav => fav.property_id === id);
        setIsFavorite(found);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProperty();
    checkFavoriteStatus();
  }, [id, user]);

  // Toggle Favorite Handler
  const toggleFavorite = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      if (isFavorite) {
        await api.delete(`/favorites/${id}`);
        setIsFavorite(false);
      } else {
        await api.post('/favorites', { property_id: id });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Favorite error:', error);
    }
  };

  // Submit Booking Request Handler
  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!moveInDate) {
      setBookingError('Please select a move-in date.');
      return;
    }

    setBookingLoading(true);
    setBookingError('');
    setBookingSuccess('');

    try {
      const response = await api.post('/bookings', {
        property_id: id,
        move_in_date: moveInDate
      });
      if (response.data?.status === 'success') {
        setBookingSuccess('Booking request sent successfully to the owner!');
        // Update room count dynamically on the UI
        setProperty(prev => ({
          ...prev,
          available_rooms: prev.available_rooms
        }));
      }
    } catch (error) {
      setBookingError(error.response?.data?.error || 'Booking failed.');
    } finally {
      setBookingLoading(false);
    }
  };

  // Submit Review Handler
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewText) return;
    setReviewError('');

    try {
      const response = await api.post('/reviews', {
        property_id: id,
        rating,
        review: reviewText
      });
      if (response.data?.status === 'success') {
        setReviewText('');
        fetchProperty(); // Refresh reviews list
      }
    } catch (error) {
      setReviewError(error.response?.data?.error || 'Review submission failed.');
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-xl font-bold text-brand-medium">Loading property details...</div>;
  }

  if (!property) {
    return <div className="text-center py-20 text-xl font-bold text-red-500">Property not found.</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      
      {/* LEFT COLUMN (Image, info, reviews) */}
      <div className="lg:col-span-2 space-y-8">
        
        {/* Main Property Title Card */}
        <div className="bg-white border border-brand-medium/20 border-b-6 border-r-2 border-b-brand-medium/40 border-r-brand-medium/25 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-start gap-4">
            <h1 className="text-3xl font-black text-brand-dark leading-tight">{property.title}</h1>
            
            {/* Heart Favorite Button */}
            {user?.role === 'STUDENT' && (
              <button
                onClick={toggleFavorite}
                className={`p-3.5 rounded-2xl border border-brand-medium/20 border-b-4 border-r active:border-b-0 active:border-r-0 active:translate-y-1 active:translate-x-0.5 transition-all cursor-pointer shadow-sm ${
                  isFavorite ? 'bg-red-50 text-red-500 border-red-200' : 'bg-gray-50 text-gray-400 hover:text-red-400'
                }`}
              >
                <FaHeart className="text-lg" />
              </button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm font-semibold text-brand-medium">
            <span>📍 {property.address}, {property.city}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><FaBed /> {property.room_type}</span>
          </div>
        </div>

        {/* 3D Image Frame */}
        <div className="bg-white border border-brand-medium/20 border-b-8 border-r-4 border-b-brand-medium/40 border-r-brand-medium/25 rounded-3xl p-3 shadow-md overflow-hidden h-96">
          <img
            src={property.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80'}
            alt={property.title}
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>

        {/* Description */}
        <div className="bg-white border border-brand-medium/20 border-b-6 border-r-2 border-b-brand-medium/40 border-r-brand-medium/25 rounded-3xl p-6 shadow-sm space-y-3">
          <h2 className="text-xl font-black text-brand-dark">About the Place</h2>
          <p className="text-brand-medium text-sm leading-relaxed whitespace-pre-line">{property.description}</p>
        </div>

        {/* Amenities section */}
        <div className="bg-white border border-brand-medium/20 border-b-6 border-r-2 border-b-brand-medium/40 border-r-brand-medium/25 rounded-3xl p-6 shadow-sm space-y-4">
          <h2 className="text-xl font-black text-brand-dark">Amenities Included</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {property.amenities?.map((item) => (
              <span key={item.amenity.id} className="bg-brand-light/35 border border-brand-medium/15 px-3.5 py-2 rounded-xl text-xs font-bold text-brand-medium shadow-sm">
                ✅ {item.amenity.name}
              </span>
            ))}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white border border-brand-medium/20 border-b-6 border-r-2 border-b-brand-medium/40 border-r-brand-medium/25 rounded-3xl p-6 shadow-sm space-y-6">
          <h2 className="text-xl font-black text-brand-dark">Reviews & Ratings</h2>

          {/* Review writing form for Students */}
          {user?.role === 'STUDENT' && (
            <form onSubmit={handleReviewSubmit} className="space-y-4 border-b border-brand-light pb-6">
              <h3 className="text-sm font-black uppercase text-brand-medium/60">Leave a Review</h3>
              
              {reviewError && <p className="text-xs text-red-500 font-bold">{reviewError}</p>}

              <div className="flex gap-4 items-center">
                <span className="text-sm font-bold text-gray-600">Your Rating:</span>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="bg-brand-light/20 border border-brand-medium/20 rounded-xl px-3 py-1.5 text-sm font-semibold cursor-pointer focus:outline-none"
                >
                  <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                  <option value="4">⭐⭐⭐⭐ (4/5)</option>
                  <option value="3">⭐⭐⭐ (3/5)</option>
                  <option value="2">⭐⭐ (2/5)</option>
                  <option value="1">⭐ (1/5)</option>
                </select>
              </div>

              <textarea
                placeholder="Share your experience staying here..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full bg-brand-light/20 border border-brand-medium/20 rounded-xl p-4 text-sm focus:outline-none shadow-inner h-24"
                required
              />

              <button
                type="submit"
                className="bg-brand-medium hover:bg-brand-accent text-white px-5 py-2.5 rounded-xl font-black uppercase text-xs tracking-wider border-b-4 border-r border-brand-dark active:border-b-0 active:border-r-0 active:translate-y-1 active:translate-x-0.5 transition-all duration-150 cursor-pointer"
              >
                Submit Review
              </button>
            </form>
          )}

          {/* List of reviews */}
          <div className="space-y-4">
            {property.reviews?.length === 0 ? (
              <p className="text-gray-400 font-medium text-sm">No reviews have been left for this property yet.</p>
            ) : (
              property.reviews?.map((review) => (
                <div key={review.id} className="bg-brand-light/20 border border-brand-medium/10 rounded-2xl p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-brand-dark flex items-center gap-1.5">
                      <FaUser className="text-brand-medium" /> {review.student.full_name}
                    </span>
                    <span className="flex text-amber-500 text-xs">
                      {Array.from({ length: review.rating }).map((_, i) => <FaStar key={i} />)}
                    </span>
                  </div>
                  <p className="text-brand-medium text-xs leading-relaxed">{review.review}</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN (Sticky Booking Card) */}
      <div className="sticky top-28 space-y-6">
        
        {/* Booking Raised Panel */}
        <div className="bg-white border border-brand-medium/20 border-b-8 border-r-4 border-b-brand-medium/50 border-r-brand-medium/30 rounded-3xl p-6 shadow-md space-y-6">
          <div className="flex justify-between items-center border-b border-brand-light pb-4">
            <span className="text-sm font-bold text-brand-medium">Monthly Rent</span>
            <span className="text-2xl font-black text-brand-dark flex items-center">
              <FaDollarSign className="text-brand-accent text-lg" /> {property.rent}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs font-bold text-brand-medium">
            <div className="bg-brand-light/35 border border-brand-medium/10 p-3 rounded-2xl text-center">
              <div>Deposit Required</div>
              <div className="text-brand-dark text-lg font-black mt-1">${property.deposit}</div>
            </div>
            <div className="bg-brand-light/35 border border-brand-medium/10 p-3 rounded-2xl text-center">
              <div>Rooms Available</div>
              <div className="text-brand-dark text-lg font-black mt-1">{property.available_rooms}</div>
            </div>
          </div>

          {/* Booking Request Form */}
          {property.available_rooms > 0 ? (
            <form onSubmit={handleBooking} className="space-y-4">
              
              {bookingSuccess && (
                <div className="bg-green-50 border border-green-200 p-4 rounded-xl text-xs font-semibold text-green-700">
                  🎉 {bookingSuccess}
                </div>
              )}

              {bookingError && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-xs font-semibold text-red-700">
                  ⚠️ {bookingError}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-brand-medium/60 flex items-center gap-1.5">
                  <FaCalendarAlt /> Select Move-in Date
                </label>
                <input
                  type="date"
                  value={moveInDate}
                  onChange={(e) => setMoveInDate(e.target.value)}
                  className="w-full bg-brand-light/20 border border-brand-medium/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-4 focus:ring-brand-accent/20 shadow-inner cursor-pointer"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={bookingLoading}
                className="w-full flex justify-center items-center gap-2 bg-brand-medium hover:bg-brand-accent text-white py-3.5 rounded-xl font-black uppercase text-xs tracking-wider shadow-md border-b-4 border-r border-brand-dark active:border-b-0 active:border-r-0 active:translate-y-1 active:translate-x-0.5 transition-all duration-150 cursor-pointer disabled:opacity-50"
              >
                {bookingLoading ? 'Sending...' : 'Request Accommodation'}
              </button>
            </form>
          ) : (
            <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-center text-xs font-black text-red-700 uppercase tracking-widest">
              ❌ No Rooms Available
            </div>
          )}
        </div>

        {/* Owner details card */}
        <div className="bg-white border border-brand-medium/20 border-b-8 border-r-4 border-b-brand-medium/50 border-r-brand-medium/30 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-black uppercase text-brand-medium/60">Listed By Owner</h3>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-brand-light flex items-center justify-center border border-brand-medium/25 font-bold text-brand-medium">
              {property.owner?.full_name.charAt(0)}
            </div>
            <div>
              <div className="font-bold text-brand-dark text-sm">{property.owner?.full_name}</div>
              <div className="text-xs text-brand-medium">{property.owner?.email}</div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
