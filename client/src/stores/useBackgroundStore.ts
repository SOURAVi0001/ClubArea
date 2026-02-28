import { create } from 'zustand';

interface BackgroundState {
    bgImage: string;
    glassOpacity: number;
    glassBlur: number;
    textContrast: number;
    setBgImage: (url: string) => void;
    setGlassOpacity: (val: number) => void;
    setGlassBlur: (val: number) => void;
    setTextContrast: (val: number) => void;
}

export const useBackgroundStore = create<BackgroundState>((set) => ({
    bgImage: localStorage.getItem('bgImage') || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop', // default cool abstract
    glassOpacity: parseFloat(localStorage.getItem('glassOpacity') || '0.65'),
    glassBlur: parseInt(localStorage.getItem('glassBlur') || '12'),
    textContrast: parseInt(localStorage.getItem('textContrast') || '0'),

    setBgImage: (url: string) => {
        localStorage.setItem('bgImage', url);
        set({ bgImage: url });
    },
    setGlassOpacity: (val: number) => {
        localStorage.setItem('glassOpacity', val.toString());
        set({ glassOpacity: val });
    },
    setGlassBlur: (val: number) => {
        localStorage.setItem('glassBlur', val.toString());
        set({ glassBlur: val });
    },
    setTextContrast: (val: number) => {
        localStorage.setItem('textContrast', val.toString());
        set({ textContrast: val });
    }
}));
