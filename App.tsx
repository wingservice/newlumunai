
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Generator from './pages/Generator';
import History from './pages/History';
import Credits from './pages/Credits';
import Admin from './pages/Admin';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Settings from './pages/Settings';
import { User } from './types';
import { mockBackend } from './services/apiService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = mockBackend.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setIsLoading(false);
  }, []);

  const handleAuthSuccess = (authUser: User) => {
    setUser(authUser);
  };

  const handleLogout = () => {
    mockBackend.logout();
    setUser(null);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser({ ...updatedUser });
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-zinc-950 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        <p className="text-zinc-500 font-medium tracking-widest text-xs uppercase animate-pulse">Initializing Studio...</p>
      </div>
    );
  }

  return (
    <Router>
      {!user ? (
        <Routes>
          <Route path="/login" element={<Login onLoginSuccess={handleAuthSuccess} />} />
          <Route path="/signup" element={<Signup onSignupSuccess={handleAuthSuccess} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      ) : (
        <div className="flex min-h-screen bg-zinc-950 text-zinc-50 overflow-x-hidden">
          <Sidebar user={user} />
          <main className="flex-1 flex flex-col min-w-0">
            <Header user={user} onLogout={handleLogout} />
            <div className="flex-1">
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/studio" element={<Generator user={user} onUpdateUser={handleUpdateUser} />} />
                <Route path="/history" element={<History />} />
                <Route path="/credits" element={<Credits onUpdateUser={handleUpdateUser} />} />
                <Route path="/admin" element={user?.isAdmin ? <Admin /> : <Navigate to="/dashboard" replace />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </div>
          </main>
        </div>
      )}
    </Router>
  );
};

export default App;
