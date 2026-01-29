import { CreatePasteForm } from "@/components/paste/CreatePasteForm";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-12 py-8">
      {/* Hero Section */}
      <section className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
          Share code and text <span className="text-primary-600">securely</span>.
        </h1>
        <p className="text-lg text-slate-600">
          OpenPastebin is a minimalist, secure, and open-source pastebin service.
          No account required. Just paste, share, and go.
        </p>
      </section>

      {/* Main Content - Create Paste Form */}
      <section className="w-full bg-white rounded-2xl shadow-cap-so border border-slate-200 overflow-hidden">
        <div className="p-6 md:p-8">
          <CreatePasteForm />
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <h3 className="font-bold text-slate-900 mb-2 text-lg">Secure by Design</h3>
          <p className="text-slate-600 leading-relaxed">Your data is stored securely and can be protected with secret tokens for private sharing.</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <h3 className="font-bold text-slate-900 mb-2 text-lg">Self-Destructing</h3>
          <p className="text-slate-600 leading-relaxed">Set an expiration time for your pastes. They automatically disappear after they expire.</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
          </div>
          <h3 className="font-bold text-slate-900 mb-2 text-lg">Instant Sharing</h3>
          <p className="text-slate-600 leading-relaxed">No sign-up required. Paste your content and get a shareable link instantly.</p>
        </div>
      </section>
    </div>
  );
}
