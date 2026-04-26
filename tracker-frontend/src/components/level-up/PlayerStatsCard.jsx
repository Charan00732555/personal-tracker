import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { getHunterClass } from '../../api/statsService';

const PlayerStatsCard = ({ stats }) => {
    // True Triangle representation of core RPG stats
    const data = [
        { subject: 'Strength', A: stats?.strengthLevel || 1, fullMark: 100 },
        { subject: 'Wisdom', A: stats?.wisdomLevel || 1, fullMark: 100 },
        { subject: 'Intelligence', A: stats?.intelligenceLevel || 1, fullMark: 100 },
    ];

    const overallLevel = stats ? Math.floor((stats.strengthLevel + stats.intelligenceLevel + stats.wisdomLevel) / 3) : 1;
    const hunterClass = getHunterClass(overallLevel);

    return (
        <div className="relative p-6 rounded-2xl bg-zinc-900/50 border border-mana-blue/30 backdrop-blur-xl shadow-[0_0_20px_rgba(0,210,255,0.15)] overflow-hidden">
            {/* Decorative Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-mana-blue/10 rounded-full blur-3xl" />

            <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black italic tracking-wider text-white">
                        PLAYER <span className="text-mana-blue">STATS</span>
                    </h3>
                    <span className="px-3 py-1 rounded-full bg-mana-blue/10 border border-mana-blue/50 text-xs font-bold text-mana-blue shadow-[0_0_10px_rgba(0,210,255,0.3)]">
                        RANK: {hunterClass}
                    </span>
                </div>

                <div className="h-64 w-full">
                    <ResponsiveContainer width="99%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                            <PolarGrid stroke="#27272a" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <Radar
                                name="Stats"
                                dataKey="A"
                                stroke="#00d2ff"
                                fill="#00d2ff"
                                fillOpacity={0.4}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default PlayerStatsCard;