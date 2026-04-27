import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Eye, EyeOff } from 'lucide-react';
import SystemTutorialModal from '../components/common/SystemTutorialModal';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();
    const [showTutorial, setShowTutorial] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        setLoading(true);
        try {
            await register(username, email, password);
            setShowTutorial(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Email may already be in use.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background glow effects */}
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-mana-blue/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black tracking-tighter text-mana-blue italic mb-1">
                        HUNTER <span className="text-white">REGISTRY</span>
                    </h1>
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-mana-blue to-transparent mb-4" />
                    <p className="text-zinc-500 text-sm uppercase tracking-widest font-bold">
                        The System awaits your registration
                    </p>
                </div>

                {/* Card */}
                <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-8 shadow-[0_0_40px_rgba(0,210,255,0.07)] backdrop-blur-xl">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">
                                Hunter Name
                            </label>
                            <input
                                id="register-username"
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                required
                                className="w-full bg-zinc-950 border border-zinc-700 focus:border-mana-blue rounded-xl px-4 py-3 text-white outline-none transition-all text-sm"
                                placeholder="Sung Jin-Woo"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">
                                Email
                            </label>
                            <input
                                id="register-email"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                className="w-full bg-zinc-950 border border-zinc-700 focus:border-mana-blue rounded-xl px-4 py-3 text-white outline-none transition-all text-sm"
                                placeholder="hunter@system.io"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="register-password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    className="w-full bg-zinc-950 border border-zinc-700 focus:border-mana-blue rounded-xl px-4 py-3 text-white outline-none transition-all text-sm pr-12"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-950/40 border border-red-800/40 rounded-xl px-4 py-3 text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            id="register-submit"
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-mana-blue text-black font-black uppercase tracking-widest rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(0,210,255,0.3)] flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <Shield size={18} />
                            {loading ? 'Registering...' : 'Awaken Your Power'}
                        </button>
                    </form>

                    <p className="text-center text-zinc-500 text-sm mt-6">
                        Already a Hunter?{' '}
                        <Link to="/login" className="text-mana-blue hover:text-white transition-colors font-bold">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>

            <SystemTutorialModal 
                isOpen={showTutorial} 
                onClose={() => navigate('/')} 
            />
        </div>
    );
};

export default Register;
