import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LogOut, Ticket, UserCircle } from 'lucide-react';

interface Profile {
  username: string;
  avatar_url: string;
}

export default function Layout({ children, session }: { children: React.ReactNode; session: any }) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (session?.user) {
      getProfile();
    }
  }, [session]);

  async function getProfile() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div>
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link
                to="/"
                className="flex items-center px-2 py-2 text-gray-900 hover:text-indigo-600"
              >
                <Ticket className="h-6 w-6 mr-2" />
                <span className="font-semibold text-xl">QuickTix</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {session ? (
                <>
                  <Link
                    to="/dashboard"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:text-indigo-600"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:text-indigo-600"
                  >
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt="Profile"
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <UserCircle className="h-8 w-8" />
                    )}
                    <span>{profile?.username || 'Profile'}</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:text-indigo-600"
                  >
                    <LogOut className="h-5 w-5 mr-1" />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="px-3 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main>{children}</main>
    </div>
  );
}