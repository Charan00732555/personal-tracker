import React, { useEffect, useState } from 'react';
import { dsaService } from '../api/dsaService';
import { Plus, CheckCircle, Circle, Trash2, Search, X } from 'lucide-react';
import AddDsaModal from '../components/dsa/AddDsaModal';
import XpBar from '../components/level-up/XpBar';
import { getPlayerStats } from '../api/statsService';

const PATTERNS = [
  "Backtracking", "Binary Tree Traversal", "Breadth-First Search (BFS)", "Depth-First Search (DFS)",
  "Dynamic Programming", "Fast & Slow Pointers", "LinkedList In-place Reversal", "Matrix Traversal",
  "Modified Binary Search", "Monotonic Stack", "Overlapping Intervals", "Prefix Sum",
  "Sliding Window", "Top K Elements", "Two Pointers"
];

const DsaTracker = () => {
    const [problems, setProblems] = useState([]);
    const [stats, setStats] = useState(null);
    const [expandedPattern, setExpandedPattern] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [filterTopic, setFilterTopic] = useState('');
    const [filterPattern, setFilterPattern] = useState('');
    const [filterDifficulty, setFilterDifficulty] = useState('');
    const [searchResults, setSearchResults] = useState(null);

    const fetchProblems = async () => {
        const data = await dsaService.getAll();
        setProblems(data);
        const statsData = await getPlayerStats();
        setStats(statsData);
        if (searchResults) {
            // refresh search results silently if we are searching
            const results = data.filter(p => {
                if (filterTopic && p.topic !== filterTopic) return false;
                if (filterPattern && p.patternType !== filterPattern) return false;
                if (filterDifficulty && p.difficulty !== filterDifficulty) return false;
                return true;
            });
            setSearchResults(results);
        }
    };

    useEffect(() => {
        fetchProblems();
    }, []);

    const solvedCount = problems.filter(p => p.status === 'Solved').length;
    const totalCount = problems.length || 150; // Fallback to 150 initially

    const progressPercent = Math.min((solvedCount / totalCount) * 100, 100);
    const availableTopics = [...new Set(problems.map(p => p.topic).filter(Boolean))].sort();

    const handleToggleStatus = async (problem) => {
        const newStatus = problem.status === 'Solved' ? 'Pending' : 'Solved';
        try {
            await dsaService.update(problem.id, {
                ...problem,
                status: newStatus,
                solvedDate: newStatus === 'Solved' ? new Date().toISOString().split('T')[0] : null
            });
            fetchProblems();
        } catch(e) { console.error("Failed to update status", e); }
    };

    const handleDelete = async (id) => {
        if(window.confirm('Delete custom problem?')) {
            await dsaService.delete(id);
            fetchProblems();
        }
    };

    const handleSearch = () => {
        const results = problems.filter(p => {
            if (filterTopic && p.topic !== filterTopic) return false;
            if (filterPattern && p.patternType !== filterPattern) return false;
            if (filterDifficulty && p.difficulty !== filterDifficulty) return false;
            return true;
        });
        setSearchResults(results);
        setExpandedPattern(null);
    };

    const clearSearch = () => {
        setFilterTopic('');
        setFilterPattern('');
        setFilterDifficulty('');
        setSearchResults(null);
    };

    const renderTable = (problemList) => (
        <table className="w-full text-left">
            <thead>
                <tr className="text-xs text-zinc-500 uppercase tracking-widest border-b border-zinc-800">
                    <th className="py-4 px-4 w-12 text-center">Status</th>
                    <th className="py-4 px-4">Problem Name</th>
                    <th className="py-4 px-4">Difficulty</th>
                    <th className="py-4 px-4 text-right">Actions</th>
                </tr>
            </thead>
            <tbody>
                {problemList.map(p => (
                    <tr key={p.id} className="border-b border-zinc-800/30 hover:bg-zinc-800/40 transition-colors group">
                        <td className="py-4 px-4 text-center">
                            <button onClick={() => handleToggleStatus(p)} className="text-zinc-600 hover:scale-110 active:scale-95 transition-all">
                                {p.status === 'Solved' ? <CheckCircle size={24} className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" /> : <Circle size={24} />}
                            </button>
                        </td>
                        <td className="py-4 px-4">
                            <a href={p.link} target="_blank" rel="noopener noreferrer" className="font-bold text-zinc-300 hover:text-mana-blue transition-colors text-sm">
                                {p.problemName}
                            </a>
                            <div className="text-xs text-zinc-600 mt-1">{p.patternType} &bull; {p.topic}</div>
                        </td>
                        <td className="py-4 px-4">
                            <span className={`text-[10px] px-2 py-1 uppercase tracking-widest rounded font-black ${
                                p.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                p.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                                'bg-red-500/10 text-red-500 border border-red-500/20'
                            }`}>
                                {p.difficulty}
                            </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                            {!p.predefined && (
                                <button onClick={() => handleDelete(p.id)} className="text-zinc-600 hover:text-red-500 p-2 rounded-lg hover:bg-red-500/10 transition-colors inline-flex">
                                    <Trash2 size={16}/>
                                </button>
                            )}
                        </td>
                    </tr>
                ))}
                {problemList.length === 0 && (
                    <tr><td colSpan="4" className="py-8 text-center text-zinc-500 italic">No problems found for this selection.</td></tr>
                )}
            </tbody>
        </table>
    );

    return (
        <div className="space-y-8 animate-in fade-in pb-16">
            {stats && (
                <XpBar 
                    title="INTELLIGENCE" 
                    currentXp={stats.intelligenceXpRemaining} 
                    maxXp={100} 
                    level={stats.intelligenceLevel} 
                    systemMessage="Algorithms upgrade your analytical core."
                />
            )}

            {/* Header Area */}
            <div className="flex justify-between items-start">
                <h2 className="text-4xl font-black tracking-tight text-white italic">
                    DSA <span className="text-mana-blue">TRACKER</span>
                </h2>
                
                {/* Circular Score */}
                <div className="flex flex-col items-center">
                    <div className="relative w-24 h-24 rounded-full border-4 border-zinc-800 flex items-center justify-center bg-zinc-950 overflow-hidden">
                        <div 
                           className="absolute bottom-0 w-full bg-mana-blue/50 transition-all duration-1000" 
                           style={{ height: `${progressPercent}%` }}
                        />
                        <div className="absolute inset-0 rounded-full border-[6px] border-transparent border-t-mana-blue rotate-45 opacity-50 shadow-[0_0_15px_rgba(0,210,255,0.8)]"></div>
                        <div className="z-10 flex flex-col items-center">
                            <span className="text-xs text-zinc-400 font-bold tracking-widest mt-2">{solvedCount}/{totalCount}</span>
                        </div>
                    </div>
                    <span className="text-xs text-zinc-500 uppercase tracking-widest font-bold mt-2">problems</span>
                </div>
            </div>

            {/* Iterative Search Row */}
            <div className="flex flex-wrap items-center gap-4 bg-zinc-900/60 p-5 rounded-2xl border border-zinc-800/50 shadow-lg relative z-10">
                <select 
                    value={filterTopic} 
                    onChange={e => setFilterTopic(e.target.value)}
                    className="flex-1 min-w-[140px] px-4 py-3 border border-zinc-700 hover:border-mana-blue text-xs uppercase tracking-widest font-bold text-zinc-300 transition-colors rounded-lg bg-zinc-950 outline-none cursor-pointer appearance-none"
                    style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'/%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1em' }}
                >
                    <option value="">ALL TOPICS</option>
                    {availableTopics.map(t => <option key={t} value={t}>{t}</option>)}
                </select>

                <select 
                    value={filterPattern} 
                    onChange={e => setFilterPattern(e.target.value)}
                    className="flex-1 min-w-[140px] px-4 py-3 border border-zinc-700 hover:border-mana-blue text-xs uppercase tracking-widest font-bold text-zinc-300 transition-colors rounded-lg bg-zinc-950 outline-none cursor-pointer appearance-none"
                    style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'/%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1em' }}
                >
                    <option value="">ALL PATTERNS</option>
                    {PATTERNS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>

                <select 
                    value={filterDifficulty} 
                    onChange={e => setFilterDifficulty(e.target.value)}
                    className="flex-1 min-w-[140px] px-4 py-3 border border-zinc-700 hover:border-mana-blue text-xs uppercase tracking-widest font-bold text-zinc-300 transition-colors rounded-lg bg-zinc-950 outline-none cursor-pointer appearance-none"
                    style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'/%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1em' }}
                >
                    <option value="">ALL DIFFICULTIES</option>
                    <option value="Easy">EASY</option>
                    <option value="Medium">MEDIUM</option>
                    <option value="Hard">HARD</option>
                </select>

                <button 
                    onClick={handleSearch}
                    className="px-6 py-3 bg-mana-blue text-black font-black uppercase tracking-widest text-sm rounded-lg hover:bg-white transition-all shadow-[0_0_15px_rgba(0,210,255,0.3)] flex items-center justify-center gap-2"
                >
                    <Search size={18} /> SEARCH
                </button>

                {searchResults !== null && (
                    <button 
                        onClick={clearSearch}
                        className="p-3 bg-zinc-800 text-zinc-400 border border-zinc-700 rounded-lg hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 transition-all flex items-center justify-center"
                        title="Clear Filters"
                    >
                        <X size={18} />
                    </button>
                )}
            </div>

            {/* Main Content Area */}
            <div className="space-y-6">
                
                {searchResults !== null ? (
                    <div className="border border-mana-blue/30 rounded-2xl bg-zinc-900/40 p-6 shadow-[inset_0_0_30px_rgba(0,210,255,0.05)] animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex justify-between items-center border-b border-zinc-800 pb-4 mb-4">
                            <h3 className="text-xl font-black text-mana-blue uppercase tracking-widest flex items-center gap-2">
                                <Search size={20} /> SEARCH RESULTS <span className="text-sm opacity-50 bg-mana-blue/20 text-mana-blue px-2 py-0.5 rounded-full">{searchResults.length} {searchResults.length === 1 ? 'problem' : 'problems'}</span>
                            </h3>
                        </div>
                        {renderTable(searchResults)}
                    </div>
                ) : (
                    <>
                        {/* Grid of Patterns */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {PATTERNS.map((pattern) => {
                                const isExpanded = expandedPattern === pattern;
                                const patternProblems = problems.filter(p => p.patternType === pattern);
                                const pSolved = patternProblems.filter(p => p.status === 'Solved').length;

                                return (
                                    <button 
                                        key={pattern}
                                        onClick={() => setExpandedPattern(isExpanded ? null : pattern)}
                                        className={`flex flex-col items-center justify-center p-4 border rounded-2xl transition-all duration-300 ${
                                            isExpanded 
                                            ? 'border-mana-blue bg-mana-blue/10 shadow-[0_0_20px_rgba(0,210,255,0.3)] text-white scale-105' 
                                            : 'border-zinc-800 text-zinc-400 hover:border-zinc-600 bg-zinc-900/60 hover:bg-zinc-800/80'
                                        }`}
                                    >
                                        <span className="font-black text-center text-sm">{pattern.toLowerCase()}</span>
                                        <span className="text-xs mt-2 opacity-50 font-mono tracking-widest">{pSolved}/{patternProblems.length || 10}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Sliding Accordion Grid Area for active pattern */}
                        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedPattern ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            {expandedPattern && (
                                <div className="border border-mana-blue/30 rounded-2xl bg-zinc-900/40 p-6 mt-4 shadow-[inset_0_0_30px_rgba(0,210,255,0.05)]">
                                    <div className="flex justify-between items-center border-b border-zinc-800 pb-4 mb-4">
                                        <h3 className="text-xl font-black text-mana-blue uppercase tracking-widest">{expandedPattern}</h3>
                                    </div>
                                    {renderTable(problems.filter(p => p.patternType === expandedPattern))}
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* Additional / Custom Add Area */}
                <div className="pt-10 mt-10 border-t border-zinc-800 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold text-zinc-300">Off-Grid Problems</h3>
                        <p className="text-sm text-zinc-500">Add LeetCode grinds that don't fit the layout.</p>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-mana-blue text-black hover:bg-white hover:text-black font-black px-6 py-3 rounded-lg transition-all shadow-[0_0_20px_rgba(0,210,255,0.3)]">
                        <Plus size={20}/> ADD CUSTOM
                    </button>
                </div>
            </div>

            <AddDsaModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onRefresh={fetchProblems} />
        </div>
    );
};

export default DsaTracker;
