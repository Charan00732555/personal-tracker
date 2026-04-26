import React from 'react';
import { Swords, BrainCircuit, BookOpen, CheckCircle2, XCircle, Clock } from 'lucide-react';

const DailyQuests = ({ quests }) => {
    const typeConfigs = {
        WORKOUT: { icon: Swords, color: 'text-red-400', bg: 'bg-red-950/30', border: 'border-red-900/40' },
        DSA:     { icon: BrainCircuit, color: 'text-mana-blue', bg: 'bg-mana-blue/10', border: 'border-mana-blue/30' },
        JOURNAL: { icon: BookOpen, color: 'text-emerald-400', bg: 'bg-emerald-950/20', border: 'border-emerald-900/40' },
    };

    const statusIcon = {
        COMPLETED: <CheckCircle2 size={18} className="text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.8)]" />,
        FAILED:    <XCircle size={18} className="text-red-500/70" />,
        ACTIVE:    <Clock size={18} className="text-zinc-500 animate-pulse" />,
    };

    // Calculate time until midnight
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const hoursLeft = Math.floor((midnight - now) / 1000 / 3600);
    const minsLeft = Math.floor(((midnight - now) / 1000 % 3600) / 60);

    return (
        <div className="relative p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-xl">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black italic tracking-wider text-white">
                    DAILY <span className="text-mana-blue">QUESTS</span>
                </h3>
                <span className="px-3 py-1 rounded-full bg-zinc-800 text-xs font-mono text-zinc-500">
                    RESETS IN {hoursLeft}H {minsLeft}M
                </span>
            </div>

            <div className="space-y-4">
                {quests.length === 0 && (
                    <div className="text-center text-zinc-500 py-8 italic">
                        No quests assigned for today. Check back tomorrow, Hunter.
                    </div>
                )}
                {quests.map((quest) => {
                    const config = typeConfigs[quest.type] || typeConfigs.DSA;
                    const Icon = config.icon;
                    const isCompleted = quest.status === 'COMPLETED';
                    const isFailed = quest.status === 'FAILED';

                    return (
                        <div
                            key={quest.id}
                            className={`flex items-center gap-4 p-4 rounded-xl border ${config.bg} ${config.border} transition-all duration-300 ${
                                isCompleted ? 'opacity-60' : isFailed ? 'opacity-30' : 'hover:scale-[1.01]'
                            }`}
                        >
                            <div className={`${config.color} flex-shrink-0`}>
                                <Icon size={24} />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className={`font-bold text-sm text-white ${isCompleted || isFailed ? 'line-through text-zinc-500' : ''}`}>
                                    {quest.title}
                                </div>
                                <div className="text-xs text-zinc-400 mt-0.5 truncate">{quest.description}</div>
                            </div>

                            <div className="flex items-center gap-3 flex-shrink-0">
                                <div className="font-mono text-sm text-mana-blue font-bold">
                                    +{quest.xpReward} XP
                                </div>
                                {statusIcon[quest.status]}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DailyQuests;