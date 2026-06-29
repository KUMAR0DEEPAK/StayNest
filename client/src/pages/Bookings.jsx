import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import { FaCalendarAlt, FaHome, FaCheck, FaTimes, FaPhone, FaEnvelope } from 'react-icons/fa';

export default function Bookings() {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await api.get('/bookings');
      if (response.data?.status === 'success') {
        setBookings(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  // Update Booking Status Handler (Accept, Reject, Cancel)
  const handleStatusUpdate = async (bookingId, newStatus) => {
    if (actionLoading) return;
    setActionLoading(true);
    try {
      const response = await api.put(`/bookings/${bookingId}`, { status: newStatus });
      if (response.data?.status === 'success') {
        // Refresh bookings list after updating status
        fetchBookings();
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert(error.response?.data?.error || 'Failed to update booking status.');
      setActionLoading(false);
    } finally {
      setActionLoading(false);
    }
  };

  // Helper to color-code status badges
  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-xl font-bold text-brand-medium">Loading bookings...</div>;
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Page Header */}
      <div className="text-center md:text-left space-y-2">
        <h1 className="text-3xl font-black text-brand-dark">
          {user?.role === 'OWNER' ? 'Booking Requests Received' : 'My Booking Dashboard'}
        </h1>
        <p className="text-sm font-semibold text-brand-medium">
          {user?.role === 'OWNER' 
            ? 'Manage accommodation requests submitted by students' 
            : 'Track the status of your housing application requests'}
        </p>
      </div>

      {/* Bookings Catalog */}
      {bookings.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed border-brand-medium/20 rounded-2xl p-8 space-y-4 shadow-sm">
          <FaHome className="mx-auto text-4xl text-brand-medium/30" />
          <p className="text-brand-medium font-semibold">No booking requests found.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            
            // 3D Booking Card
            <div
              key={booking.id}
              className="bg-white border border-brand-medium/20 border-b-6 border-r-2 border-b-brand-medium/40 border-r-brand-medium/25 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-[0_15px_30px_rgba(144,105,86,0.06)] transition-all duration-300"
            >
              {/* Left Section: Details */}
              <div className="space-y-4 flex-grow">
                
                {/* Title and Status Badge */}
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-lg font-black text-brand-dark">{booking.property.title}</h3>
                  <span className={`text-xs font-black tracking-widest uppercase px-2.5 py-0.5 rounded-lg border-b-2 shadow-sm ${getStatusBadge(booking.booking_status)}`}>
                    {booking.booking_status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold text-brand-medium">
                  {/* Common Details */}
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-brand-accent" />
                    <span>Move-in Date: {new Date(booking.move_in_date).toLocaleDateString()}</span>
                  </div>

                  {/* Student View: Shows Owner Contact Info */}
                  {user?.role === 'STUDENT' && (
                    <div className="space-y-1">
                      <div className="text-gray-400 uppercase tracking-wider text-[10px]">Owner Contacts</div>
                      <div className="text-brand-dark flex items-center gap-1.5"><FaPhone /> {booking.property.owner?.phone || 'N/A'}</div>
                      <div className="text-brand-dark flex items-center gap-1.5"><FaEnvelope /> {booking.property.owner?.email}</div>
                    </div>
                  )}

                  {/* Owner View: Shows Student Info */}
                  {user?.role === 'OWNER' && (
                    <div className="space-y-1">
                      <div className="text-gray-400 uppercase tracking-wider text-[10px]">Requesting Student</div>
                      <div className="text-brand-dark font-black">{booking.student.full_name}</div>
                      <div className="text-brand-dark flex items-center gap-1.5"><FaPhone /> {booking.student.phone || 'N/A'}</div>
                      <div className="text-brand-dark flex items-center gap-1.5"><FaEnvelope /> {booking.student.email}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Section: Action Buttons */}
              <div className="w-full md:w-auto flex gap-3">
                {/* Student Actions: Cancel booking */}
                {user?.role === 'STUDENT' && ['PENDING', 'ACCEPTED'].includes(booking.booking_status) && (
                  <button
                    onClick={() => handleStatusUpdate(booking.id, 'CANCELLED')}
                    disabled={actionLoading}
                    className="w-full md:w-auto bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 border-b-4 border-r border-red-300 active:border-b-0 active:border-r-0 active:translate-y-1 active:translate-x-0.5 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-sm transition-all duration-150 cursor-pointer"
                  >
                    Cancel Booking
                  </button>
                )}

                {/* Owner Actions: Accept or Reject request */}
                {user?.role === 'OWNER' && booking.booking_status === 'PENDING' && (
                  <>
                    {/* Reject Button */}
                    <button
                      onClick={() => handleStatusUpdate(booking.id, 'REJECTED')}
                      disabled={actionLoading}
                      className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 border-b-4 border-r border-red-300 active:border-b-0 active:border-r-0 active:translate-y-1 active:translate-x-0.5 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-sm transition-all duration-150 cursor-pointer"
                    >
                      <FaTimes /> Reject
                    </button>

                    {/* Accept Button */}
                    <button
                      onClick={() => handleStatusUpdate(booking.id, 'ACCEPTED')}
                      disabled={actionLoading}
                      className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 bg-brand-medium hover:bg-brand-accent text-white border border-brand-medium/20 border-b-4 border-r border-brand-dark active:border-b-0 active:border-r-0 active:translate-y-1 active:translate-x-0.5 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-sm transition-all duration-150 cursor-pointer"
                    >
                      <FaCheck /> Accept
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
