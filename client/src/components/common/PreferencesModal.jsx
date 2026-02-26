import { useState, useEffect } from 'react';
import { X, Moon, Sun, Check } from 'lucide-react';

export function PreferencesModal({ isOpen, onClose }) {
    const [theme, setTheme] = useState('dark');

    // Close on escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-800">
                    <h2 className="text-xl font-semibold text-white">Preferences</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">

                    {/* Theme setting */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Appearance</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setTheme('light')}
                                className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border transition-all ${theme === 'light'
                                        ? 'bg-blue-500/10 border-blue-500/50 text-blue-400'
                                        : 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-800'
                                    }`}
                            >
                                <Sun className="w-4 h-4" />
                                <span>Light</span>
                                {theme === 'light' && <Check className="w-4 h-4 ml-2" />}
                            </button>

                            <button
                                onClick={() => setTheme('dark')}
                                className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border transition-all ${theme === 'dark'
                                        ? 'bg-blue-500/10 border-blue-500/50 text-blue-400'
                                        : 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-800'
                                    }`}
                            >
                                <Moon className="w-4 h-4" />
                                <span>Dark</span>
                                {theme === 'dark' && <Check className="w-4 h-4 ml-2" />}
                            </button>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-blue-500/25"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}
