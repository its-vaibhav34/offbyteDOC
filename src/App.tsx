import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Github,
  Moon,
  Sun,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  Copy,
  Check,
  ExternalLink,
  Book,
  Terminal,
  Cpu,
  Settings,
  Layers,
  Code2,
  HelpCircle,
  Zap,
  AlertTriangle,
  Rocket
} from 'lucide-react';
import { DOCS_CONTENT, CLI_COMMANDS_DATA, DocSection } from './docs';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [activeTab, setActiveTab] = useState('docs');
  const [activeSection, setActiveSection] = useState(DOCS_CONTENT[0].id);
  const [activeSubSection, setActiveSubSection] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSubSection(entry.target.id);
          }
        });
      },
      { threshold: 0.2, rootMargin: '-100px 0px -20% 0px' }
    );

    const currentSection = DOCS_CONTENT.find(s => s.id === activeSection);
    if (currentSection?.items) {
      currentSection.items.forEach((item) => {
        const el = document.getElementById(item.id);
        if (el) observer.observe(el);
      });
    }

    return () => observer.disconnect();
  }, [activeSection]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredDocs = DOCS_CONTENT.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Build CLI command search results
  const q = searchQuery.toLowerCase();
  const filteredCommands = searchQuery.trim() === '' ? [] : CLI_COMMANDS_DATA.filter(cmd =>
    cmd.title.toLowerCase().includes(q) ||
    cmd.description.toLowerCase().includes(q) ||
    cmd.syntax.some(s => s.toLowerCase().includes(q)) ||
    (cmd.options?.some(o => o.flag.toLowerCase().includes(q) || o.description.toLowerCase().includes(q)) ?? false)
  );

  // Build subcommand/flag search results
  const filteredFlags = searchQuery.trim() === '' ? [] : CLI_COMMANDS_DATA.flatMap(cmd =>
    (cmd.options ?? []).filter(o =>
      o.flag.toLowerCase().includes(q) || o.description.toLowerCase().includes(q)
    ).map(o => ({ ...o, parentCmd: cmd.title, parentId: cmd.id }))
  );

  const hasSearchResults = filteredDocs.length > 0 || filteredCommands.length > 0 || filteredFlags.length > 0;

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    setActiveSubSection('');
    setIsSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSubSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSubSection(id);
    }
  };

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-300 font-sans",
      isDarkMode ? "bg-black text-zinc-300" : "bg-zinc-50 text-zinc-700"
    )}>
      {/* Background Accents */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-cyan-500/10 blur-[120px] rounded-full" />
      </div>

      {/* Navbar */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-md transition-colors duration-300",
        isDarkMode ? "bg-black/70 border-zinc-800" : "bg-white/70 border-zinc-200"
      )}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection(DOCS_CONTENT[0].id)}>
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                <Settings className="w-5 h-5 text-black" />
              </div>
              <span className={cn("text-xl font-bold tracking-tight", isDarkMode ? "text-white" : "text-black")}>
                Offbyte
              </span>
            </div>
            {/* 
            <div className="hidden md:flex items-center gap-6">
              {['Docs', 'Guides', 'API', 'Showcase'].map((item) => (
                <button
                  key={item}
                  onClick={() => setActiveTab(item.toLowerCase())}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-emerald-400",
                    activeTab === item.toLowerCase() 
                      ? "text-emerald-400" 
                      : (isDarkMode ? "text-zinc-400" : "text-zinc-600")
                  )}
                >
                  {item}
                </button>
              ))}
            </div> */}
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <button
                onClick={() => setIsSearchOpen(true)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition-all w-48 lg:w-64",
                  isDarkMode
                    ? "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                    : "bg-zinc-100 border-zinc-200 text-zinc-400 hover:border-zinc-300"
                )}
              >
                <Search className="w-4 h-4" />
                <span>Search docs...</span>
                <span className="ml-auto text-[10px] font-mono border px-1 rounded border-zinc-700">⌘K</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  isDarkMode ? "hover:bg-zinc-900 text-zinc-400" : "hover:bg-zinc-100 text-zinc-600"
                )}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  isDarkMode ? "hover:bg-zinc-900 text-zinc-400" : "hover:bg-zinc-100 text-zinc-600"
                )}
              >
                <Github className="w-5 h-5" />
              </a>
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-zinc-900 text-zinc-400"
              >
                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 pt-24 pb-20 flex gap-8">
        {/* Sidebar */}
        <aside className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 pt-24 px-4 border-r transition-transform duration-300 md:relative md:translate-x-0 md:pt-0 md:border-none",
          isDarkMode ? "bg-black border-zinc-800" : "bg-white border-zinc-200",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="sticky top-24 space-y-8 overflow-y-auto max-h-[calc(100vh-8rem)] pr-4 custom-scrollbar">
            <div>
              <h5 className={cn("mb-4 text-xs font-bold uppercase tracking-widest", isDarkMode ? "text-zinc-500" : "text-zinc-400")}>
                Getting Started
              </h5>
              <div className="space-y-1">
                {DOCS_CONTENT.slice(0, 3).map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group",
                      activeSection === section.id
                        ? "bg-emerald-500/10 text-emerald-400"
                        : (isDarkMode ? "text-zinc-400 hover:bg-zinc-900 hover:text-white" : "text-zinc-600 hover:bg-zinc-100 hover:text-black")
                    )}
                  >
                    <span className={cn(
                      "transition-colors",
                      activeSection === section.id ? "text-emerald-400" : "text-zinc-500 group-hover:text-zinc-300"
                    )}>
                      {section.icon}
                    </span>
                    {section.title}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h5 className={cn("mb-4 text-xs font-bold uppercase tracking-widest", isDarkMode ? "text-zinc-500" : "text-zinc-400")}>
                Reference
              </h5>
              <div className="space-y-1">
                {DOCS_CONTENT.slice(3).map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group",
                      activeSection === section.id
                        ? "bg-emerald-500/10 text-emerald-400"
                        : (isDarkMode ? "text-zinc-400 hover:bg-zinc-900 hover:text-white" : "text-zinc-600 hover:bg-zinc-100 hover:text-black")
                    )}
                  >
                    <span className={cn(
                      "transition-colors",
                      activeSection === section.id ? "text-emerald-400" : "text-zinc-500 group-hover:text-zinc-300"
                    )}>
                      {section.icon}
                    </span>
                    {section.title}
                  </button>
                ))}
              </div>
            </div>

            {/* <div className="pt-4 border-t border-zinc-800/50">
              <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20">
                <p className="text-xs text-zinc-400 mb-2">Need help?</p>
                <p className="text-sm text-zinc-300 font-medium mb-3">Join our Discord community for support.</p>
                <button className="w-full py-2 rounded-lg bg-emerald-500 text-black text-xs font-bold hover:bg-emerald-400 transition-colors">
                  Join Discord
                </button>
              </div>
            </div> */}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-3xl mx-auto"
            >
              <div className="mb-12">
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium mb-4">
                  <span>Docs</span>
                  <ChevronRight className="w-3 h-3 text-zinc-600" />
                  <span>{DOCS_CONTENT.find(s => s.id === activeSection)?.title}</span>
                </div>
                <h1 className={cn("text-4xl md:text-5xl font-extrabold tracking-tight mb-6", isDarkMode ? "text-white" : "text-black")}>
                  {DOCS_CONTENT.find(s => s.id === activeSection)?.title}
                </h1>
                <div className="h-1 w-20 bg-emerald-500 rounded-full mb-8" />
              </div>

              <div className="prose prose-invert max-w-none">
                {DOCS_CONTENT.find(s => s.id === activeSection)?.content}
              </div>

              {/* Pagination */}
              <div className="mt-20 pt-8 border-t border-zinc-800 flex items-center justify-between">
                {(() => {
                  const currentIndex = DOCS_CONTENT.findIndex(s => s.id === activeSection);
                  const prev = DOCS_CONTENT[currentIndex - 1];
                  const next = DOCS_CONTENT[currentIndex + 1];

                  return (
                    <>
                      {prev ? (
                        <button
                          onClick={() => scrollToSection(prev.id)}
                          className="group flex flex-col items-start gap-2 text-left"
                        >
                          <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Previous</span>
                          <span className="flex items-center gap-2 text-zinc-300 group-hover:text-emerald-400 transition-colors">
                            <ChevronRight className="w-4 h-4 rotate-180" />
                            {prev.title}
                          </span>
                        </button>
                      ) : <div />}

                      {next ? (
                        <button
                          onClick={() => scrollToSection(next.id)}
                          className="group flex flex-col items-end gap-2 text-right"
                        >
                          <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Next</span>
                          <span className="flex items-center gap-2 text-zinc-300 group-hover:text-emerald-400 transition-colors">
                            {next.title}
                            <ChevronRight className="w-4 h-4" />
                          </span>
                        </button>
                      ) : <div />}
                    </>
                  );
                })()}
              </div>
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Right Sidebar (TOC) */}
        <aside className="hidden lg:block w-64">
          <div className="sticky top-24 space-y-6">
            <h5 className={cn("text-xs font-bold uppercase tracking-widest", isDarkMode ? "text-zinc-500" : "text-zinc-400")}>
              On this page
            </h5>
            <div className="space-y-3">
              {DOCS_CONTENT.find(s => s.id === activeSection)?.items?.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSubSection(item.id)}
                  className={cn(
                    "block text-sm transition-colors text-left w-full",
                    activeSubSection === item.id
                      ? "text-emerald-400 font-medium"
                      : "text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  {item.title}
                </button>
              ))}
            </div>

            <div className="pt-8 space-y-4">
              <h5 className={cn("text-xs font-bold uppercase tracking-widest", isDarkMode ? "text-zinc-500" : "text-zinc-400")}>
                Resources
              </h5>
              <div className="space-y-2">
                <a
                  href="https://github.com/adityasharma0903/Backendify"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  GitHub Repository
                </a>
                <a
                  href="https://www.npmjs.com/package/offbyte"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  NPM Package
                </a>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className={cn(
                "relative w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden",
                isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
              )}
            >
              <div className="p-4 border-b border-zinc-800 flex items-center gap-3">
                <Search className="w-5 h-5 text-zinc-500" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search documentation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-lg text-white placeholder:text-zinc-600"
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="px-2 py-1 rounded bg-zinc-800 text-zinc-500 text-[10px] font-mono"
                >
                  ESC
                </button>
              </div>
              <div className="max-h-[60vh] overflow-y-auto p-2 custom-scrollbar">
                {hasSearchResults ? (
                  <>
                    {/* Doc sections */}
                    {filteredDocs.length > 0 && (
                      <div>
                        <p className="px-3 pt-2 pb-1 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Documentation</p>
                        {filteredDocs.map((doc) => (
                          <button
                            key={doc.id}
                            onClick={() => {
                              scrollToSection(doc.id);
                              setIsSearchOpen(false);
                              setSearchQuery('');
                            }}
                            className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-emerald-500/10 group transition-colors text-left"
                          >
                            <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 group-hover:border-emerald-500/50 group-hover:text-emerald-400 transition-colors">
                              {doc.icon}
                            </div>
                            <div>
                              <p className="text-white font-medium group-hover:text-emerald-400 transition-colors">{doc.title}</p>
                              <p className="text-xs text-zinc-500">Documentation section</p>
                            </div>
                            <ChevronRight className="ml-auto w-4 h-4 text-zinc-700 group-hover:text-emerald-400" />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* CLI Commands */}
                    {filteredCommands.length > 0 && (
                      <div>
                        <p className="px-3 pt-3 pb-1 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">CLI Commands</p>
                        {filteredCommands.map((cmd) => (
                          <button
                            key={cmd.id}
                            onClick={() => {
                              scrollToSection('cli-commands');
                              setIsSearchOpen(false);
                              setSearchQuery('');
                              setTimeout(() => {
                                const el = document.getElementById(cmd.id);
                                if (el) {
                                  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                  // Click the command header to expand it
                                  const btn = el.querySelector('button');
                                  if (btn) btn.click();
                                }
                              }, 350);
                            }}
                            className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-emerald-500/10 group transition-colors text-left"
                          >
                            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:border-emerald-400 transition-colors">
                              <Terminal className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-white font-mono font-medium text-sm group-hover:text-emerald-400 transition-colors">{cmd.title}</p>
                              <p className="text-xs text-zinc-500 truncate">{cmd.description}</p>
                            </div>
                            <ChevronRight className="ml-auto w-4 h-4 text-zinc-700 group-hover:text-emerald-400 shrink-0" />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Flags / Options */}
                    {filteredFlags.length > 0 && (
                      <div>
                        <p className="px-3 pt-3 pb-1 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Options & Flags</p>
                        {filteredFlags.map((flag, idx) => (
                          <button
                            key={`${flag.parentId}-${flag.flag}-${idx}`}
                            onClick={() => {
                              scrollToSection('cli-commands');
                              setIsSearchOpen(false);
                              setSearchQuery('');
                              setTimeout(() => {
                                const el = document.getElementById(flag.parentId);
                                if (el) {
                                  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                  const btn = el.querySelector('button');
                                  if (btn) btn.click();
                                }
                              }, 350);
                            }}
                            className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-emerald-500/10 group transition-colors text-left"
                          >
                            <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 group-hover:border-emerald-500/50 group-hover:text-emerald-400 transition-colors font-mono text-xs">
                              --
                            </div>
                            <div className="min-w-0">
                              <p className="text-emerald-400 font-mono text-sm">{flag.flag}</p>
                              <p className="text-xs text-zinc-500 truncate">
                                <span className="text-zinc-600">{flag.parentCmd}</span> · {flag.description}
                              </p>
                            </div>
                            <ChevronRight className="ml-auto w-4 h-4 text-zinc-700 group-hover:text-emerald-400 shrink-0" />
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : searchQuery.trim() !== '' ? (
                  <div className="p-8 text-center space-y-2">
                    <Search className="w-8 h-8 text-zinc-700 mx-auto" />
                    <p className="text-zinc-500">No results found for "{searchQuery}"</p>
                  </div>
                ) : null}
              </div>
              <div className="p-4 border-t border-zinc-800 flex items-center justify-between text-[10px] text-zinc-500 font-medium uppercase tracking-widest">
                <div className="flex gap-4">
                  <span className="flex items-center gap-1"><ChevronDown className="w-3 h-3" /> Select</span>
                  <span className="flex items-center gap-1"><ChevronRight className="w-3 h-3" /> Navigate</span>
                </div>
                <span>Search by Offbyte</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className={cn(
        "border-t pt-12 pb-8",
        isDarkMode ? "bg-black border-zinc-800" : "bg-zinc-50 border-zinc-200"
      )}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-emerald-500 flex items-center justify-center">
                  <Settings className="w-4 h-4 text-black" />
                </div>
                <span className="font-bold text-white">Offbyte</span>
              </div>
              <p className="text-sm text-zinc-500 max-w-xs">
                Generating production-ready backend infrastructure from frontend projects automatically.
              </p>
            </div>
            <div className="space-y-4">
              <h6 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Product</h6>
              <ul className="text-sm text-zinc-500 space-y-2">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">CLI Reference</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Changelog</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h6 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Community</h6>
              <ul className="text-sm text-zinc-500 space-y-2">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">GitHub</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Twitter</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-zinc-800/50">
            <p className="text-xs text-zinc-600">© 2026 Offbyte Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">Privacy Policy</a>
              <a href="#" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
