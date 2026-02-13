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
                    <p className="text-slate-400">No photos available.</p>
                ) : (
                    <div className="space-y-12">
                        {clubGalleries.map((clubGallery) => (
                            <div key={clubGallery.clubId}>
                                <h2 className="text-2xl font-bold text-fuchsia-400 mb-6 border-b border-slate-700 pb-2">
                                    {clubGallery.clubName}
                                </h2>
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {clubGallery.events.map((event) => (
                                        <div key={event._id} className="group relative overflow-hidden rounded-xl bg-slate-800">
                                            {event.photos && event.photos[0] && (
                                                <img
                                                    src={event.photos[0]}
                                                    alt={event.eventName}
                                                    className="w-full h-64 object-cover transform group-hover:scale-105 transition duration-500"
                                                />
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                                <h3 className="text-white font-bold text-lg">{event.eventName}</h3>
                                                <p className="text-slate-300 text-sm">{new Date(event.date).toLocaleDateString()}</p>
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
