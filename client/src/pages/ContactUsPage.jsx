export function ContactUsPage() {
    return (
        <div className="min-h-screen pt-24 pb-16 px-6">
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-3xl font-bold text-white mb-6">Contact Us</h1>
                <p className="text-slate-300 mb-8">Have questions? Reach out to us!</p>

                <div className="bg-white/10 p-8 rounded-3xl border border-white/20 backdrop-blur-[0px] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] max-w-lg mx-auto">
                    <form className="space-y-5 text-left">
                        <div>
  <label className="block text-slate-200 mb-2 font-medium ml-1">
    Name
  </label>
  <input
    type="text"
    placeholder="Enter your name"
    className="w-full bg-white/[0.08] border border-white/25 rounded-xl px-4 py-3 text-white placeholder:text-slate-400 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/40 transition-all duration-300"
  />
</div>

<div>
  <label className="block text-slate-200 mb-2 font-medium ml-1">
    Email
  </label>
  <input
    type="email"
    placeholder="Enter your email"
    className="w-full bg-white/[0.08] border border-white/25 rounded-xl px-4 py-3 text-white placeholder:text-slate-400 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/40 transition-all duration-300"
  />
</div>

<div>
  <label className="block text-slate-200 mb-2 font-medium ml-1">
    Message
  </label>
  <textarea
    rows="4"
    placeholder="Write your message..."
    className="w-full bg-white/[0.08] border border-white/25 rounded-xl px-4 py-3 text-white placeholder:text-slate-400 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/40 transition-all duration-300 resize-none"
  />
</div>

<button
  type="submit"
  className="w-full bg-white/[0.08] hover:bg-white/[0.16] text-white font-bold py-3 px-4 rounded-xl border border-white/30 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] mt-2"
>
  Send Message
</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
