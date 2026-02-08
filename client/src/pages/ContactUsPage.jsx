export function ContactUsPage() {
    return (
        <div className="min-h-screen pt-24 pb-16 px-6">
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-3xl font-bold text-white mb-6">Contact Us</h1>
                <p className="text-slate-300 mb-8">Have questions? Reach out to us!</p>

                <div className="bg-slate-800/50 p-8 rounded-xl border border-slate-700 max-w-lg mx-auto">
                    <form className="space-y-4 text-left">
                        <div>
                            <label className="block text-slate-400 mb-1">Name</label>
                            <input type="text" className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white" />
                        </div>
                        <div>
                            <label className="block text-slate-400 mb-1">Email</label>
                            <input type="email" className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white" />
                        </div>
                        <div>
                            <label className="block text-slate-400 mb-1">Message</label>
                            <textarea rows="4" className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"></textarea>
                        </div>
                        <button type="submit" className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold py-2 px-4 rounded-lg transition">
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
