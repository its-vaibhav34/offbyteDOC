import React from 'react';
import {
  Book,
  Terminal,
  Cpu,
  Settings,
  Layers,
  Code2,
  HelpCircle,
  Zap,
  AlertTriangle,
  Rocket,
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
  Info,
  Lightbulb
} from 'lucide-react';

export interface DocSection {
  id: string;
  title: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  items?: { id: string; title: string }[];
}

// ─── Copy Button (visible on hover) ────────────────────────────────────────────
const CopyButton: React.FC<{ command: string }> = ({ command }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-zinc-700/60"
      title="Copy to clipboard"
    >
      {copied ? (
        <Check className="w-4 h-4 text-emerald-400" />
      ) : (
        <Copy className="w-4 h-4 text-zinc-500 hover:text-zinc-300" />
      )}
    </button>
  );
};

// ─── Code Block with copy button ────────────────────────────────────────────────
const CodeBlock: React.FC<{ children: string; noDollar?: boolean }> = ({ children, noDollar }) => (
  <div className="group relative">
    <pre className="bg-zinc-950 pl-4 pr-12 py-3 rounded-xl border border-zinc-800 font-mono text-sm text-emerald-400 overflow-x-auto">
      <code>{noDollar ? '' : <span className="text-zinc-600 select-none">$ </span>}{children}</code>
    </pre>
    <CopyButton command={children} />
  </div>
);

