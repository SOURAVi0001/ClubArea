import { useBackgroundStore } from '@/stores/useBackgroundStore';

import React from 'react';

export function GlassyOverlay({ children }: { children: React.ReactNode }) {
    const { bgImage, glassOpacity, glassBlur, textContrast } = useBackgroundStore();

    return (
        <div className="min-h-screen relative w-full overflow-hidden bg-slate-950 transition-all duration-700">
            {textContrast > 0 && (
                <style>{`
                    .text-white { color: color-mix(in srgb, rgb(255, 255, 255), black ${textContrast}%) !important; }
                    .text-slate-100 { color: color-mix(in srgb, #f1f5f9, black ${textContrast}%) !important; }
                    .text-slate-200 { color: color-mix(in srgb, #e2e8f0, black ${textContrast}%) !important; }
                    .text-slate-300 { color: color-mix(in srgb, #cbd5e1, black ${textContrast}%) !important; }
                    .text-slate-400 { color: color-mix(in srgb, #94a3b8, black ${textContrast}%) !important; }
                    
                    .border-white\\/10 { border-color: color-mix(in srgb, rgba(255,255,255,0.1), black ${textContrast}%) !important; }
                    .border-white\\/20 { border-color: color-mix(in srgb, rgba(255,255,255,0.2), black ${textContrast}%) !important; }
                    .border-slate-700 { border-color: color-mix(in srgb, #334155, black ${textContrast}%) !important; }
                    .border-slate-800 { border-color: color-mix(in srgb, #1e293b, black ${textContrast}%) !important; }
                    .border-slate-800\\/50 { border-color: color-mix(in srgb, rgba(30,41,59,0.5), black ${textContrast}%) !important; }
                    
                    .text-white, .text-slate-100, .text-slate-200, .text-slate-300 {
                        text-shadow: 0px 1px ${textContrast * 0.05}px rgba(0,0,0,${textContrast / 100}) !important;
                    }
                `}</style>
            )}

            {/* Background Image Layer */}
            {bgImage && (
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-700 pointer-events-none"
                    style={{ backgroundImage: `url("${bgImage}")` }}
                />
            )}

            {/* Global Glassmorphism Overlay Layer */}
            <div
                className="absolute inset-0 z-0 pointer-events-none transition-all duration-700"
                style={{
                    backgroundColor: `rgba(15, 23, 42, ${glassOpacity})`,
                    backdropFilter: `blur(${glassBlur}px)`,
                    WebkitBackdropFilter: `blur(${glassBlur}px)`
                }}
            />

            {/* Main Content */}
            <div className="relative z-10 min-h-screen w-full">
                {children}
            </div>
        </div>
    );
}
