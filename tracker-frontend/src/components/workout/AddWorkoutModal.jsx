import React, { useState } from 'react';
import { X, Plus, Trash2, Save } from 'lucide-react';
import { workoutService } from '../../api/workoutService';

const AddWorkoutModal = ({ isOpen, onClose, onRefresh }) => {
  const [workoutName, setWorkoutName] = useState('');
  const [workoutType, setWorkoutType] = useState('Push');
  const [sets, setSets] = useState([{ reps: '', weight: '' }]);

  const addSet = () => setSets([...sets, { reps: '', weight: '' }]);
  
  const removeSet = (index) => {
    const newSets = sets.filter((_, i) => i !== index);
    setSets(newSets);
  };

  const handleSetChange = (index, field, value) => {
    const newSets = [...sets];
    newSets[index][field] = value;
    setSets(newSets);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      workoutName,
      type: workoutType,
      totalSets: sets.length,
      repsPerSet: sets.map(s => parseInt(s.reps) || 0),
      weightsPerSet: sets.map(s => parseFloat(s.weight) || 0),
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    };

    try {
      await workoutService.create(payload);
      onRefresh(); // Refresh the list in Workouts.jsx
      onClose();
    } catch (err) {
      console.error("Failed to sync with the System:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-mana-blue/50 w-full max-w-md p-6 rounded-2xl shadow-[0_0_50px_rgba(0,210,255,0.2)]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black italic text-white tracking-widest">NEW <span className="text-mana-blue">LOG</span></h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Workout Name</label>
              <input 
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-mana-blue outline-none transition-all"
                placeholder="e.g. Bench Press"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Type</label>
              <select
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-mana-blue outline-none transition-all appearance-none"
                value={workoutType}
                onChange={(e) => setWorkoutType(e.target.value)}
              >
                <option value="Push">Push</option>
                <option value="Pull">Pull</option>
                <option value="Legs">Legs</option>
                <option value="Cardio">Cardio</option>
                <option value="Core">Core</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-zinc-500 uppercase">Sets & Reps</label>
            {sets.map((set, index) => (
              <div key={index} className="flex gap-3 items-center animate-in fade-in slide-in-from-left-2">
                <span className="text-mana-blue font-mono text-sm w-6">#{index + 1}</span>
                <input 
                  type="number" placeholder="Weight" 
                  className="flex-1 min-w-0 bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-white outline-none"
                  value={set.weight}
                  onChange={(e) => handleSetChange(index, 'weight', e.target.value)}
                />
                <input 
                  type="number" placeholder="Reps" 
                  className="flex-1 min-w-0 bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-white outline-none"
                  value={set.reps}
                  onChange={(e) => handleSetChange(index, 'reps', e.target.value)}
                />
                <button type="button" onClick={() => removeSet(index)} className="text-zinc-600 hover:text-red-500 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          <button 
            type="button" 
            onClick={addSet}
            className="w-full py-2 border border-dashed border-zinc-700 rounded-lg text-zinc-500 hover:text-mana-blue hover:border-mana-blue/50 transition-all flex items-center justify-center gap-2 text-sm"
          >
            <Plus size={16} /> Add Another Set
          </button>

          <button 
            type="submit"
            className="w-full bg-mana-blue text-black font-black py-4 rounded-xl shadow-[0_0_20px_rgba(0,210,255,0.4)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Save size={20} /> SYNC WITH SYSTEM
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddWorkoutModal;
