import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { dsaService } from '../../api/dsaService';

const PATTERNS = [
  "Backtracking", "Binary Tree Traversal", "Breadth-First Search (BFS)", "Depth-First Search (DFS)",
  "Dynamic Programming", "Fast & Slow Pointers", "LinkedList In-place Reversal", "Matrix Traversal",
  "Modified Binary Search", "Monotonic Stack", "Overlapping Intervals", "Prefix Sum",
  "Sliding Window", "Top K Elements", "Two Pointers", "Other"
];

const AddDsaModal = ({ isOpen, onClose, onRefresh }) => {
  const [problemName, setProblemName] = useState('');
  const [topic, setTopic] = useState('Array');
  const [patternType, setPatternType] = useState('Other');
  const [difficulty, setDifficulty] = useState('Medium');
  const [link, setLink] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      problemName,
      topic,
      patternType,
      difficulty,
      link,
      status: 'Pending',
      isPredefined: false
    };

    try {
      await dsaService.create(payload);
      onRefresh(); // Refresh the list in DsaTracker
      onClose();
      // Reset form
      setProblemName('');
      setTopic('Array');
      setPatternType('Other');
      setDifficulty('Medium');
      setLink('');
    } catch (err) {
      console.error("Failed to sync with the System:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-mana-blue/50 w-full max-w-md p-6 rounded-2xl shadow-[0_0_50px_rgba(0,210,255,0.2)]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black italic text-white tracking-widest">CUSTOM <span className="text-mana-blue">PROBLEM</span></h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Problem Name</label>
            <input 
              required
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-mana-blue outline-none transition-all"
              placeholder="e.g. Two Sum"
              value={problemName}
              onChange={(e) => setProblemName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">LeetCode URL</label>
            <input 
              type="url"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-mana-blue outline-none transition-all"
              placeholder="https://leetcode.com/problems/..."
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Difficulty</label>
              <select
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-mana-blue outline-none transition-all appearance-none"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Topic</label>
              <input 
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-mana-blue outline-none transition-all"
                placeholder="e.g. Array, Graph"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Pattern Category</label>
            <select
              required
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-mana-blue outline-none transition-all appearance-none"
              value={patternType}
              onChange={(e) => setPatternType(e.target.value)}
            >
              {PATTERNS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <button 
            type="submit"
            className="w-full bg-mana-blue text-black font-black py-4 mt-6 rounded-xl shadow-[0_0_20px_rgba(0,210,255,0.4)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Save size={20} /> INJECT INTO MATRIX
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDsaModal;