// ─── Options Table ──────────────────────────────────────────────────────────────
const OptionsTable: React.FC<{ options: { flag: string; description: string }[] }> = ({ options }) => (
  <div className="rounded-xl border border-zinc-800 overflow-hidden">
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-zinc-900/80 border-b border-zinc-800">
          <th className="text-left px-5 py-3 text-xs font-bold text-zinc-400 uppercase tracking-wider">Option</th>
          <th className="text-left px-5 py-3 text-xs font-bold text-zinc-400 uppercase tracking-wider">Description</th>
        </tr>
      </thead>
      <tbody>
        {options.map((opt, idx) => (
          <tr key={idx} className="border-b border-zinc-800/50 last:border-b-0 hover:bg-zinc-900/40 transition-colors">
            <td className="px-5 py-3 font-mono text-emerald-400 text-xs whitespace-nowrap">{opt.flag}</td>
            <td className="px-5 py-3 text-zinc-400 text-sm">{opt.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ─── Step List (What the command does internally) ───────────────────────────────
const StepList: React.FC<{ steps: string[] }> = ({ steps }) => (
  <div className="space-y-3">
    {steps.map((step, idx) => (
      <div key={idx} className="flex items-start gap-3">
        <div className="w-6 h-6 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 text-[11px] font-bold mt-0.5">
          {idx + 1}
        </div>
        <p className="text-sm text-zinc-400 leading-relaxed">{step}</p>
      </div>
    ))}
  </div>
);

// ─── Section Label ──────────────────────────────────────────────────────────────
const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="text-[11px] font-bold text-emerald-500 uppercase tracking-[0.15em] mb-3">{children}</h3>
);

// ─── Collapsible Sub-section ────────────────────────────────────────────────────
const CollapsibleSection: React.FC<{
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}> = ({ label, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className="border border-zinc-800/60 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-3 bg-zinc-900/40 hover:bg-zinc-900/70 transition-colors text-left"
      >
        <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-[0.15em]">{label}</span>
        <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="px-5 py-4 border-t border-zinc-800/40">
          {children}
        </div>
      )}
    </div>
  );
};

// ─── Full Command Documentation Section (Collapsible) ───────────────────────────
const CommandSection: React.FC<{
  id: string;
  title: string;
  description: string;
  syntax: string[];
  examples: { desc: string; cmd: string }[];
  options?: { flag: string; description: string }[];
  internals: string[];
  workflow: { desc: string; commands: string[] };
}> = ({ id, title, description, syntax, examples, options, internals, workflow }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <section id={id} className="scroll-mt-28">
      {/* Command Header — always visible, clickable */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/60 transition-all group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <Terminal className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white font-mono tracking-tight">{title}</h2>
              <p className="text-zinc-500 text-sm mt-0.5 leading-relaxed">{description}</p>
            </div>
          </div>
          <ChevronDown className={`w-5 h-5 text-zinc-500 transition-transform duration-300 shrink-0 ml-4 ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="mt-3 ml-2 pl-5 border-l-2 border-emerald-500/20 space-y-4">
          {/* Syntax — open by default */}
          <CollapsibleSection label="Syntax" defaultOpen={true}>
            <div className="space-y-2">
              {syntax.map((s, idx) => (
                <CodeBlock key={idx}>{s}</CodeBlock>
              ))}
            </div>
          </CollapsibleSection>

          {/* Usage Examples */}
          <CollapsibleSection label="Usage Examples">
            <div className="space-y-4">
              {examples.map((ex, idx) => (
                <div key={idx}>
                  <p className="text-sm text-zinc-500 mb-1.5">{ex.desc}</p>
                  <CodeBlock>{ex.cmd}</CodeBlock>
                </div>
              ))}
            </div>
          </CollapsibleSection>

          {/* Options Table */}
          {options && options.length > 0 && (
            <CollapsibleSection label="Options">
              <OptionsTable options={options} />
            </CollapsibleSection>
          )}

          {/* What This Command Does */}
          <CollapsibleSection label="What This Command Does">
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
              <p className="text-sm text-zinc-400 mb-4">
                When you run <code className="text-emerald-400 font-mono text-xs bg-zinc-800 px-1.5 py-0.5 rounded">{title}</code>, the CLI performs the following steps:
              </p>
              <StepList steps={internals} />
            </div>
          </CollapsibleSection>

          {/* Typical Workflow */}
          <CollapsibleSection label="Typical Workflow">
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-3">
              <p className="text-sm text-zinc-400">{workflow.desc}</p>
              <div className="space-y-2">
                {workflow.commands.map((cmd, idx) => (
                  <CodeBlock key={idx}>{cmd}</CodeBlock>
                ))}
              </div>
            </div>
          </CollapsibleSection>
        </div>
      )}
    </section>
  );
};


// ─── CLI Command Data (exported for search) ────────────────────────────────────
export const CLI_COMMANDS_DATA: {
  id: string;
  title: string;
  description: string;
  syntax: string[];
  examples: { desc: string; cmd: string }[];
  options?: { flag: string; description: string }[];
  internals: string[];
  workflow: { desc: string; commands: string[] };
}[] = [
    {
      id: 'cmd-generate',
      title: 'offbyte generate',
      description: 'Generate a production-ready backend by scanning the frontend project and detecting resources automatically.',
      syntax: [
        'offbyte generate',
        'offbyte generate [path]',
        'offbyte generate --quick',
        'offbyte generate --no-auto-connect',
      ],
      examples: [
        { desc: 'Generate backend using interactive setup:', cmd: 'offbyte generate' },
        { desc: 'Generate backend using default configuration:', cmd: 'offbyte generate --quick' },
        { desc: 'Generate backend from a specific project directory:', cmd: 'offbyte generate ./frontend-project' },
        { desc: 'Skip automatic frontend-backend connection:', cmd: 'offbyte generate --no-auto-connect' },
      ],
      options: [
        { flag: '--quick', description: 'Use default configuration without interactive prompts' },
        { flag: '--no-auto-connect', description: 'Skip automatic frontend/backend connection' },
      ],
      internals: [
        'Scans the frontend project directory',
        'Detects resources such as users, products, orders',
        'Identifies API patterns and data usage',
        'Builds an internal Intermediate Representation (IR)',
        'Generates backend structure (models, routes, controllers)',
        'Installs required dependencies',
        'Creates environment configuration files',
      ],
      workflow: {
        desc: 'Most developers start a project using:',
        commands: ['offbyte generate --quick'],
      },
    },
    {
      id: 'cmd-connect',
      title: 'offbyte connect',
      description: 'Automatically connects your frontend application to the generated backend.',
      syntax: [
        'offbyte connect',
        'offbyte connect [path]',
      ],
      examples: [
        { desc: 'Connect frontend and backend automatically:', cmd: 'offbyte connect' },
        { desc: 'Connect a specific frontend project:', cmd: 'offbyte connect ./frontend-project' },
      ],
      internals: [
        'Scans frontend files for API calls',
        'Detects hardcoded API URLs',
        'Replaces them with environment variables',
        'Updates request structures if necessary',
        'Creates .env configuration files',
        'Aligns frontend fields with backend responses',
      ],
      workflow: {
        desc: 'After generating backend:',
        commands: ['offbyte generate', 'offbyte connect'],
      },
    },
    {
      id: 'cmd-sync',
      title: 'offbyte sync',
      description: 'Synchronizes backend infrastructure with changes made in the frontend project.',
      syntax: [
        'offbyte sync',
        'offbyte sync [path]',
      ],
      examples: [
        { desc: 'Update backend based on frontend changes:', cmd: 'offbyte sync' },
        { desc: 'Sync a specific project directory:', cmd: 'offbyte sync ./frontend-project' },
      ],
      internals: [
        'The CLI scans the frontend project again',
        'Detects newly added resources',
        'Identifies new fields in existing resources',
        'Updates database models',
        'Generates new API routes if required',
        'Preserves custom backend logic',
      ],
      workflow: {
        desc: 'After modifying frontend state or resources:',
        commands: ['offbyte sync'],
      },
    },
    {
      id: 'cmd-benchmark',
      title: 'offbyte benchmark',
      description: 'Runs performance and scalability tests on your backend server.',
      syntax: [
        'offbyte benchmark',
        'offbyte benchmark --levels 10,100,1000',
        'offbyte benchmark --duration 20',
        'offbyte benchmark --startup-mode',
      ],
      examples: [
        { desc: 'Run default scalability test:', cmd: 'offbyte benchmark' },
        { desc: 'Run benchmark with custom load levels:', cmd: 'offbyte benchmark --levels 100,1000,10000' },
        { desc: 'Run benchmark with longer duration:', cmd: 'offbyte benchmark --duration 30' },
        { desc: 'Simulate startup growth scenario:', cmd: 'offbyte benchmark --startup-mode' },
      ],
      options: [
        { flag: '--levels', description: 'Define concurrent user load levels' },
        { flag: '--duration', description: 'Duration of benchmark test in seconds' },
        { flag: '--startup-mode', description: 'Simulates startup growth traffic patterns' },
      ],
      internals: [
        'The backend server is stress tested',
        'Multiple concurrent requests are simulated',
        'Latency and response times are measured',
        'Bottlenecks are detected',
        'Optimization suggestions are generated',
      ],
      workflow: {
        desc: 'Before deploying an application:',
        commands: ['offbyte benchmark --levels 100,1000,10000'],
      },
    },
    {
      id: 'cmd-deploy',
      title: 'offbyte deploy',
      description: 'Deploys your frontend and backend infrastructure to supported cloud providers.',
      syntax: [
        'offbyte deploy',
        'offbyte deploy --full',
        'offbyte deploy --frontend vercel --backend railway',
        'offbyte deploy --frontend netlify --backend skip',
      ],
      examples: [
        { desc: 'Deploy full stack using default providers:', cmd: 'offbyte deploy --full' },
        { desc: 'Deploy frontend and backend separately:', cmd: 'offbyte deploy --frontend vercel --backend railway' },
        { desc: 'Deploy only frontend:', cmd: 'offbyte deploy --frontend netlify --backend skip' },
      ],
      options: [
        { flag: '--full', description: 'Deploy using default stack (Vercel + Railway)' },
        { flag: '--frontend', description: 'Choose frontend hosting provider' },
        { flag: '--backend', description: 'Choose backend hosting provider' },
      ],
      internals: [
        'Required CLI tools are installed automatically',
        'Authentication status is verified',
        'Frontend application is deployed',
        'Backend server is deployed',
        'Deployment URLs are captured',
        'Environment variables are configured',
        'Frontend API URLs are updated',
      ],
      workflow: {
        desc: 'Deploy full stack application:',
        commands: ['offbyte deploy --full'],
      },
    },
    {
      id: 'cmd-generate-api',
      title: 'offbyte generate-api',
      description: 'Generates backend APIs based on frontend state structures.',
      syntax: [
        'offbyte generate-api',
        'offbyte generate-api [path]',
        'offbyte generate-api --no-inject',
      ],
      examples: [
        { desc: 'Generate APIs from frontend state:', cmd: 'offbyte generate-api' },
        { desc: 'Generate APIs from a specific project:', cmd: 'offbyte generate-api ./frontend-project' },
        { desc: 'Generate APIs without modifying frontend code:', cmd: 'offbyte generate-api --no-inject' },
      ],
      options: [
        { flag: '--no-inject', description: 'Skip automatic API integration in frontend files' },
      ],
      internals: [
        'Frontend components are scanned',
        'State variables are detected',
        'Resource models are inferred',
        'Backend APIs are generated',
        'API client utilities are created',
        'Optional API calls are injected into frontend components',
      ],
      workflow: {
        desc: 'Generate APIs after building UI:',
        commands: ['offbyte generate-api'],
      },
    },
    {
      id: 'cmd-doctor',
      title: 'offbyte doctor',
      description: 'Checks whether your system environment is ready to run Offbyte.',
      syntax: [
        'offbyte doctor',
        'offbyte doctor -ai',
      ],
      examples: [
        { desc: 'Run environment diagnostics:', cmd: 'offbyte doctor' },
        { desc: 'Run diagnostics with AI-powered error analysis:', cmd: 'offbyte doctor -ai' },
        // { desc: 'Automatically run dev server and analyze errors:', cmd: 'offbyte doctor -ai' },
      ],
      options: [
        { flag: '-ai', description: 'Automatically runs npm run dev, detects errors, and provides AI-powered step-by-step solutions using Llama model in a markdown report' },
      ],
      internals: [
        'Node.js installation and version',
        'npm availability',
        'MongoDB installation',
        'Required CLI tools',
        'Port availability',
        'System compatibility',
        'With -ai flag: Automatically executes npm run dev',
        'With -ai flag: Captures build/runtime errors from console output',
        'With -ai flag: Sends error logs to Llama AI model for analysis',
        'With -ai flag: Generates step-by-step solution report in SOLUTION.md',
        'With -ai flag: Provides actionable fixes in markdown format',
      ],
      workflow: {
        desc: 'Before generating backend:',
        commands: ['offbyte doctor', 'offbyte doctor -ai'],
      },
    },
  ];


// ─── DOCS_CONTENT Export ────────────────────────────────────────────────────────
export const DOCS_CONTENT: DocSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    icon: <Book className="w-4 h-4" />,
    items: [
      { id: 'overview', title: 'Overview' },
      { id: 'how-it-works', title: 'How it works' },
      { id: 'key-features', title: 'Key features' }
    ],
    content: (
      <div className="space-y-8" id="overview">
        <section className="space-y-4">
          <p className="text-lg text-zinc-400 leading-relaxed">
            <strong className="text-white">Offbyte</strong> is a revolutionary CLI tool that automatically generates production-ready backend infrastructure from your frontend code. By analyzing your frontend's API usage patterns, state variables, and data structures, Offbyte builds a complete, scalable backend in seconds.
          </p>
        </section>

        <section className="space-y-4">
          <h2 id="the-problem" className="text-2xl font-bold text-white">The Problem</h2>
          <p className="text-zinc-400">
            Frontend-first development is the modern standard, yet building a matching backend remains a bottleneck. Developers often spend days writing repetitive boilerplate for routes, controllers, models, and authentication. This "infrastructure tax" slows down innovation and introduces human error in API contracts.
          </p>
          <p className="text-zinc-400">
            Offbyte exists to remove this friction. It automates the "boring" parts of backend development, allowing you to focus on building features while ensuring your infrastructure is production-ready from day one.
          </p>
        </section>

        <section className="space-y-4">
          <h2 id="why-offbyte" className="text-2xl font-bold text-white">Why Developers Use Offbyte</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
              <h3 className="text-emerald-400 font-semibold mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4" /> Faster Development
              </h3>
              <p className="text-sm text-zinc-500">Go from a frontend prototype to a full-stack application in minutes, not days.</p>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
              <h3 className="text-emerald-400 font-semibold mb-2 flex items-center gap-2">
                <Layers className="w-4 h-4" /> Reduced Boilerplate
              </h3>
              <p className="text-sm text-zinc-500">Automatically generate routes, models, and controllers based on your frontend patterns.</p>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
              <h3 className="text-emerald-400 font-semibold mb-2 flex items-center gap-2">
                <Rocket className="w-4 h-4" /> Production Ready
              </h3>
              <p className="text-sm text-zinc-500">Generated code follows industry best practices for security, scalability, and performance.</p>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
              <h3 className="text-emerald-400 font-semibold mb-2 flex items-center gap-2">
                <Code2 className="w-4 h-4" /> Frontend-First Workflow
              </h3>
              <p className="text-sm text-zinc-500">Build your UI first, and let Offbyte infer the necessary backend structure.</p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 id="how-it-works" className="text-2xl font-bold text-white">The Workflow</h2>
          <div className="relative p-8 rounded-3xl bg-zinc-950 border border-zinc-800 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-emerald-500 to-cyan-500"></div>
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto shadow-xl">
                  <Code2 className="w-8 h-8 text-emerald-400" />
                </div>
                <p className="font-medium text-zinc-300">Frontend Project</p>
                <p className="text-[10px] text-zinc-500">React, Vue, Svelte</p>
              </div>
              <ChevronRight className="w-8 h-8 text-zinc-700 hidden md:block" />
              <div className="text-center space-y-2">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center animate-pulse">
                    <Settings className="w-6 h-6 text-black" />
                  </div>
                </div>
                <p className="font-bold text-emerald-400">Offbyte</p>
                <p className="text-[10px] text-zinc-500">Scanning Patterns</p>
              </div>
              <ChevronRight className="w-8 h-8 text-zinc-700 hidden md:block" />
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto shadow-xl">
                  <Layers className="w-8 h-8 text-cyan-400" />
                </div>
                <p className="font-medium text-zinc-300">Generated Backend</p>
                <p className="text-[10px] text-zinc-500">Express, Fastify, NestJS</p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h2 id="key-features" className="text-2xl font-bold text-white">Core Features</h2>
          <div className="space-y-4">
            {[
              { title: 'Smart Backend Generation', desc: 'Analyzes AST to detect resources and generate matching controllers and models.' },
              { title: 'Interactive Setup', desc: 'A user-friendly CLI wizard that guides you through configuration.' },
              { title: 'Auto Connect', desc: 'Automatically updates your frontend API base URLs to point to the new backend.' },
              { title: 'Smart API Generation', desc: 'Generates full RESTful APIs even if the frontend is only partially built.' },
              { title: 'Backend Sync', desc: 'Keeps your backend in sync with frontend changes in real-time.' },
              { title: 'Performance Benchmarking', desc: 'Built-in tools to test the scalability and latency of your generated backend.' },
              { title: 'One-Command Deployment', desc: 'Deploy your entire stack to AWS, Vercel, or Railway with a single command.' },
              { title: 'Socket.io Realtime', desc: 'Detects event-driven patterns and generates WebSocket handlers automatically.' },
              { title: 'AI Assisted Mode', desc: 'Uses advanced LLMs to infer complex business logic and edge cases.' },
              { title: 'Multi Framework & DB', desc: 'Supports Express, Fastify, NestJS with MongoDB, PostgreSQL, MySQL, and SQLite.' },
            ].map((feature, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-emerald-400 shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm">{feature.title}</h4>
                  <p className="text-xs text-zinc-500">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    )
  },
  
];
