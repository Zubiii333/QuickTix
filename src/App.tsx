import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import AuthForm from './components/AuthForm';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import Profile from './pages/Profile';
import Layout from './components/Layout';

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={session ? <Navigate to="/dashboard" /> : <AuthForm />}
        />
        <Route
          path="/profile"
          element={
            session ? (
              <Layout session={session}>
                <Profile />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/"
          element={
            <Layout session={session}>
              <Events />
            </Layout>
          }
        />
        <Route
          path="/dashboard"
          element={
            session ? (
              <Layout session={session}>
                <Dashboard />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}