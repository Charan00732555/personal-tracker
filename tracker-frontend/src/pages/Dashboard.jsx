import React, { useEffect, useState } from 'react';
import PlayerStatsCard from '../components/level-up/PlayerStatsCard';
import XpBar from '../components/level-up/XpBar';
import DailyQuests from '../components/level-up/DailyQuests';
import { getPlayerStats, calculateRetroactiveXp } from '../api/statsService';
import { getTodayQuests } from '../api/questService';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [quests, setQuests] = useState([]);
    const [isCalculating, setIsCalculating] = useState(false);

    useEffect(() => {
        getPlayerStats().then(setStats).catch(console.error);
        getTodayQuests().then(setQuests).catch(console.error);
    }, []);

    const handleRetroactive = async () => {
        setIsCalculating(true);
        try {
            await calculateRetroactiveXp();
            const newStats = await getPlayerStats();
            setStats(newStats);
        } catch (error) {
            console.error(error);
        }
        setIsCalculating(false);
    };

    return (
        <div className="space-y-8">
            {/* Retroactive XP Admin Dev Button */}
            {!stats && (
                <div className="text-zinc-500 py-10 text-center animate-pulse">Loading Player Profile...</div>
            )}
            
            {stats && (
                <>
                {/* 1. Global System Header (XP Bar) */}
                <section>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-zinc-400 text-sm">Overall Level is an average of your core stats.</span>
                        <button onClick={handleRetroactive} disabled={isCalculating} className="text-xs bg-zinc-800 hover:bg-zinc-700 px-3 py-1 text-zinc-400 rounded transition-colors">
                            {isCalculating ? 'Computing...' : 'Recalculate Past XP'}
                        </button>
                    </div>
                    {/* Just an example of an overall main level combining all XP */}
                    <XpBar 
                        title="PLAYER RANK" 
                        currentXp={(stats.strengthXpRemaining + stats.intelligenceXpRemaining + stats.wisdomXpRemaining) % 100} 
                        maxXp={100} 
                        level={Math.floor((stats.strengthLevel + stats.intelligenceLevel + stats.wisdomLevel) / 3)} 
                    />
                </section>

            {/* 2. Page Title */}
            <section>
                <h2 className="text-3xl font-black tracking-tight text-white italic">
                    HUNTER <span className="text-mana-blue">DASHBOARD</span>
                </h2>
                <p className="text-zinc-400 mt-2">The System is calibrating your growth potential...</p>
            </section>

            {/* 3. Grid Layout for Modules */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Stats Card (Intelligence vs Strength) */}
                <div className="lg:col-span-1">
                    <PlayerStatsCard stats={stats} />
                </div>

                {/* Daily Quests Board */}
                <div className="lg:col-span-2">
                    <DailyQuests quests={quests} />
                </div>
            </div>
            </>
            )}
        </div>
    );
};

export default Dashboard;