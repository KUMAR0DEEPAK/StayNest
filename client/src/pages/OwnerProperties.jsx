import { useEffect, useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import { FaPlus, FaTrash, FaHome, FaMapMarkerAlt, FaBed, FaDollarSign } from 'react-icons/fa';

export default function OwnerProperties() {
  const { user } = useContext(AuthContext);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Available amenities for checkboxes (mapped to database seed IDs)
  const availableAmenities = [
    { id: 1, name: 'WiFi' },
    { id: 2, name: 'Air Conditioning' },
    { id: 3, name: 'Laundry' },
    { id: 4, name: 'Parking' },
    { id: 5, name: 'Food Included' },
    { id: 6, name: 'Gym' },
    { id: 7, name: 'Furnished' },
    { id: 8, name: '24/7 Security' }
  ];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      city: 'Mumbai',
      room_type: 'Single Room',
      available_rooms: 1,
      amenities: [] // Will hold selected amenity IDs
    }
  });

  const fetchMyProperties = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await api.get('/properties');
      if (response.data?.status === 'success') {
        // Filter properties belonging to this owner on client-side
        const myListings = response.data.data.filter(p => p.owner_id === user?.id);
        setProperties(myListings);
      }
    } catch (error) {
      console.error('Error fetching owner properties:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProperties();
  }, [user]);

  // Submit Handler for New Property
  const onSubmit = async (data) => {
    setFormError('');
    setFormSuccess('');
    try {
      // Map selected amenity checkboxes (strings) to numbers
      const amenityIds = data.amenities ? data.amenities.map(id => Number(id)) : [];

      // Parse comma-separated image URLs into an array of strings
      const imageUrls = data.imageUrls
        ? data.imageUrls.split(',').map(url => url.trim()).filter(url => url.length > 0)
        : [];

      const response = await api.post('/properties', {
        title: data.title,
        description: data.description,
        rent: Number(data.rent),
        deposit: Number(data.deposit),
        address: data.address,
        city: data.city,
        room_type: data.room_type,
        available_rooms: Number(data.available_rooms),
        amenityIds,
        imageUrls // Send array of image URLs to the backend
      });

      if (response.data?.status === 'success') {
        setFormSuccess('Property listed successfully!');
        reset();
        setShowAddForm(false);
        fetchMyProperties(); // Refresh properties list
      }
    } catch (error) {
      setFormError(error.response?.data?.error || 'Failed to list property.');
    }
  };

  // Delete Listing Handler
  const handleDelete = async (propertyId) => {
    if (!window.confirm('Are you sure you want to delete this property? This will delete all its bookings and reviews.')) return;
    try {
      const response = await api.delete(`/properties/${propertyId}`);
      if (response.data?.status === 'success') {
        setProperties(prev => prev.filter(p => p.id !== propertyId));
      }
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  const isUnseen = (property) => {
    if (!property.reviews || property.reviews.length === 0) return false;
    const seenReviews = JSON.parse(localStorage.getItem('seenReviews') || '[]');
    return property.reviews.some((r) => !seenReviews.includes(r.id));
  };

  if (loading) {
    return <div className="text-center py-20 text-xl font-bold text-brand-medium">Loading your listings...</div>;
  }

  return (
    <div className="space-y-8">
      
      {/* Page Header with 3D Toggle Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-brand-medium/10 pb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-brand-dark">My Listed Accommodations</h1>
          <p className="text-sm font-semibold text-brand-medium">Manage and monitor your properties listed on StayNest</p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setFormError('');
            setFormSuccess('');
          }}
          className="flex items-center gap-1.5 bg-brand-medium hover:bg-brand-accent text-white px-5 py-3 rounded-xl font-black uppercase text-xs tracking-wider shadow-md border-b-4 border-r border-brand-dark active:border-b-0 active:border-r-0 active:translate-y-1 active:translate-x-0.5 transition-all duration-150 cursor-pointer"
        >
          <FaPlus /> {showAddForm ? 'Cancel Listing' : 'List New Property'}
        </button>
      </div>

      {/* 1. 3D ADD PROPERTY FORM CONTAINER */}
      {showAddForm && (
        <section className="max-w-2xl mx-auto bg-white border border-brand-medium/20 border-b-8 border-r-4 border-b-brand-medium/50 border-r-brand-medium/30 rounded-3xl p-8 shadow-md">
          <h2 className="text-xl font-black text-brand-dark mb-6 text-center">New Accommodation Details</h2>
          
          {formError && <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-xs font-semibold text-red-700 mb-4">⚠️ {formError}</div>}
          {formSuccess && <div className="bg-green-50 border border-green-200 p-4 rounded-xl text-xs font-semibold text-green-700 mb-4">🎉 {formSuccess}</div>}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Title */}
            <div className="space-y-1">
              <label className="text-xs font-black uppercase tracking-wider text-brand-medium/60">Property Title</label>
              <input
                type="text"
                placeholder="Cozy Studio near Mumbai University"
                className={`w-full bg-brand-light/10 border ${errors.title ? 'border-red-400' : 'border-brand-medium/20'} rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-brand-accent/20 shadow-inner`}
                {...register('title', { required: 'Title is required' })}
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-xs font-black uppercase tracking-wider text-brand-medium/60">Description</label>
              <textarea
                placeholder="Describe the rooms, vicinity, environment..."
                className={`w-full bg-brand-light/10 border ${errors.description ? 'border-red-400' : 'border-brand-medium/20'} rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-4 focus:ring-brand-accent/20 shadow-inner h-24`}
                {...register('description', { required: 'Description is required' })}
              />
            </div>

            {/* Rent & Deposit row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-black uppercase tracking-wider text-brand-medium/60">Rent ($/mo)</label>
                <input
                  type="number"
                  placeholder="500"
                  className={`w-full bg-brand-light/10 border ${errors.rent ? 'border-red-400' : 'border-brand-medium/20'} rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-brand-accent/20 shadow-inner`}
                  {...register('rent', { required: 'Rent is required', min: 1 })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black uppercase tracking-wider text-brand-medium/60">Security Deposit ($)</label>
                <input
                  type="number"
                  placeholder="1000"
                  className={`w-full bg-brand-light/10 border ${errors.deposit ? 'border-red-400' : 'border-brand-medium/20'} rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-brand-accent/20 shadow-inner`}
                  {...register('deposit', { required: 'Deposit is required', min: 0 })}
                />
              </div>
            </div>

            {/* Address & City row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-black uppercase tracking-wider text-brand-medium/60">Full Address</label>
                <input
                  type="text"
                  placeholder="Street name, landmark..."
                  className={`w-full bg-brand-light/10 border ${errors.address ? 'border-red-400' : 'border-brand-medium/20'} rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-brand-accent/20 shadow-inner`}
                  {...register('address', { required: 'Address is required' })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black uppercase tracking-wider text-brand-medium/60">City</label>
                <select
                  className="w-full bg-brand-light/10 border border-brand-medium/20 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-brand-accent/20 shadow-inner cursor-pointer"
                  {...register('city')}
                >
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Pune">Pune</option>
                </select>
              </div>
            </div>

            {/* Room type & available rooms row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-black uppercase tracking-wider text-brand-medium/60">Room Type</label>
                <select
                  className="w-full bg-brand-light/10 border border-brand-medium/20 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-brand-accent/20 shadow-inner cursor-pointer"
                  {...register('room_type')}
                >
                  <option value="Single Room">Single Room</option>
                  <option value="Double Room">Double Room</option>
                  <option value="Triple Sharing">Triple Sharing</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black uppercase tracking-wider text-brand-medium/60">Available Rooms</label>
                <input
                  type="number"
                  placeholder="1"
                  className="w-full bg-brand-light/10 border border-brand-medium/20 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-brand-accent/20 shadow-inner"
                  {...register('available_rooms', { required: 'Count is required', min: 1 })}
                />
              </div>
            </div>

            {/* Property Image URLs */}
            <div className="space-y-1">
              <label className="text-xs font-black uppercase tracking-wider text-brand-medium/60">Property Image URLs (comma-separated)</label>
              <input
                type="text"
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                className="w-full bg-brand-light/10 border border-brand-medium/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-4 focus:ring-brand-accent/20 shadow-inner"
                {...register('imageUrls')}
              />
              <p className="text-[10px] text-brand-medium/55 font-semibold">Paste URLs of photos, separated by commas, to show a photo gallery to students.</p>
            </div>

            {/* Amenities Checkboxes */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-brand-medium/60">Select Included Amenities:</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {availableAmenities.map((amenity) => (
                  <label key={amenity.id} className="border border-brand-medium/10 border-b-2 rounded-xl p-2.5 flex items-center gap-2 cursor-pointer hover:bg-brand-accent/5 has-[:checked]:border-brand-accent has-[:checked]:bg-brand-accent/10 transition text-xs font-bold text-gray-700">
                    <input
                      type="checkbox"
                      value={amenity.id}
                      className="accent-brand-medium cursor-pointer"
                      {...register('amenities')}
                    />
                    <span>{amenity.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 3D Submit Button */}
            <button
              type="submit"
              className="w-full bg-brand-medium hover:bg-brand-accent text-white py-3.5 rounded-xl font-black uppercase text-xs tracking-wider shadow-md border-b-4 border-r border-brand-dark active:border-b-0 active:border-r-0 active:translate-y-1 active:translate-x-0.5 transition-all duration-150 cursor-pointer"
            >
              List Property
            </button>
          </form>
        </section>
      )}

      {/* 2. OWNER'S LISTINGS CATALOG */}
      {properties.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed border-brand-medium/20 rounded-2xl p-8 space-y-4 shadow-sm">
          <FaHome className="mx-auto text-4xl text-brand-medium/30" />
          <p className="text-brand-medium font-semibold">You have not listed any properties yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {properties.map((property) => (
            <div
              key={property.id}
              className="group bg-white border border-brand-medium/10 border-b-6 border-r-2 border-b-brand-medium/40 border-r-brand-medium/25 rounded-2xl overflow-hidden shadow-sm hover:shadow-[0_20px_35px_-10px_rgba(144,105,86,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full"
            >
              {/* Image & Controls */}
              <div className="relative h-48 bg-brand-light/35 overflow-hidden">
                <img
                  src={property.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80'}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Pulsing Green dot for unseen reviews */}
                {isUnseen(property) && (
                  <span className="absolute top-4 left-4 flex h-3.5 w-3.5 z-20">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-500 border-2 border-white shadow-sm"></span>
                  </span>
                )}
                
                {/* 3D Delete Button */}
                <button
                  onClick={() => handleDelete(property.id)}
                  className="absolute top-4 right-4 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 border-b-4 border-r border-red-300 active:border-b-0 active:border-r-0 active:translate-y-0.5 active:translate-x-0.5 p-2.5 rounded-xl shadow-sm hover:shadow transition-all duration-100 cursor-pointer"
                  title="Delete Listing"
                >
                  <FaTrash className="text-xs" />
                </button>

                {/* Price tag */}
                <span className="absolute bottom-4 left-4 bg-brand-dark/95 text-white text-sm font-black px-3 py-1 rounded-lg shadow-md flex items-center border border-brand-medium/20">
                  <span className="text-brand-accent text-xs font-bold mr-0.5">$</span>
                  <span>{property.rent}</span>
                  <span className="text-[10px] text-gray-400 font-normal">/mo</span>
                </span>
              </div>

              {/* Info */}
              <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="text-xs font-bold text-brand-medium/60 uppercase tracking-widest flex items-center gap-1.5">
                    <FaMapMarkerAlt className="text-brand-accent" /> {property.city}
                  </div>
                  <h3 className="text-lg font-black text-brand-dark group-hover:text-brand-accent transition-colors line-clamp-1">
                    {property.title}
                  </h3>
                  <div className="flex gap-2 text-xs font-bold text-brand-medium">
                    <span className="flex items-center gap-1"><FaBed /> {property.room_type}</span>
                    <span>•</span>
                    <span>Rooms: {property.available_rooms}</span>
                  </div>
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
  );
}
