import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import { FaHome, FaSignOutAlt, FaUser, FaClipboardList, FaHeart, FaBars, FaTimes } from 'react-icons/fa'; // 1. Added FaBars and FaTimes
import StayNestLogo from './StayNestLogo.jsx';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [hasNewReviews, setHasNewReviews] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // 2. State for mobile toggle

  // Fetch bookings and properties in real-time (polling every 8 seconds) to display live status badges
  useEffect(() => {
    if (!user) {
      setBookings([]);
      setHasNewReviews(false);
      return;
    }

    const fetchData = async () => {
      try {
        const bookingResponse = await api.get('/bookings');
        if (bookingResponse.data?.status === 'success') {
          setBookings(bookingResponse.data.data);
        }

        if (user.role === 'OWNER') {
          const propertiesResponse = await api.get('/properties');
          if (propertiesResponse.data?.status === 'success') {
            const myListings = propertiesResponse.data.data.filter((p) => p.owner_id === user.id);
            const seenReviews = JSON.parse(localStorage.getItem('seenReviews') || '[]');
            const hasUnseen = myListings.some(
              (p) => p.reviews && p.reviews.some((r) => !seenReviews.includes(r.id))
            );
            setHasNewReviews(hasUnseen);
          }
        }
      } catch (error) {
        console.error('Navbar live data fetch error:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 8000);
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = () => {
    setIsMobileMenuOpen(false); // Close menu on logout
    logout();
    navigate('/login');
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 pt-4 pointer-events-none">
      <nav className="max-w-7xl mx-auto pointer-events-auto backdrop-blur-lg bg-white/90 border border-brand-medium/20 border-b-4 border-r-2 border-b-brand-medium/55 border-r-brand-medium/30 rounded-2xl px-4 md:px-6 py-3.5 flex flex-col md:flex-row md:justify-between md:items-center shadow-[0_20px_35px_-15px_rgba(27,16,12,0.08)] hover:-translate-y-0.5 transition-all duration-300">
        
        {/* Header Row (Logo + Mobile Hamburger button) */}
        <div className="flex justify-between items-center w-full md:w-auto">
          <Link 
            to="/" 
            onClick={() => setIsMobileMenuOpen(false)} 
            className="flex items-center gap-1.5 text-2xl font-black text-brand-medium tracking-tight hover:scale-[1.03] transition-transform duration-200"
          >
            <StayNestLogo size={36} />
            <span className="text-brand-dark">Stay<span className="text-brand-medium">Nest</span></span>
          </Link>

          {/* Toggle Hamburger Button on Mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-brand-dark hover:text-brand-accent transition focus:outline-none cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <FaTimes className="text-2xl" />
            ) : (
              <FaBars className="text-2xl" />
            )}
          </button>
        </div>

        {/* Navigation Links and User Action Stack */}
        <div className={`${isMobileMenuOpen ? 'flex mt-4 pt-4 border-t border-brand-medium/10' : 'hidden'} md:flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-6 w-full md:w-auto`}>
          {user ? (
            <>
              {user.role === 'STUDENT' && (
                <>
                  <Link 
                    to="/bookings" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="relative flex items-center gap-1.5 text-brand-medium hover:text-brand-accent font-bold transition hover:scale-105 duration-200 py-1.5 md:py-0"
                  >
                    <FaClipboardList /> My Bookings
                    {bookings.some(
                      (b) =>
                        (b.booking_status === 'ACCEPTED' || b.booking_status === 'REJECTED') &&
                        !JSON.parse(localStorage.getItem('seenBookings') || '[]').includes(`${b.id}-${b.booking_status}`)
                    ) && (
                      <span
                        className="w-2.5 h-2.5 rounded-full absolute -top-0.5 md:-top-1 -right-2 border border-white bg-green-500"
                        title="Booking Status Updated!"
                      />
                    )}
                  </Link>
                  <Link 
                    to="/favorites" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-1.5 text-brand-medium hover:text-brand-accent font-bold transition hover:scale-105 duration-200 py-1.5 md:py-0"
                  >
                    <FaHeart className="text-red-500 animate-pulse" /> Favorites
                  </Link>
                </>
              )}

              {user.role === 'OWNER' && (
                <>
                  <Link 
                    to="/owner/properties" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="relative text-brand-medium hover:text-brand-accent font-bold transition hover:scale-105 duration-200 py-1.5 md:py-0"
                  >
                    My Properties
                    {hasNewReviews && (
                      <span
                        className="w-2.5 h-2.5 rounded-full absolute -top-1 -right-2 border border-white bg-green-500"
                        title="New Reviews!"
                      />
                    )}
                  </Link>
                  <Link 
                    to="/bookings" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-brand-medium hover:text-brand-accent font-bold transition hover:scale-105 duration-200 py-1.5 md:py-0"
                  >
                    Booking Requests
                  </Link>
                </>
              )}

              {/* Vertical divider only visible on desktops */}
              <div className="hidden md:block h-5 w-[1px] bg-brand-medium/20"></div>

              {/* User Identity Info Card */}
              <div className="flex items-center justify-between md:justify-start gap-2 bg-gradient-to-br from-brand-light to-white border border-brand-medium/30 border-b-2 border-r-2 border-b-brand-medium/55 border-r-brand-medium/20 px-3.5 py-1.5 rounded-xl shadow-inner font-semibold text-brand-dark">
                <div className="flex items-center gap-2">
                  <FaUser className="text-brand-medium" />
                  <span>{user.full_name.split(' ')[0]}</span>
                </div>
                <span className="text-[10px] bg-brand-medium text-white px-2 py-0.5 rounded-lg font-black tracking-wider uppercase">
                  {user.role}
                </span>
              </div>

              {/* Logout Action Button */}
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 border-b-2 border-r-2 border-b-red-300 border-r-red-200 active:border-b-0 active:border-r-0 active:translate-y-0.5 active:translate-x-0.5 px-3.5 py-2.5 md:py-1.5 rounded-xl text-sm font-bold shadow-sm hover:shadow transition-all duration-150 cursor-pointer"
              >
                <FaSignOutAlt /> Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-brand-medium hover:text-brand-accent font-bold transition hover:scale-105 duration-200 py-2.5 md:py-0 text-center md:text-left"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-gradient-to-r from-brand-medium to-brand-accent hover:from-brand-accent hover:to-brand-medium text-white border-b-4 border-r border-brand-dark active:border-b-0 active:border-r-0 active:translate-y-1 active:translate-x-0.5 px-5 py-2.5 rounded-xl font-bold shadow-md transition-all duration-150 text-center"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
