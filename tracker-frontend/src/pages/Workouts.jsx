import React, { useEffect, useState } from 'react';
import { workoutService } from '../api/workoutService';
import { Plus, Dumbbell, Trash2 } from 'lucide-react';
import AddWorkoutModal from '../components/workout/AddWorkoutModal';
import XpBar from '../components/level-up/XpBar';
import { getPlayerStats } from '../api/statsService';

const Workouts = () => {
    const [workouts, setWorkouts] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchWorkoutsAndStats = async () => {
        try {
            const data = await workoutService.getAll();
            setWorkouts(data);
            const statsData = await getPlayerStats();
            setStats(statsData);
        } catch (error) {
            console.error("Failed to fetch training data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this session?')) {
            try {
                await workoutService.delete(id);
                fetchWorkoutsAndStats();
            } catch (error) {
                console.error("Failed to delete workout:", error);
            }
        }
    };

    useEffect(() => {
        fetchWorkoutsAndStats();
    }, []);

    return (
        <div className="space-y-6">
            {stats && (
                <XpBar 
                    title="STRENGTH" 
                    currentXp={stats.strengthXpRemaining} 
                    maxXp={100} 
                    level={stats.strengthLevel} 
                    systemMessage="Every rep hardens your physical vessel."
                />
            )}

            {/* Page Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black italic tracking-tight text-white">
                        TRAINING <span className="text-mana-blue">ZONE</span>
                    </h2>
                    <p className="text-zinc-400 mt-1">Record your sets to increase your Strength stat.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-mana-blue hover:bg-mana-blue/80 text-black font-bold py-2 px-4 rounded-lg transition-all shadow-[0_0_15px_rgba(0,210,255,0.4)]"
                >
                    <Plus size={20} />
                    LOG SESSION
                </button>
            </div>

            {/* Training Log Table */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden backdrop-blur-md">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-zinc-800 text-zinc-500 text-sm uppercase tracking-widest font-bold">
                            <th className="px-6 py-4">Exercise</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4 text-center">Sets</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                        {workouts.map((w) => (
                            <tr key={w.id} className="hover:bg-zinc-800/30 transition-colors group">
                                <td className="px-6 py-4 flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-zinc-800 text-mana-blue group-hover:shadow-[0_0_10px_rgba(0,210,255,0.3)] transition-all">
                                        <Dumbbell size={18} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-zinc-200">{w.workoutName}</span>
                                        <span className="text-xs text-zinc-500">{w.type}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-zinc-400 text-sm">{w.date}</td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-2 justify-center max-w-[250px] mx-auto">
                                        {w.totalSets > 0 ? (
                                            Array.from({ length: w.totalSets }).map((_, i) => (
                                                <span key={i} className="bg-zinc-800 text-zinc-300 text-xs px-2 py-1 rounded-md border border-zinc-700 whitespace-nowrap shadow-sm shadow-black/50">
                                                    <span className="text-mana-blue mr-1">S{i + 1}</span>
                                                    {w.weightsPerSet?.[i] || 0}kg × {w.repsPerSet?.[i] || 0}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-zinc-500 font-mono font-bold">0 Sets</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 flex items-center justify-end gap-3 text-right">
                                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-tighter">Completed</span>
                                    <button 
                                        onClick={() => handleDelete(w.id)}
                                        className="text-zinc-600 hover:text-red-500 transition-colors p-2 rounded-md hover:bg-zinc-800/50"
                                        title="Delete Session"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {workouts.length === 0 && !loading && (
                    <div className="p-12 text-center text-zinc-500 italic">
                        No training data found. Start your first quest to level up.
                    </div>
                )}
            </div>

            <AddWorkoutModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onRefresh={fetchWorkoutsAndStats} 
            />
        </div>
    );
};

export default Workouts;