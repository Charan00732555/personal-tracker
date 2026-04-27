import React from 'react';

const XpBar = ({ title, currentXp, maxXp = 100, level, systemMessage }) => {
    const percentage = Math.min(100, (currentXp / maxXp) * 100);

    return (
        <div className="relative p-6 rounded-2xl bg-zinc-900/50 border border-mana-blue/20 backdrop-blur-xl shadow-[0_0_15px_rgba(0,210,255,0.1)] overflow-hidden">
            {/* Absolute Decorative Glow */}
            <div className="absolute top-0 right-1/4 w-32 h-32 bg-mana-blue/10 rounded-full blur-3xl opacity-60" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6">
                {/* Level Indicator */}
                <div className="flex flex-col items-center w-full md:w-auto">
                    <div className="text-sm font-bold text-mana-blue">{title || 'LEVEL'}</div>
                    <div className="text-5xl font-extrabold text-white leading-none tracking-tighter">
                        {level}
                    </div>
                </div>

                {/* Progress Bar Area */}
                <div className="flex-1 w-full space-y-2">
                    <div className="h-4 w-full bg-zinc-800 rounded-full overflow-hidden border border-zinc-700 p-[2px]">
                        <div
                            className="h-full bg-gradient-to-r from-mana-blue to-system-purple rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(0,210,255,0.7)]"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>

                    <div className="flex justify-between text-xs font-mono">
                        <span className="text-zinc-400">
                            {currentXp.toLocaleString()} XP
                        </span>
                        <span className="text-mana-blue/60">
                            {maxXp - currentXp} XP to Level {level + 1}
                        </span>
                    </div>
                </div>

                {/* System Message */}
                <div className="hidden md:block w-48 text-right italic text-sm text-zinc-500 font-medium">
                    {systemMessage || <>"The System is analyzing your <span className="text-mana-blue">growth potential</span>."</>}
                </div>
            </div>
        </div>
    );
};

export default XpBar;