import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import MainLayout from './layouts/MainLayout.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import PropertyDetails from './pages/PropertyDetails.jsx';
import Bookings from './pages/Bookings.jsx';
import Favorites from './pages/Favorites.jsx';
import OwnerProperties from './pages/OwnerProperties.jsx';



export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="properties/:id" element={<PropertyDetails />} />
            <Route path="owner/properties" element={<OwnerProperties />} />
            <Route path="*" element={<div className="p-8 text-center text-xl font-bold text-red-500">404 - Page Not Found</div>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
