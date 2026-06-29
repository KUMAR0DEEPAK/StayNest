import { Outlet, Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { FaHome, FaHeart, FaClipboardList, FaEnvelope, FaPhone, FaMapMarkerAlt, FaTwitter, FaFacebookF, FaInstagram } from 'react-icons/fa';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-light">
      <Navbar />
      {/* pt-28 ensures the content is cleanly spaced below the floating navbar */}
      <main className="flex-grow pt-28 pb-16 px-6 max-w-7xl w-full mx-auto">
        <Outlet />
      </main>
      
      {/* Premium Detailed 3D Footer */}
      <footer className="w-full bg-white border-t border-brand-medium/10 pt-12 pb-8 px-6 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-brand-medium/10">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 text-2xl font-black text-brand-medium tracking-tight">
              <FaHome className="text-brand-accent drop-shadow-[0_2px_4px_rgba(212,163,131,0.3)]" />
              <span className="text-brand-dark">Stay<span className="text-brand-medium">Nest</span></span>
            </Link>
            <p className="text-brand-medium text-xs leading-relaxed max-w-sm font-semibold">
              Making student accommodation booking seamless, verified, and transparent across major educational hubs in India. Find your perfect study home with zero stress.
            </p>
          </div>

          {/* Column 2: Quick Navigation */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase text-brand-dark tracking-wider">Quick Links</h3>
            <ul className="space-y-2 text-xs font-semibold text-brand-medium">
              <li>
                <Link to="/" className="hover:text-brand-accent transition duration-150 flex items-center gap-1.5">
                  🏠 Explore PGs
                </Link>
              </li>
              <li>
                <Link to="/bookings" className="hover:text-brand-accent transition duration-150 flex items-center gap-1.5">
                  <FaClipboardList className="text-[10px]" /> My Dashboard
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="hover:text-brand-accent transition duration-150 flex items-center gap-1.5">
                  <FaHeart className="text-[10px] text-red-400" /> Saved Favorites
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase text-brand-dark tracking-wider">Contact Support</h3>
            <ul className="space-y-2.5 text-xs font-semibold text-brand-medium">
              <li className="flex items-center gap-2 text-brand-dark">
                <FaEnvelope className="text-brand-accent" />
                <span>support@staynest.com</span>
              </li>
              <li className="flex items-center gap-2 text-brand-dark">
                <FaPhone className="text-brand-accent" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-2 text-brand-dark">
                <FaMapMarkerAlt className="text-brand-accent mt-0.5" />
                <span>Powai Tech Park, Powai, Mumbai, MH - 400076</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom (Copyright and Socials) */}
        <div className="max-w-7xl mx-auto pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-brand-medium/70">
          <div>
            &copy; {new Date().getFullYear()} StayNest Student Accommodations. All rights reserved.
          </div>
          
          {/* 3D Social Media Buttons */}
          <div className="flex gap-3">
            <a href="#" className="w-8 h-8 rounded-xl bg-brand-light hover:bg-brand-accent hover:text-white border border-brand-medium/20 border-b-2 border-r border-b-brand-medium/35 active:border-b-0 active:border-r-0 active:translate-y-0.5 active:translate-x-0.5 flex items-center justify-center text-brand-dark transition-all duration-150">
              <FaFacebookF className="text-xs" />
            </a>
            <a href="#" className="w-8 h-8 rounded-xl bg-brand-light hover:bg-brand-accent hover:text-white border border-brand-medium/20 border-b-2 border-r border-b-brand-medium/35 active:border-b-0 active:border-r-0 active:translate-y-0.5 active:translate-x-0.5 flex items-center justify-center text-brand-dark transition-all duration-150">
              <FaTwitter className="text-xs" />
            </a>
            <a href="#" className="w-8 h-8 rounded-xl bg-brand-light hover:bg-brand-accent hover:text-white border border-brand-medium/20 border-b-2 border-r border-b-brand-medium/35 active:border-b-0 active:border-r-0 active:translate-y-0.5 active:translate-x-0.5 flex items-center justify-center text-brand-dark transition-all duration-150">
              <FaInstagram className="text-xs" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
