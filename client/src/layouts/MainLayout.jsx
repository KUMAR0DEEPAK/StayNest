import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <Navbar />
      {/* pt-28 ensures the content is cleanly spaced below the floating navbar */}
      <main className="flex-grow pt-28 pb-12 px-6 max-w-7xl w-full mx-auto">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-gray-100 py-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} StayNest Accommodation Booking. All rights reserved.
      </footer>
    </div>
  );
}
