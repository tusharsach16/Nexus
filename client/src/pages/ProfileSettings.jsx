import React, { useState, useRef } from 'react';
import { Camera, User, FileText, AtSign, Save, Loader2, SaveIcon, UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import useAuthStore from '../store/useAuthStore';
import api from '../services/api';
import toast from 'react-hot-toast';

const ProfileSettings = () => {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || user?.profile?.name || '',
    username: user?.username || user?.profile?.username || '',
    bio: user?.bio || user?.profile?.bio || '',
  });
  const fileInputRef = useRef(null);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await api.patch('/user/profile', profile);
      setUser({ ...user, profile: data.profile });
      toast.success('Profile updated!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);
    setLoading(true);
    try {
      const { data } = await api.patch('/user/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUser({ ...user, profile: data.profile });
      toast.success('Avatar updated!');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-[#0f0f0f] overflow-y-auto custom-scrollbar">
      <div className="max-w-2xl mx-auto p-6 sm:p-10">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-3">Profile Settings</h1>
          <p className="text-neutral-500 font-medium">Manage your public identity and profile information.</p>
        </div>

        <div className="bg-[#1a1a1a]/50 border border-dark-border rounded-[32px] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          {/* Subtle Background Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />
          
          <form onSubmit={handleUpdate} className="relative z-10 space-y-10">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <img 
                  src={user?.avatarUrl || user?.profile?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.name || user?.profile?.name || 'User'}`} 
                  className="w-40 h-40 rounded-[40px] object-cover ring-4 ring-[#1a1a1a] shadow-2xl relative z-10 transition-transform duration-500 group-hover:scale-[1.02]"
                  alt="Avatar"
                />
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 p-3 bg-primary text-white rounded-2xl shadow-xl hover:bg-primary-dark transition-all active:scale-95 z-20 border-4 border-[#161616]"
                >
                  <Camera className="w-5 h-5" />
                </button>
                <input 
                  type="file" 
                  className="hidden" 
                  ref={fileInputRef} 
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-bold text-white tracking-tight">{user?.name || user?.profile?.name}</h2>
                <p className="text-sm font-bold text-primary uppercase tracking-widest mt-1">@{user?.username || user?.profile?.username}</p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-600 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="text" 
                    className="w-full bg-[#0f0f0f] border border-dark-border rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest ml-1">Username</label>
                <div className="relative group opacity-60">
                  <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-600" />
                  <input 
                    type="text" 
                    className="w-full bg-[#0f0f0f] border border-dark-border rounded-2xl pl-12 pr-4 py-4 text-white outline-none cursor-not-allowed"
                    value={profile.username}
                    readOnly
                    disabled
                  />
                </div>
                <p className="text-[10px] text-neutral-600 font-bold uppercase tracking-tighter ml-1">Usernames cannot be changed</p>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest ml-1">Bio / About</label>
                <div className="relative group">
                  <FileText className="absolute left-4 top-5 w-5 h-5 text-neutral-600 group-focus-within:text-primary transition-colors" />
                  <textarea 
                    className="w-full bg-[#0f0f0f] border border-dark-border rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none min-h-[140px] resize-none leading-relaxed"
                    placeholder="Tell us a little about yourself..."
                    value={profile.bio}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-5 bg-primary text-white font-bold rounded-2xl hover:bg-primary-dark shadow-xl shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-5 h-5" /> 
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
