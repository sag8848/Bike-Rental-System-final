import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Bikes from './pages/Bikes';
import BikeDetail from './pages/BikeDetail';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBikes from './pages/admin/AdminBikes';
import AdminBookings from './pages/admin/AdminBookings';
import AdminUsers from './pages/admin/AdminUsers';
import AdminChat from './pages/admin/AdminChat';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{
          duration: 3000,
          style: { borderRadius: '12px', fontSize: '14px' },
        }} />
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/bikes" element={<Bikes />} />
              <Route path="/bikes/:id" element={<BikeDetail />} />

              {/* Customer Protected */}
              <Route path="/my-bookings" element={
                <ProtectedRoute roles={['customer']}>
                  <MyBookings />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/chat" element={
                <ProtectedRoute roles={['customer']}>
                  <Chat />
                </ProtectedRoute>
              } />

              {/* Admin Protected */}
              <Route path="/admin" element={
                <ProtectedRoute roles={['admin', 'superadmin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/bikes" element={
                <ProtectedRoute roles={['admin', 'superadmin']}>
                  <AdminBikes />
                </ProtectedRoute>
              } />
              <Route path="/admin/bookings" element={
                <ProtectedRoute roles={['admin', 'superadmin']}>
                  <AdminBookings />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute roles={['superadmin']}>
                  <AdminUsers />
                </ProtectedRoute>
              } />
              <Route path="/admin/chat" element={
                <ProtectedRoute roles={['admin', 'superadmin']}>
                  <AdminChat />
                </ProtectedRoute>
              } />

              {/* 404 */}
              <Route path="*" element={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-8xl font-black text-orange-100">404</div>
                    <h1 className="text-3xl font-bold text-gray-800 mt-2">Page Not Found</h1>
                    <p className="text-gray-500 mt-2 mb-6">The page you're looking for doesn't exist.</p>
                    <a href="/" className="btn-primary px-8 py-3">Go Home</a>
                  </div>
                </div>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
