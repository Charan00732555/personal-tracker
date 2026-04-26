import React, { useEffect, useState } from 'react';
import { journalService } from '../api/journalService';
import { BookOpen, Send, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';
import XpBar from '../components/level-up/XpBar';
import { getPlayerStats } from '../api/statsService';

const QUESTIONS = [
  { id: 'reflection', label: 'What stayed with me today?' },
  { id: 'alignment', label: 'Where did I act in alignment?' },
  { id: 'energy', label: 'Drained vs Gained energy' },
  { id: 'avoidance', label: 'What am I avoiding?' },
  { id: 'needs', label: 'What does my body/heart need?' }
];

const Journal = () => {
    const [entries, setEntries] = useState([]);
    const [stats, setStats] = useState(null);
    const [formData, setFormData] = useState({
        reflection: '', alignment: '', energy: '', avoidance: '', needs: '', date: new Date().toISOString().split('T')[0]
    });
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const fetchEntries = async () => {
        try {
            const data = await journalService.getAll();
            const sortedData = data.sort((a,b) => new Date(b.date) - new Date(a.date));
            setEntries(sortedData);
            
            const statsData = await getPlayerStats();
            setStats(statsData);

            // Pre-fill today's entry if it exists
            const today = new Date().toISOString().split('T')[0];
            const todayEntry = sortedData.find(e => e.date === today);
            if (todayEntry) {
                setFormData(todayEntry);
            }
        } catch(e) {
            console.error("Failed to fetch journals", e);
        }
    };

    useEffect(() => {
        fetchEntries();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await journalService.createOrUpdate(formData);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
            fetchEntries();
        } catch(err) {
            console.error("Failed to save journal", err);
        } finally {
            setIsSaving(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        <div className="space-y-6 animate-in fade-in h-[calc(100vh-140px)] flex flex-col">
            {stats && (
                <XpBar 
                    title="WISDOM" 
                    currentXp={stats.wisdomXpRemaining} 
                    maxXp={100} 
                    level={stats.wisdomLevel} 
                    systemMessage="Reflection cultivates inner clarity."
                />
            )}
            
            <div className="flex flex-col lg:flex-row gap-8 flex-1 overflow-hidden">
                {/* Left Box: Form */}
                <div className="flex-1 flex flex-col bg-zinc-900/60 border border-zinc-800 rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] h-full relative">
                <div className="p-6 border-b border-zinc-800 bg-zinc-900/80 sticky top-0 z-10 backdrop-blur-md flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-black italic text-white flex items-center gap-3 tracking-widest uppercase">
                            <BookOpen className="text-mana-blue" size={32} /> 
                            Daily <span className="text-mana-blue">Log</span>
                        </h2>
                        <p className="text-sm font-bold text-zinc-500 mt-1 uppercase tracking-widest flex items-center gap-2">
                            <CalendarIcon size={14} /> {formatDate(formData.date)}
                        </p>
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 pb-32">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {QUESTIONS.map((q) => (
                            <div key={q.id} className="relative group">
                                <label className="block text-sm font-black text-zinc-400 uppercase tracking-widest mb-3 group-focus-within:text-mana-blue transition-colors">
                                    {q.label}
                                </label>
                                <textarea
                                    name={q.id}
                                    value={formData[q.id] || ''}
                                    onChange={handleChange}
                                    className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl p-4 text-white placeholder-zinc-700/50 focus:border-mana-blue outline-none transition-all min-h-[120px] resize-y shadow-inner text-base leading-relaxed"
                                    placeholder={`Reflect: ${q.label}`}
                                />
                            </div>
                        ))}
                    </form>
                </div>
                
                {/* Fixed Bottom Save Bar */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-zinc-900 via-zinc-900/95 to-transparent border-t border-zinc-800/0">
                    <button 
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className={`w-full font-black py-4 rounded-xl flex items-center justify-center gap-3 uppercase tracking-widest transition-all ${
                            showSuccess 
                            ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(52,211,153,0.4)]' 
                            : 'bg-mana-blue text-black hover:bg-white shadow-[0_0_20px_rgba(0,210,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]'
                        }`}
                    >
                        {isSaving ? 'Syncing...' : showSuccess ? <><CheckCircle2 size={24}/> Synced</> : <><Send size={20}/> Inject Entry</>}
                    </button>
                </div>
            </div>

            {/* Right Box: Timeline/Masonry */}
            <div className="flex-1 lg:max-w-md xl:max-w-xl flex flex-col bg-zinc-950/50 border border-zinc-800/50 rounded-3xl h-full shadow-[inset_0_0_30px_rgba(0,0,0,0.8)] overflow-hidden">
                 <div className="p-6 border-b border-zinc-800/50 bg-zinc-900/40 sticky top-0 z-10 backdrop-blur-md">
                    <h3 className="text-xl font-black text-zinc-300 uppercase tracking-widest">The Archives</h3>
                    <p className="text-xs text-zinc-500 font-bold tracking-widest uppercase mt-1">{entries.length} reflections logged</p>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {entries.map(entry => {
                        const hasContent = QUESTIONS.some(q => entry[q.id] && entry[q.id].trim() !== '');
                        if (!hasContent) return null; // Don't show totally empty entries in archives

                        return (
                            <div key={entry.id} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 hover:border-mana-blue/50 transition-colors group">
                                <h4 className="text-sm font-black text-mana-blue uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <CalendarIcon size={16} /> {formatDate(entry.date)}
                                </h4>
                                
                                <div className="space-y-4">
                                    {QUESTIONS.map(q => entry[q.id] && entry[q.id].trim() !== '' && (
                                        <div key={q.id}>
                                            <h5 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">{q.label}</h5>
                                            <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">{entry[q.id]}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}

                    {entries.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-50 pb-20 space-y-4">
                            <BookOpen size={48} className="text-zinc-800" />
                            <p className="text-zinc-500 font-medium">Your archives are empty.<br/>Start logging your first check-in today.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
        </div>
    );
};

export default Journal;
