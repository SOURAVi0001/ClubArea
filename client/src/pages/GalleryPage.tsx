import { useGalleryQuery } from '@/queries/useContent';

export function GalleryPage() {
    const { data: clubGalleries = [], isLoading, isError } = useGalleryQuery();

    if (isLoading) return <div className="min-h-screen pt-24 text-center text-slate-300">Loading gallery...</div>;
    if (isError) return <div className="min-h-screen pt-24 text-center text-red-400">Failed to load gallery.</div>;

    return (
        <div className="min-h-screen pt-24 pb-16 px-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">Event Gallery</h1>

                {clubGalleries.length === 0 ? (
                    <div className="text-center mt-12 p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-[0px] mx-auto max-w-md shadow-lg">
                        <p className="text-slate-200 text-lg font-medium drop-shadow-sm">No photos available.</p>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {clubGalleries.map((clubGallery: any) => (
                            <div key={clubGallery.clubId}>
                                <h2 className="text-2xl font-bold text-fuchsia-300 mb-6 border-b border-white/10 pb-3 drop-shadow-md">
                                    {clubGallery.clubName}
                                </h2>
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {clubGallery.events.map((event: any) => (
                                        <div key={event._id} className="group relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 backdrop-blur-[0px] hover:border-white/20 transition-all duration-300 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
                                            {/* Subtle inner highlight for liquid effect */}
                                            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
                                            {event.photos && event.photos[0] ? (
                                                <img
                                                    src={event.photos[0]}
                                                    alt={event.title || 'Event'}
                                                    className="w-full h-64 object-cover transform group-hover:scale-110 transition duration-700"
                                                    onError={(e: any) => {
                                                        e.currentTarget.onerror = null;
                                                        e.currentTarget.src = `https://placehold.co/600x400/1e293b/a855f7?text=${encodeURIComponent(event.title || 'Event')}`;
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-64 bg-slate-800 flex items-center justify-center text-slate-500 font-medium">
                                                    No Image
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                                                <h3 className="text-white font-bold text-xl drop-shadow-md mb-1">{event.title}</h3>
                                                <p className="text-slate-200 text-sm font-medium drop-shadow-sm">{new Date(event.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
