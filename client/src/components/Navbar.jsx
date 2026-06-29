import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { FaHome, FaSignOutAlt, FaUser, FaClipboardList, FaHeart } from 'react-icons/fa';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-6 pt-4 pointer-events-none">
      <nav className="max-w-7xl mx-auto pointer-events-auto backdrop-blur-lg bg-white/90 border border-brand-medium/20 border-b-4 border-r-2 border-b-brand-medium/55 border-r-brand-medium/30 rounded-2xl px-6 py-3.5 flex justify-between items-center shadow-[0_20px_35px_-15px_rgba(27,16,12,0.08)] hover:-translate-y-0.5 transition-all duration-300">
        
        {/* Logo (Warm Sand Accent) */}
        <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold text-brand-medium tracking-tight hover:scale-105 transition-transform duration-200">
          <FaHome className="text-brand-accent drop-shadow-[0_2px_4px_rgba(212,163,131,0.3)]" />
          <span className="text-brand-dark">Stay<span className="text-brand-medium">Nest</span></span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          {user ? (
            <>
              {user.role === 'STUDENT' && (
                <>
                  <Link to="/bookings" className="flex items-center gap-1.5 text-brand-medium hover:text-brand-accent font-bold transition hover:scale-105 duration-200">
                    <FaClipboardList /> My Bookings
                  </Link>
                  <Link to="/favorites" className="flex items-center gap-1.5 text-brand-medium hover:text-brand-accent font-bold transition hover:scale-105 duration-200">
                    <FaHeart className="text-red-500 animate-pulse" /> Favorites
                  </Link>
                </>
              )}

              {user.role === 'OWNER' && (
                <>
                  <Link to="/owner/properties" className="text-brand-medium hover:text-brand-accent font-bold transition hover:scale-105 duration-200">
                    My Properties
                  </Link>
                  <Link to="/bookings" className="text-brand-medium hover:text-brand-accent font-bold transition hover:scale-105 duration-200">
                    Booking Requests
                  </Link>
                </>
              )}

              <div className="h-5 w-[1px] bg-brand-medium/20"></div>

              {/* User Card */}
              <div className="flex items-center gap-2 bg-gradient-to-br from-brand-light to-white border border-brand-medium/30 border-b-2 border-r-2 border-b-brand-medium/50 border-r-brand-medium/20 px-3.5 py-1.5 rounded-xl shadow-inner font-semibold text-brand-dark">
                <FaUser className="text-brand-medium" />
                <span>{user.full_name.split(' ')[0]}</span>
                <span className="text-[10px] bg-brand-medium text-white px-2 py-0.5 rounded-lg font-black tracking-wider uppercase">
                  {user.role}
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 border-b-2 border-r-2 border-b-red-300 border-r-red-200 active:border-b-0 active:border-r-0 active:translate-y-0.5 active:translate-x-0.5 px-3.5 py-1.5 rounded-xl text-sm font-bold shadow-sm hover:shadow transition-all duration-150 cursor-pointer"
              >
                <FaSignOutAlt /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-brand-medium hover:text-brand-accent font-bold transition hover:scale-105 duration-200">
                Login
              </Link>
              {/* Register Button */}
              <Link 
                to="/register" 
                className="bg-gradient-to-r from-brand-medium to-brand-accent hover:from-brand-accent hover:to-brand-medium text-white border-b-4 border-r border-brand-dark active:border-b-0 active:border-r-0 active:translate-y-1 active:translate-x-0.5 px-5 py-2.5 rounded-xl font-bold shadow-md transition-all duration-150"
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
