import { create } from 'zustand';

export const useBackgroundStore = create((set) => ({
    bgImage: localStorage.getItem('bgImage') || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop', // default cool abstract
    glassOpacity: parseFloat(localStorage.getItem('glassOpacity')) || 0.65,
    glassBlur: parseInt(localStorage.getItem('glassBlur')) || 12,
    textContrast: parseInt(localStorage.getItem('textContrast')) || 0,

    setBgImage: (url) => {
        localStorage.setItem('bgImage', url);
        set({ bgImage: url });
    },
    setGlassOpacity: (val) => {
        localStorage.setItem('glassOpacity', val.toString());
        set({ glassOpacity: val });
    },
    setGlassBlur: (val) => {
        localStorage.setItem('glassBlur', val.toString());
        set({ glassBlur: val });
    },
    setTextContrast: (val) => {
        localStorage.setItem('textContrast', val.toString());
        set({ textContrast: val });
    }
}));
