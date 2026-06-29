import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';
import { FaSearch, FaMapMarkerAlt, FaBed, FaDollarSign, FaSlidersH, FaStar } from 'react-icons/fa';

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [roomType, setRoomType] = useState('');
  const [minRent, setMinRent] = useState('');
  const [maxRent, setMaxRent] = useState('');
  const [selectedSort, setSelectedSort] = useState('newest');

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
    fetchProperties();
  }, [city, roomType, selectedSort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProperties();
  };

  return (
    <div className="space-y-12">
      
      {/* 3D Hero Banner (Warm sand and coffee tones) */}
      <section className="relative bg-gradient-to-br from-brand-light via-white to-brand-light rounded-3xl p-8 md:p-12 border border-brand-medium/20 border-b-8 border-r-4 border-b-brand-medium/50 border-r-brand-medium/30 shadow-[0_15px_30px_rgba(144,105,86,0.06)] text-brand-dark">
        <div className="relative z-10 max-w-2xl space-y-6">
          <span className="bg-brand-accent/20 text-brand-dark border border-brand-accent/30 px-3.5 py-1 rounded-full text-xs font-black tracking-widest uppercase shadow-sm">
            🏠 Find Your Nest
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight text-brand-dark">
            Premium Student Accommodations Made Simple
          </h1>
          <p className="text-brand-medium text-base md:text-lg font-semibold leading-relaxed">
            Explore verified listings near your college with high-speed WiFi, gym access, and student-focused community living.
          </p>
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
                <div className="relative h-48 bg-brand-light/35 overflow-hidden">
                  <img
                    src={property.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80'}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-brand-medium text-white text-xs font-black tracking-widest uppercase px-3 py-1 rounded-lg shadow-md border-b-2 border-brand-dark">
                    {property.room_type}
                  </span>
                  
                  <span className="absolute bottom-4 right-4 bg-brand-dark/95 text-white text-sm font-black px-3.5 py-1.5 rounded-lg shadow-md flex items-center border border-brand-medium/20">
                    <span className="text-brand-accent text-xs font-bold mr-0.5">$</span>
                    <span>{property.rent}</span>
                    <span className="text-[10px] text-gray-400 font-normal">/mo</span>
                  </span>
                </div>

                <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-brand-medium/60 uppercase tracking-widest">
                      <span>📍 {property.city}</span>
                      <span className="flex items-center gap-0.5 text-amber-500">
                        <FaStar /> 4.8
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
