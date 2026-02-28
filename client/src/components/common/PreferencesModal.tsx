import { useRef } from 'react';
import { X, Check, Image as ImageIcon, Sliders, Upload } from 'lucide-react';
import { useBackgroundStore } from '@/stores/useBackgroundStore';
import { backgroundOptions } from '@/utils/backgroundAssets';
import GlassButton from '@/components/common/GlassButton';

interface PreferencesModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function PreferencesModal({ isOpen, onClose }: PreferencesModalProps) {
    const { bgImage, glassOpacity, glassBlur, textContrast, setBgImage, setGlassOpacity, setGlassBlur, setTextContrast } = useBackgroundStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result;
                if (typeof result === 'string') {
                    setBgImage(result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    // Removed window Esc listener; clicking outside closes it when rendered by Navbar

    if (!isOpen) return null;

    return (
        <div className="absolute right-0 top-full mt-4 z-[100] p-4 w-[450px] sm:w-[500px] origin-top-right transition-all duration-300 transform scale-100 opacity-100 shadow-[0_16px_40px_-15px_rgba(0,0,0,0.8)] rounded-3xl">

            {/* Solid Navy Dropdown Pane */}
            <div className="relative w-full bg-slate-900 border border-white/20 rounded-3xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 ease-out">
                
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-white/10 bg-white/5">
                    <h2 className="text-lg font-bold text-white tracking-wide">Appearance & Theme</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">

                    {/* Background Images */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2 text-slate-300">
                            <ImageIcon className="w-5 h-5 text-fuchsia-400" />
                            <h3 className="font-medium">Background Wallpaper</h3>
                        </div>
                        
                        <div className="flex overflow-x-auto space-x-4 pb-4 custom-scrollbar snap-x">
                            {backgroundOptions.map((bg) => (
                                <button
                                    key={bg.id}
                                    onClick={() => setBgImage(bg.url)}
                                    className={`flex-none w-48 snap-center relative aspect-video rounded-xl overflow-hidden border-2 transition-all ${
                                        bgImage === bg.url ? 'border-fuchsia-400 shadow-[0_0_15px_rgba(217,70,239,0.5)]' : 'border-transparent hover:border-slate-500'
                                    }`}
                                >
                                    {bg.thumb ? (
                                        <img src={bg.thumb} alt={bg.label} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                                    ) : (
                                        <div className="absolute inset-0 bg-slate-950" />
                                    )}
                                    <div className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity ${bgImage === bg.url ? 'opacity-0' : 'opacity-0 hover:opacity-100'}`}>
                                        <span className="text-xs font-semibold text-white drop-shadow-md">{bg.label}</span>
                                    </div>
                                    {bgImage === bg.url && (
                                        <div className="absolute bottom-2 right-2">
                                            <Check className="w-4 h-4 text-fuchsia-400 shrink-0" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <h3 className="text-sm font-semibold text-slate-400 mb-2 mt-4 uppercase tracking-wider">Custom Background</h3>
                    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 text-center">
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                        />
                        <div className="flex justify-center pb-2">
                            <GlassButton onClick={() => fileInputRef.current?.click()}>
                                <div className="flex items-center space-x-2">
                                    <Upload className="w-5 h-5 text-white" />
                                    <span className="text-white">Upload Image</span>
                                </div>
                            </GlassButton>
                        </div>
                        <p className="mt-3 text-xs text-slate-400">High resolution image recommended. Will be saved to your browser.</p>
                    </div>

                    {/* Glassmorphism settings */}
                    <div className="space-y-5 pt-4 border-t border-slate-800/50">
                        <div className="flex items-center space-x-2 text-slate-300">
                            <Sliders className="w-5 h-5 text-blue-400" />
                            <h3 className="font-medium">Glassmorphism Intensity</h3>
                        </div>

                        <div className="space-y-4 px-1">
                            {/* Opacity Slider */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-slate-400">
                                    <span>Darkness (Opacity)</span>
                                    <span>{Math.round(glassOpacity * 100)}%</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="0" max="1" step="0.05"
                                    value={glassOpacity}
                                    onChange={(e) => setGlassOpacity(parseFloat(e.target.value))}
                                    className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            {/* Blur Slider */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-slate-400">
                                    <span>Frosted Blur</span>
                                    <span>{glassBlur}px</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="0" max="40" step="2"
                                    value={glassBlur}
                                    onChange={(e) => setGlassBlur(parseInt(e.target.value))}
                                    className="w-full accent-fuchsia-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                            
                            {/* Text Contrast Slider */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-slate-400">
                                    <span>Text Content Darkness</span>
                                    <span>{textContrast}%</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="0" max="100" step="1"
                                    value={textContrast}
                                    onChange={(e) => setTextContrast(parseInt(e.target.value))}
                                    className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/10 bg-white/5 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl transition-all shadow-sm font-medium"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}
