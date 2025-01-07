import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ProfileForm from '../components/ProfileForm';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => { // SELECT * FROM auth.users WHERE id = 'user_id'
      if (!user) {
        navigate('/login');
      } else {
        setUser(user);
      }
    });
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile Settings</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <ProfileForm user={user} onUpdate={() => navigate('/dashboard')} />
      </div>
    </div>
  );
}