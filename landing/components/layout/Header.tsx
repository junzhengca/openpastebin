import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold group-hover:bg-primary-500 transition-colors shadow-vista-button">
            P
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            OpenPastebin
          </span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link 
            href="/" 
            className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors"
          >
            New Paste
          </Link>
          <Link 
            href="https://github.com" 
            target="_blank"
            className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors"
          >
            GitHub
          </Link>
        </nav>
      </div>
    </header>
  );
}
