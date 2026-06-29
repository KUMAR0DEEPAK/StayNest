import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';
import { FaHeart, FaTrash, FaMapMarkerAlt, FaBed, FaDollarSign } from 'react-icons/fa';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const response = await api.get('/favorites');
      if (response.data?.status === 'success') {
        setFavorites(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemove = async (propertyId, e) => {
    e.preventDefault(); // Stop navigation to property details page
    try {
      const response = await api.delete(`/favorites/${propertyId}`);
      if (response.data?.status === 'success') {
        // Remove from local state
        setFavorites(prev => prev.filter(fav => fav.property_id !== propertyId));
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-xl font-bold text-brand-medium">Loading your favorites...</div>;
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="text-center md:text-left space-y-2">
        <h1 className="text-3xl font-black text-brand-dark flex items-center justify-center md:justify-start gap-2">
          <FaHeart className="text-red-500" /> Saved Accommodations
        </h1>
        <p className="text-sm font-semibold text-brand-medium">
          Manage your saved property listings for future comparisons.
        </p>
      </div>

      {/* Grid */}
      {favorites.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed border-brand-medium/20 rounded-2xl p-8 space-y-4 shadow-sm">
          <p className="text-brand-medium font-semibold">You have not saved any properties yet.</p>
          <Link
            to="/"
            className="inline-block bg-brand-medium hover:bg-brand-accent text-white px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider border-b-4 border-r border-brand-dark active:border-b-0 active:border-r-0 active:translate-y-0.5 active:translate-x-0.5 transition-all cursor-pointer"
          >
            Explore Accommodations
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {favorites.map((fav) => {
            const property = fav.property;
            return (
              <div
                key={fav.id}
                className="group bg-white border border-brand-medium/10 border-b-6 border-r-2 border-b-brand-medium/40 border-r-brand-medium/25 rounded-2xl overflow-hidden shadow-sm hover:shadow-[0_20px_35px_-10px_rgba(144,105,86,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full"
              >
                {/* Image & Price */}
                <div className="relative h-48 bg-brand-light/35 overflow-hidden">
                  <img
                    src={property.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80'}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Rent Tag */}
                  <span className="absolute bottom-4 left-4 bg-brand-dark/95 text-white text-sm font-black px-3 py-1 rounded-lg shadow-md flex items-center border border-brand-medium/20">
                    <span className="text-brand-accent text-xs font-bold mr-0.5">$</span>
                    <span>{property.rent}</span>
                    <span className="text-[10px] text-gray-400 font-normal">/mo</span>
                  </span>

                  {/* 3D Delete Button */}
                  <button
                    onClick={(e) => handleRemove(property.id, e)}
                    className="absolute top-4 right-4 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 border-b-4 border-r border-red-300 active:border-b-0 active:border-r-0 active:translate-y-0.5 active:translate-x-0.5 p-2.5 rounded-xl shadow-sm hover:shadow transition-all duration-100 cursor-pointer"
                    title="Remove from saved"
                  >
                    <FaTrash className="text-xs" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-brand-medium/60 uppercase tracking-widest flex items-center gap-1">
                      <FaMapMarkerAlt className="text-brand-accent" /> {property.city}
                    </div>
                    <h3 className="text-lg font-black text-brand-dark group-hover:text-brand-accent transition-colors line-clamp-1">
                      {property.title}
                    </h3>
                  </div>

                  <Link
                    to={`/properties/${property.id}`}
                    className="w-full text-center bg-brand-light/50 hover:bg-brand-light text-brand-dark border border-brand-medium/20 border-b-4 border-r border-brand-medium/35 hover:border-b-brand-accent active:border-b-0 active:border-r-0 active:translate-y-1 active:translate-x-0.5 py-2.5 rounded-xl font-black uppercase text-xs tracking-wider transition-all duration-150 block cursor-pointer"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
