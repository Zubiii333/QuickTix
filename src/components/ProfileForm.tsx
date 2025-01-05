import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import { Camera } from 'lucide-react';

interface Profile {
  username: string;
  avatar_url: string;
}

interface ProfileFormProps {
  user: User;
  onUpdate: () => void;
}

export default function ProfileForm({ user, onUpdate }: ProfileFormProps) {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    username: '',
    avatar_url: '',
  });

  useEffect(() => {
    getProfile();
  }, [user]);

  async function getProfile() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('username, avatar_url')
        .eq('email', user.email)
        .maybeSingle();
  
      if (error) throw error;
      if (data) setProfile(data);
      else setProfile({ username: '', avatar_url: '' });
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  }

  async function updateProfile(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
  
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');
  
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('email', user.email)
        .single();
  
      if (error) throw error;
  
      if (data) {
        const { error: updateError } = await supabase
          .from('users')
          .update({
            username: profile.username,
            avatar_url: profile.avatar_url,
            updated_at: new Date().toISOString(),
          })
          .eq('id', data.id);
  
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            email: user.email,
            username: profile.username,
            avatar_url: profile.avatar_url,
            created_at: new Date().toISOString(),
          });
  
        if (insertError) throw insertError;
      }
  
      onUpdate();
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAvatarUpload(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setLoading(true);
      if (!event.target.files || event.target.files.length === 0) return;

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      setProfile({ ...profile, avatar_url: data.publicUrl });
    } catch (error) {
      console.error('Error uploading avatar:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={updateProfile} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Avatar</label>
        <div className="mt-1 flex items-center space-x-4">
          <div className="relative">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Avatar"
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                <Camera className="h-6 w-6 text-gray-400" />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          <button
            type="button"
            className="text-sm text-indigo-600 hover:text-indigo-500"
            onClick={() => document.querySelector('input[type="file"]')?.click()}
          >
            Change
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Username</label>
        <input
          type="text"
          value={profile.username || ''}
          onChange={(e) => setProfile({ ...profile, username: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save Profile'}
      </button>
    </form>
  );
} 