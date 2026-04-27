import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';

const SystemTutorialModal = ({ isOpen, onClose }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        {
            title: "SYSTEM MECHANICS",
            description: "Gain XP by completing daily objectives: Workouts (Strength), DSA (Intelligence), and Journaling (Wisdom).",
            image: "/system_mechanics.png"
        },
        {
            title: "HUNTER RANKING",
            description: "As your levels increase, your Rank will rise from E to S. Reach the top to become the ultimate Hunter.",
            image: "/rank_progression.png"
        }
    ];

    if (!isOpen) return null;

    const isLastStep = currentStep === steps.length - 1;

    const handleNext = () => {
        if (isLastStep) {
            onClose();
        } else {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => Math.max(0, prev - 1));
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                    <h3 className="text-xl font-black italic tracking-wider text-white">
                        SYSTEM <span className="text-mana-blue">GUIDE</span>
                    </h3>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="aspect-video w-full rounded-2xl overflow-hidden border border-zinc-800 shadow-inner bg-zinc-950">
                        <img 
                            src={steps[currentStep].image} 
                            alt={steps[currentStep].title} 
                            className="w-full h-full object-contain"
                        />
                    </div>
                    
                    <div className="text-center space-y-2 px-4">
                        <h4 className="text-2xl font-black text-white italic tracking-tight uppercase">
                            {steps[currentStep].title}
                        </h4>
                        <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
                            {steps[currentStep].description}
                        </p>
                    </div>
                </div>

                {/* Footer / Navigation */}
                <div className="p-6 border-t border-zinc-800 bg-zinc-950/50 flex items-center justify-between">
                    <div className="flex gap-2">
                        {steps.map((_, idx) => (
                            <div 
                                key={idx} 
                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                    idx === currentStep ? 'w-8 bg-mana-blue' : 'w-2 bg-zinc-800'
                                }`} 
                            />
                        ))}
                    </div>

                    <div className="flex gap-3">
                        {currentStep > 0 && (
                            <button 
                                onClick={handleBack}
                                className="px-4 py-2 text-zinc-400 hover:text-white flex items-center gap-1 font-bold text-sm"
                            >
                                <ChevronLeft size={18} /> BACK
                            </button>
                        )}
                        <button 
                            onClick={handleNext}
                            className="bg-mana-blue text-black px-6 py-2.5 rounded-xl font-black text-sm uppercase tracking-widest flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(0,210,255,0.4)]"
                        >
                            {isLastStep ? (
                                <>COMPLETE <CheckCircle size={18} /></>
                            ) : (
                                <>NEXT <ChevronRight size={18} /></>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemTutorialModal;
