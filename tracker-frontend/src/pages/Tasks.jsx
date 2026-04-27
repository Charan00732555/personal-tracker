import React, { useState, useEffect } from 'react';
import { getTasks, createTask, completeTask, deleteTask } from '../api/taskService';
import { Plus, CheckCircle2, Circle, Trash2, Loader2, Sparkles } from 'lucide-react';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const data = await getTasks();
            setTasks(data);
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        setIsSubmitting(true);
        try {
            const task = await createTask({ title: newTaskTitle, description: '' });
            setTasks([task, ...tasks]);
            setNewTaskTitle('');
        } catch (error) {
            console.error("Failed to create task:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleToggleComplete = async (taskId, currentlyCompleted) => {
        if (currentlyCompleted) return; // For now, only allow completing, not undoing (to prevent XP exploitation)

        try {
            const updatedTask = await completeTask(taskId);
            setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));
        } catch (error) {
            console.error("Failed to complete task:", error);
        }
    };

    const handleDelete = async (taskId) => {
        try {
            await deleteTask(taskId);
            setTasks(tasks.filter(t => t.id !== taskId));
        } catch (error) {
            console.error("Failed to delete task:", error);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header section */}
            <section>
                <h2 className="text-3xl font-black tracking-tight text-white italic">
                    DAILY <span className="text-mana-blue">TASKS</span>
                </h2>
                <p className="text-zinc-400 mt-2">Clear your objective list to gain <span className="text-mana-blue font-bold">AGILITY</span> XP.</p>
            </section>

            {/* Add Task Input */}
            <form onSubmit={handleAddTask} className="relative group">
                <div className="absolute inset-0 bg-mana-blue/5 blur-xl rounded-2xl group-focus-within:bg-mana-blue/10 transition-all duration-500" />
                <div className="relative flex items-center gap-3 bg-zinc-900/80 border border-zinc-800 focus-within:border-mana-blue/50 rounded-2xl p-2 pl-6 transition-all backdrop-blur-md">
                    <input
                        type="text"
                        placeholder="Add a new objective..."
                        className="flex-1 bg-transparent border-none outline-none text-white placeholder-zinc-500 py-3"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                    />
                    <button
                        type="submit"
                        disabled={isSubmitting || !newTaskTitle.trim()}
                        className="bg-mana-blue text-black p-3 rounded-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:grayscale transition-all duration-200"
                    >
                        {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : <Plus size={24} />}
                    </button>
                </div>
            </form>

            {/* Task List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="animate-spin text-mana-blue w-10 h-10" />
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-zinc-800 border-dashed">
                        <p className="text-zinc-500">No active objectives. Rest while you can, Hunter.</p>
                    </div>
                ) : (
                    tasks.map((task) => (
                        <div
                            key={task.id}
                            className={`group relative flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 ${
                                task.completed
                                    ? 'bg-zinc-950/50 border-zinc-900 grayscale opacity-60'
                                    : 'bg-zinc-900/50 border-zinc-800 hover:border-mana-blue/30 hover:bg-zinc-900/80'
                            }`}
                        >
                            <div className="flex items-center gap-4 flex-1">
                                <button
                                    onClick={() => handleToggleComplete(task.id, task.completed)}
                                    className={`transition-all duration-300 ${
                                        task.completed ? 'text-mana-blue' : 'text-zinc-600 hover:text-mana-blue'
                                    }`}
                                >
                                    {task.completed ? (
                                        <CheckCircle2 size={24} />
                                    ) : (
                                        <Circle size={24} className="group-hover:scale-110" />
                                    )}
                                </button>
                                <span className={`text-lg transition-all duration-300 ${
                                    task.completed ? 'line-through text-zinc-600' : 'text-zinc-200'
                                }`}>
                                    {task.title}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                {task.completed && (
                                    <span className="flex items-center gap-1 text-[10px] font-black text-mana-blue uppercase tracking-tighter mr-4 bg-mana-blue/10 px-2 py-1 rounded">
                                        <Sparkles size={10} /> +10 AGI
                                    </span>
                                )}
                                <button
                                    onClick={() => handleDelete(task.id)}
                                    className="p-2 text-zinc-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>

                            {/* Completing animation overlay */}
                            {task.completed && (
                                <div className="absolute inset-0 bg-mana-blue/5 rounded-2xl pointer-events-none" />
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Tasks;
