export function Footer() {
  return (
    <footer className="mt-auto py-12 border-t border-slate-200">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-900 rounded flex items-center justify-center text-white text-[10px] font-bold">
              P
            </div>
            <span className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              OpenPastebin
            </span>
          </div>
          
          <div className="flex gap-8">
            <a href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Privacy</a>
            <a href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Terms</a>
            <a href="https://github.com" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Source Code</a>
          </div>

          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} OpenPastebin. MIT Licensed.
          </p>
        </div>
      </div>
    </footer>
  );
}
