import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(identifier, password);
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid credentials. Check your name and password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background glow effects */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-mana-blue/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black tracking-tighter text-mana-blue italic mb-1">
                        SYSTEM <span className="text-white">ACCESS</span>
                    </h1>
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-mana-blue to-transparent mb-4" />
                    <p className="text-zinc-500 text-sm uppercase tracking-widest font-bold">
                        Enter your credentials, Hunter
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
                                id="login-username"
                                type="text"
                                value={identifier}
                                onChange={e => setIdentifier(e.target.value)}
                                required
                                className="w-full bg-zinc-950 border border-zinc-700 focus:border-mana-blue rounded-xl px-4 py-3 text-white outline-none transition-all text-sm"
                                placeholder="Sung Jin-Woo"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="login-password"
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
                            id="login-submit"
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-mana-blue text-black font-black uppercase tracking-widest rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(0,210,255,0.3)] flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <Zap size={18} />
                            {loading ? 'Authenticating...' : 'Enter the System'}
                        </button>
                    </form>

                    <p className="text-center text-zinc-500 text-sm mt-6">
                        New Hunter?{' '}
                        <Link to="/register" className="text-mana-blue hover:text-white transition-colors font-bold">
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
