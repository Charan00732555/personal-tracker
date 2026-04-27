import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, updateUserProfile } from '../api/userService';
import { Save, Loader, LogOut, Info } from 'lucide-react';
import SystemTutorialModal from '../components/common/SystemTutorialModal';
import { useNavigate } from 'react-router-dom';

const AVATARS = [
    { id: 'shadow_monarch', name: 'Shadow Monarch', src: '/avatars/shadow_monarch.png' },
    { id: 'knight_commander', name: 'Knight Commander', src: '/avatars/knight_commander.png' },
    { id: 'stealth_assassin', name: 'Stealth Assassin', src: '/avatars/stealth_assassin.png' },
    { id: 'arcane_mage', name: 'Arcane Mage', src: '/avatars/arcane_mage.png' }
];

const Profile = () => {
    const { user, updateUser, logout } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showTutorial, setShowTutorial] = useState(false);
    
    const [formData, setFormData] = useState({
        username: '',
        avatarId: 'shadow_monarch'
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const data = await getUserProfile();
            setFormData({
                username: data.username,
                avatarId: data.avatarId || 'shadow_monarch'
            });
        } catch (err) {
            setError('Failed to load profile data.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            const updatedProfile = await updateUserProfile(formData);
            setSuccess('Profile updated successfully!');
            // Update the global context so the sidebar refreshes immediately
            if (updateUser) {
                updateUser({
                    username: updatedProfile.username,
                    email: updatedProfile.email,
                    avatarId: updatedProfile.avatarId
                });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile. Username might be taken.');
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) {
        return <div className="text-zinc-500 py-10 text-center animate-pulse">Loading System Data...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <section>
                <h2 className="text-3xl font-black tracking-tight text-white italic">
                    HUNTER <span className="text-mana-blue">PROFILE</span>
                </h2>
                <p className="text-zinc-400 mt-2">Manage your System identity and avatar.</p>
            </section>

            <form onSubmit={handleSubmit} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-xl backdrop-blur-sm space-y-8">
                
                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-sm font-medium">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-4 rounded-xl text-sm font-medium">
                        {success}
                    </div>
                )}

                {/* Username Input */}
                <div className="space-y-3">
                    <label className="block text-sm font-bold text-mana-blue tracking-wider uppercase">Hunter Name</label>
                    <input 
                        type="text" 
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-mana-blue rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:ring-1 focus:ring-mana-blue transition-colors"
                        required
                        minLength={3}
                    />
                </div>

                {/* Avatar Selection */}
                <div className="space-y-4">
                    <label className="block text-sm font-bold text-mana-blue tracking-wider uppercase">Select Avatar</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {AVATARS.map(avatar => (
                            <div 
                                key={avatar.id}
                                onClick={() => setFormData({...formData, avatarId: avatar.id})}
                                className={`cursor-pointer rounded-xl border-2 transition-all duration-200 overflow-hidden ${formData.avatarId === avatar.id ? 'border-mana-blue shadow-[0_0_15px_rgba(0,210,255,0.4)] scale-105 z-10' : 'border-zinc-800 hover:border-zinc-600 opacity-60 hover:opacity-100'}`}
                            >
                                <img src={avatar.src} alt={avatar.name} className="w-full aspect-square object-cover" />
                                <div className={`text-xs text-center p-2 font-bold ${formData.avatarId === avatar.id ? 'bg-mana-blue text-zinc-950' : 'bg-zinc-950 text-zinc-400'}`}>
                                    {avatar.name}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-4 border-t border-zinc-800 flex flex-wrap justify-between items-center gap-4">
                    <div className="flex gap-2">
                        <button 
                            type="button"
                            onClick={() => setShowTutorial(true)}
                            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-3 rounded-xl transition-all flex items-center gap-2 text-sm font-bold"
                        >
                            <Info size={18} /> VIEW GUIDE
                        </button>
                        <button 
                            type="button"
                            onClick={handleLogout}
                            className="bg-red-950/20 hover:bg-red-950/40 text-red-400 px-4 py-3 rounded-xl transition-all border border-red-900/50 flex items-center gap-2 text-sm font-bold"
                        >
                            <LogOut size={18} /> LOGOUT
                        </button>
                    </div>
                    <button 
                        type="submit" 
                        disabled={saving}
                        className="bg-mana-blue hover:bg-mana-blue/80 text-zinc-950 font-black px-8 py-3 rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
                    >
                        {saving ? <Loader className="animate-spin" size={20} /> : <Save size={20} />}
                        {saving ? 'SYNCING...' : 'SAVE CHANGES'}
                    </button>
                </div>
            </form>

            <SystemTutorialModal 
                isOpen={showTutorial} 
                onClose={() => setShowTutorial(false)} 
            />
        </div>
    );
};

export default Profile;
