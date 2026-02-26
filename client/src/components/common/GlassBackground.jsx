// Background effect component for main layouts
export function GlassBackground() {
    return (
        <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-slate-900">
            {/* Dynamic gradient background elements matching the app aesthetic */}
            <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-blue-900/20 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-10000"></div>
            <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-indigo-900/20 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-7000"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 bg-purple-900/10 rounded-full blur-[100px] mix-blend-screen"></div>

            {/* Subtle grid pattern overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0wIDEwaDQwTTAgMjBoNDBOMCAzMGg0ME0wIDQwaDQwTTEwIDB2NDBNMjAgMHY0ME0zMCAwdjQwTTQwIDB2NDAiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjAzKSIgZmlsbD0ibm9uZSIvPgo8L3N2Zz4=')] opacity-20"></div>
        </div>
    );
}
