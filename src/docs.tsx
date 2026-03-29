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
      title: 'offbyt generate',
      description: 'Generate a production-ready backend by scanning the frontend project and detecting resources automatically.',
      syntax: [
        'offbyt generate',
        'offbyt generate [path]',
        'offbyt generate --quick',
        'offbyt generate --no-auto-connect',
      ],
      examples: [
        { desc: 'Generate backend using interactive setup:', cmd: 'offbyt generate' },
        { desc: 'Generate backend using default configuration:', cmd: 'offbyt generate --quick' },
        { desc: 'Generate backend from a specific project directory:', cmd: 'offbyt generate ./frontend-project' },
        { desc: 'Skip automatic frontend-backend connection:', cmd: 'offbyt generate --no-auto-connect' },
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
        commands: ['offbyt generate --quick'],
      },
    },
    {
      id: 'cmd-connect',
      title: 'offbyt connect',
      description: 'Automatically connects your frontend application to the generated backend.',
      syntax: [
        'offbyt connect',
        'offbyt connect [path]',
      ],
      examples: [
        { desc: 'Connect frontend and backend automatically:', cmd: 'offbyt connect' },
        { desc: 'Connect a specific frontend project:', cmd: 'offbyt connect ./frontend-project' },
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
        commands: ['offbyt generate', 'offbyt connect'],
      },
    },
    {
      id: 'cmd-sync',
      title: 'offbyt sync',
      description: 'Synchronizes backend infrastructure with changes made in the frontend project.',
      syntax: [
        'offbyt sync',
        'offbyt sync [path]',
      ],
      examples: [
        { desc: 'Update backend based on frontend changes:', cmd: 'offbyt sync' },
        { desc: 'Sync a specific project directory:', cmd: 'offbyt sync ./frontend-project' },
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
        commands: ['offbyt sync'],
      },
    },
    {
      id: 'cmd-benchmark',
      title: 'offbyt benchmark',
      description: 'Runs performance and scalability tests on your backend server.',
      syntax: [
        'offbyt benchmark',
        'offbyt benchmark --levels 10,100,1000',
        'offbyt benchmark --duration 20',
        'offbyt benchmark --startup-mode',
      ],
      examples: [
        { desc: 'Run default scalability test:', cmd: 'offbyt benchmark' },
        { desc: 'Run benchmark with custom load levels:', cmd: 'offbyt benchmark --levels 100,1000,10000' },
        { desc: 'Run benchmark with longer duration:', cmd: 'offbyt benchmark --duration 30' },
        { desc: 'Simulate startup growth scenario:', cmd: 'offbyt benchmark --startup-mode' },
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
        commands: ['offbyt benchmark --levels 100,1000,10000'],
      },
    },
    {
      id: 'cmd-deploy',
      title: 'offbyt deploy',
      description: 'Deploys your frontend and backend infrastructure to supported cloud providers.',
      syntax: [
        'offbyt deploy',
        'offbyt deploy --full',
        'offbyt deploy --frontend vercel --backend railway',
        'offbyt deploy --frontend netlify --backend skip',
      ],
      examples: [
        { desc: 'Deploy full stack using default providers:', cmd: 'offbyt deploy --full' },
        { desc: 'Deploy frontend and backend separately:', cmd: 'offbyt deploy --frontend vercel --backend railway' },
        { desc: 'Deploy only frontend:', cmd: 'offbyt deploy --frontend netlify --backend skip' },
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
        commands: ['offbyt deploy --full'],
      },
    },
    {
      id: 'cmd-generate-api',
      title: 'offbyt generate-api',
      description: 'Generates backend APIs based on frontend state structures.',
      syntax: [
        'offbyt generate-api',
        'offbyt generate-api [path]',
        'offbyt generate-api --no-inject',
      ],
      examples: [
        { desc: 'Generate APIs from frontend state:', cmd: 'offbyt generate-api' },
        { desc: 'Generate APIs from a specific project:', cmd: 'offbyt generate-api ./frontend-project' },
        { desc: 'Generate APIs without modifying frontend code:', cmd: 'offbyt generate-api --no-inject' },
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
        commands: ['offbyt generate-api'],
      },
    },
    {
      id: 'cmd-doctor',
      title: 'offbyt doctor',
      description: 'Checks whether your system environment is ready to run offbyt.',
      syntax: [
        'offbyt doctor',
        'offbyt doctor -ai',
      ],
      examples: [
        { desc: 'Run environment diagnostics:', cmd: 'offbyt doctor' },
        { desc: 'Run diagnostics with AI-powered error analysis:', cmd: 'offbyt doctor -ai' },
        // { desc: 'Automatically run dev server and analyze errors:', cmd: 'offbyt doctor -ai' },
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
        commands: ['offbyt doctor', 'offbyt doctor -ai'],
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
            <strong className="text-white">offbyt</strong> is a revolutionary CLI tool that automatically generates production-ready backend infrastructure from your frontend code. By analyzing your frontend's API usage patterns, state variables, and data structures, offbyt builds a complete, scalable backend in seconds.
          </p>
        </section>

        <section className="space-y-4">
          <h2 id="the-problem" className="text-2xl font-bold text-white">The Problem</h2>
          <p className="text-zinc-400">
            Frontend-first development is the modern standard, yet building a matching backend remains a bottleneck. Developers often spend days writing repetitive boilerplate for routes, controllers, models, and authentication. This "infrastructure tax" slows down innovation and introduces human error in API contracts.
          </p>
          <p className="text-zinc-400">
            offbyt exists to remove this friction. It automates the "boring" parts of backend development, allowing you to focus on building features while ensuring your infrastructure is production-ready from day one.
          </p>
        </section>

        <section className="space-y-4">
          <h2 id="why-offbyt" className="text-2xl font-bold text-white">Why Developers Use offbyt</h2>
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
              <p className="text-sm text-zinc-500">Build your UI first, and let offbyt infer the necessary backend structure.</p>
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
                <p className="font-bold text-emerald-400">offbyt</p>
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
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: <Rocket className="w-4 h-4" />,
    items: [
      { id: 'installation', title: 'Installation' },
      { id: 'initialization', title: 'Initialization' },
      { id: 'backend-generation', title: 'Backend Generation' }
    ],
    content: (
      <div className="space-y-12">
        <section className="space-y-4">
          <h2 id="installation" className="text-2xl font-bold text-white">Installation</h2>
          <p className="text-zinc-400 leading-relaxed">
            Install offbyt globally using npm to access the CLI from anywhere.
          </p>
          <CodeBlock>npm install -g offbyt</CodeBlock>
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Requirements</h4>
            <ul className="list-disc list-inside text-sm text-zinc-500 space-y-1 ml-2">
              <li>Node.js v18.0.0 or higher</li>
              <li>npm v8.0.0 or higher</li>
              <li>MongoDB (for default database generation)</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 id="initialization" className="text-2xl font-bold text-white">Initialization</h2>
          <p className="text-zinc-400">
            Navigate to your frontend project root and run the initialization command.
          </p>
          <CodeBlock>offbyt init</CodeBlock>
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-4">
            <h4 className="text-white font-semibold">What happens internally?</h4>
            <StepList steps={[
              'Project Scanning: Detects if you are using React, Vue, or Svelte.',
              'Framework Detection: Identifies your build tools (Vite, Webpack).',
              'Config Generation: Creates a offbyt.config.js file.',
              'IR Initialization: Prepares the local Intermediate Representation store.',
            ]} />
          </div>
        </section>

        <section className="space-y-4">
          <h2 id="backend-generation" className="text-2xl font-bold text-white">Backend Generation</h2>
          <p className="text-zinc-400">
            Once initialized, you can generate your backend with a single command.
          </p>
          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 font-mono text-sm text-zinc-300">
            <div className="flex gap-2">
              <span className="text-zinc-600">$</span>
              <span>offbyt generate</span>
            </div>
            <div className="text-zinc-500 mt-4 space-y-1">
              <p>🔍 Scanning frontend patterns...</p>
              <p>📦 Building Intermediate Representation...</p>
              <p>🚀 Generating Express server infrastructure...</p>
              <p>✔ Created ./backend/src/index.ts</p>
              <p>✔ Created ./backend/src/models/User.ts</p>
              <p>✔ Created ./backend/src/routes/userRoutes.ts</p>
              <p>📦 Installing backend dependencies...</p>
              <p className="text-emerald-400 mt-2">✅ Backend generated successfully!</p>
            </div>
          </div>
        </section>
      </div>
    )
  },
  {
    id: 'core-concepts',
    title: 'Core Concepts',
    icon: <Layers className="w-4 h-4" />,
    items: [
      { id: 'resources', title: 'Resources' },
      { id: 'ir', title: 'Intermediate Representation' },
      { id: 'rule-engine', title: 'Rule Engine' }
    ],
    content: (
      <div className="space-y-12">
        <section className="space-y-4">
          <h2 id="resources" className="text-2xl font-bold text-white">Resources</h2>
          <p className="text-zinc-400">
            A <strong className="text-white">Resource</strong> is a high-level entity detected in your frontend that requires backend persistence or logic. Examples include <code className="text-zinc-300">products</code>, <code className="text-zinc-300">users</code>, and <code className="text-zinc-300">orders</code>.
          </p>
          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
            <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">Detection Patterns</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-emerald-400 text-xs font-mono">useState(['users'])</p>
                <p className="text-xs text-zinc-500">State variables often imply a resource.</p>
              </div>
              <div className="space-y-1">
                <p className="text-emerald-400 text-xs font-mono">fetch('/api/products')</p>
                <p className="text-xs text-zinc-500">API calls directly define endpoints.</p>
              </div>
              <div className="space-y-1">
                <p className="text-emerald-400 text-xs font-mono">items.map(item ={">"} ...)</p>
                <p className="text-xs text-zinc-500">Mapping over arrays suggests collection resources.</p>
              </div>
              <div className="space-y-1">
                <p className="text-emerald-400 text-xs font-mono">input name="email"</p>
                <p className="text-xs text-zinc-500">Form inputs help define model schemas.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 id="ir" className="text-2xl font-bold text-white">Intermediate Representation (IR)</h2>
          <p className="text-zinc-400">
            The IR is a JSON-based schema that acts as the source of truth for your backend. It decouples the detection logic from the code generation logic, allowing offbyt to support multiple frameworks and databases.
          </p>
          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 font-mono text-xs text-zinc-400">
            <p className="text-zinc-600">// Example IR Structure</p>
            <pre>{`{
  "resources": {
    "User": {
      "fields": { "name": "String", "email": "String" },
      "endpoints": [
        { "path": "/users", "method": "GET", "auth": true },
        { "path": "/users", "method": "POST", "validation": "userSchema" }
      ],
      "relationships": { "orders": "hasMany" }
    }
  }
}`}</pre>
          </div>
        </section>

        <section className="space-y-4">
          <h2 id="rule-engine" className="text-2xl font-bold text-white">Rule Engine</h2>
          <p className="text-zinc-400">
            The Rule Engine processes the IR and applies transformation rules to generate code. It handles:
          </p>
          <ul className="list-disc list-inside text-zinc-500 space-y-2 ml-4">
            <li><strong className="text-zinc-300">Routing Rules:</strong> Converts IR endpoints into framework-specific router code.</li>
            <li><strong className="text-zinc-300">Validation Rules:</strong> Generates Zod or Joi schemas based on field types.</li>
            <li><strong className="text-zinc-300">Authentication Rules:</strong> Injects JWT or OAuth middleware where required.</li>
          </ul>
        </section>
      </div>
    )
  },
  {
    id: 'cli-commands',
    title: 'CLI Commands',
    icon: <Terminal className="w-4 h-4" />,
    items: [
      { id: 'cmd-generate', title: 'offbyt generate' },
      { id: 'cmd-connect', title: 'offbyt connect' },
      { id: 'cmd-sync', title: 'offbyt sync' },
      { id: 'cmd-benchmark', title: 'offbyt benchmark' },
      { id: 'cmd-deploy', title: 'offbyt deploy' },
      { id: 'cmd-generate-api', title: 'offbyt generate-api' },
      { id: 'cmd-doctor', title: 'offbyt doctor' },
    ],
    content: (
      <div className="space-y-16">
        {CLI_COMMANDS_DATA.map((cmd) => (
          <CommandSection
            key={cmd.id}
            id={cmd.id}
            title={cmd.title}
            description={cmd.description}
            syntax={cmd.syntax}
            examples={cmd.examples}
            options={cmd.options}
            internals={cmd.internals}
            workflow={cmd.workflow}
          />
        ))}
      </div>
    )
  },
  {
    id: 'architecture',
    title: 'Architecture',
    icon: <Layers className="w-4 h-4" />,
    content: (
      <div className="space-y-12">
        <section className="space-y-4">
          <p className="text-zinc-400">
            offbyt uses a sophisticated pipeline to transform frontend code into backend infrastructure. This process relies heavily on <strong className="text-white">Abstract Syntax Tree (AST)</strong> parsing to understand the intent of your code without executing it.
          </p>
        </section>

        <div className="space-y-8">
          {[
            { step: 'Project Scanner', desc: 'Identifies project type (React/Vue/Svelte) and locates source directories.' },
            { step: 'AST Parser', desc: 'Converts source files into ASTs using Babel and TypeScript parsers. This allows offbyt to "read" your code structure.' },
            { step: 'Detection Layer', desc: 'Traverses ASTs to find specific patterns like API calls, state hooks, and form structures.' },
            { step: 'IR Builder', desc: 'Aggregates detected patterns into a unified JSON Intermediate Representation.' },
            { step: 'Rule Engine', desc: 'Applies logic to the IR to decide which backend components are needed.' },
            { step: 'Code Generator', desc: 'Uses EJS templates to output high-quality, framework-specific source code.' }
          ].map((item, i) => (
            <div key={i} className="flex gap-6 group">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 font-bold group-hover:border-emerald-500/50 group-hover:text-emerald-400 transition-colors shrink-0">
                {i + 1}
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-bold">{item.step}</h4>
                <p className="text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <section className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
          <h4 className="text-emerald-400 font-bold mb-2 flex items-center gap-2">
            <Info className="w-4 h-4" /> Why AST Parsing?
          </h4>
          <p className="text-sm text-zinc-400">
            Unlike simple regex searches, AST parsing understands the context of your code. It knows the difference between a variable named <code className="text-zinc-300">user</code> and a resource entity <code className="text-zinc-300">User</code>, ensuring extremely high accuracy in backend generation.
          </p>
        </section>
      </div>
    )
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    icon: <AlertTriangle className="w-4 h-4" />,
    content: (
      <div className="space-y-8">
        <section className="space-y-4">
          <p className="text-zinc-400">
            If something doesn't work as expected while using <strong>offbyt</strong>, this guide will help you identify and resolve common issues efficiently.
          </p>
          <p className="text-sm text-zinc-500">
            <strong className="text-zinc-300">Most issues occur during one of these stages:</strong>
          </p>
          <ul className="text-sm text-zinc-500 space-y-1 list-disc list-inside ml-2">
            <li>Project scanning</li>
            <li>Resource detection</li>
            <li>Backend generation</li>
            <li>Backend startup</li>
            <li>Deployment</li>
          </ul>
        </section>

        {[
          {
            title: 'Resources or APIs Not Detected',
            problem: 'offbyt runs successfully but does not generate expected APIs or resources.',
            example: 'Frontend contains a state variable like const [products, setProducts] = useState([]) but no /api/products route is generated.',
            cause: 'offbyt detects resources using static analysis of frontend patterns. Dynamic patterns, interpolated strings, or non-standard API calling conventions may not be reliably detected.',
            causeBadPattern: 'const resource = "products"; fetch(`/api/${resource}`)',
            solution: 'Use explicit, static resource patterns in your frontend code. This ensures offbyt can reliably detect all required endpoints.',
            solutionGoodPattern: 'fetch("/api/products") or const [products, setProducts] = useState([])',
            fixCommand: 'offbyt scan && offbyt generate'
          },
          {
            title: 'Backend Folder Not Generated',
            problem: 'Running offbyt generate does not create the backend/ directory.',
            cause: 'This typically occurs when: (1) offbyt cannot detect a supported frontend project, (2) the command is run outside the project root, or (3) the project contains no detectable resources.',
            solution: 'Ensure you are inside the frontend project directory with the correct project structure including src/components, src/pages, or src/hooks.',
            fixCommand: 'cd my-frontend-project && offbyt scan'
          },
          {
            title: 'Backend Server Not Starting',
            problem: 'After generating backend, running npm run dev fails or the server crashes.',
            cause: 'Dependencies may not have been installed properly, or there are missing environment configuration files.',
            solution: 'Navigate to the backend directory and install all dependencies. Verify your .env file is properly configured with required variables.',
            fixCommand: 'cd backend && npm install && npm run dev'
          },
          {
            title: 'Database Connection Error',
            problem: 'Backend server starts but database connection fails with authentication or connection timeout errors.',
            cause: 'MongoDB or your specified database is not running, the connection URI is incorrect, or credentials are invalid.',
            solution: 'Ensure your database instance is running and accessible. Update your .env file with the correct connection string. For local MongoDB, start the service. For MongoDB Atlas, verify credentials and IP whitelist.',
            fixCommand: 'For local: mongod | For Atlas: Update MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/db'
          },
          {
            title: 'Sync Does Not Update Backend',
            problem: 'Running offbyt sync does not update backend when frontend changes are made.',
            cause: 'offbyt only generates changes when it detects new resources or field modifications. Minor frontend changes that do not affect resource structure will not trigger updates.',
            solution: 'Ensure your frontend changes include new resource usage patterns or field definitions. Run scan again to detect changes before syncing.',
            fixCommand: 'offbyt scan && offbyt sync'
          },
          {
            title: 'Deployment Fails',
            problem: 'Running offbyt deploy fails during the deployment process to cloud platforms.',
            cause: 'Deployment providers (Vercel, Railway, Netlify, etc.) require CLI authentication. Your credentials may have expired or are not configured.',
            solution: 'Authenticate with your deployment provider\'s CLI before running offbyt deployment. This establishes the required credentials and permissions.',
            fixCommand: 'vercel login (or railway login, netlify login) && offbyt deploy --full'
          },
          {
            title: 'Port Already In Use',
            problem: 'Backend server fails to start with error: "Port 5000 already in use" or similar.',
            cause: 'Another process is already using the port configured for your backend server.',
            solution: 'Either terminate the existing process using the port or configure your backend to use a different port. Update your .env file to specify an alternative port.',
            fixCommands: [
              { os: 'macOS/Linux', cmd: 'lsof -i :5000' },
              { os: 'macOS/Linux', cmd: 'kill -9 <PID>' },
              { os: 'Windows', cmd: 'netstat -ano | findstr :5000' },
              { os: 'Windows', cmd: 'taskkill /PID <PID> /F' },
              { os: 'All Platforms', cmd: 'PORT=5001 npm run dev' }
            ]
          }
        ].map((item: any, i: number) => (
          <section key={i} className="space-y-4">
            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-4">
              <div className="flex items-center gap-2 text-red-400 mb-4">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="text-lg font-bold">{item.title}</h3>
              </div>

              <div>
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2">Problem</p>
                <p className="text-sm text-zinc-400">{item.problem}</p>
                {item.example && (
                  <p className="text-xs text-zinc-500 mt-2 italic">Example: {item.example}</p>
                )}
              </div>

              <div>
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2">Root Cause</p>
                <p className="text-sm text-zinc-400">{item.cause}</p>
                {item.causeBadPattern && (
                  <p className="text-xs text-red-400/70 mt-2 font-mono bg-zinc-950 px-2 py-1 rounded">❌ {item.causeBadPattern}</p>
                )}
              </div>

              <div>
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2">Solution</p>
                <p className="text-sm text-zinc-400">{item.solution}</p>
                {item.solutionGoodPattern && (
                  <p className="text-xs text-emerald-400 mt-2 font-mono bg-zinc-950 px-2 py-1 rounded">✓ {item.solutionGoodPattern}</p>
                )}
              </div>

              <div>
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2">Resolution Command</p>
                {item.fixCommands ? (
                  <div className="space-y-2">
                    {item.fixCommands.map((cmdItem: any, cmdIdx: number) => (
                      <div key={cmdIdx} className="space-y-1">
                        <p className="text-[10px] text-zinc-500 font-mono">{cmdItem.os}</p>
                        <div className="flex items-center justify-between bg-black px-3 py-2 rounded group hover:bg-zinc-950 transition-colors relative">
                          <code className="text-xs text-emerald-400 font-mono">{cmdItem.cmd}</code>
                          <CopyButton command={cmdItem.cmd} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-black px-3 py-2 rounded group hover:bg-zinc-950 transition-colors relative">
                    <code className="text-xs text-emerald-400 font-mono">{item.fixCommand}</code>
                    <CopyButton command={item.fixCommand} />
                  </div>
                )}
              </div>
            </div>
          </section>
        ))}
      </div>
    )
  },
  {
    id: 'configuration',
    title: 'Configuration',
    icon: <Settings className="w-4 h-4" />,
    content: (
      <div className="space-y-8">
        <section className="space-y-4">
          <p className="text-zinc-400">
            The <code className="text-zinc-300">offbyt.config.js</code> file allows you to fine-tune how your backend is generated.
          </p>
          <pre className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 font-mono text-xs text-zinc-300">
            {`module.exports = {
  outputDir: './backend',
  framework: 'express', // express, fastify, nest
  database: 'mongodb', // mongodb, postgres, mysql, sqlite
  auth: {
    provider: 'jwt', // jwt, oauth, none
    secret: process.env.JWT_SECRET
  },
  resources: {
    // Manual overrides
    'User': {
      fields: { 'role': 'String' },
      endpoints: ['GET', 'POST', 'DELETE']
    }
  }
};`}
          </pre>
        </section>

        <section className="space-y-6">
          <h3 className="text-xl font-bold text-white">Property Reference</h3>
          <div className="space-y-4">
            {[
              { prop: 'outputDir', desc: 'The directory where the backend code will be generated.' },
              { prop: 'framework', desc: 'The Node.js framework to use for the server.' },
              { prop: 'database', desc: 'The database system to generate models for.' },
              { prop: 'auth', desc: 'Authentication configuration including provider and secrets.' },
              { prop: 'resources', desc: 'Manual resource definitions that override automatic detection.' }
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <code className="text-emerald-400 text-xs shrink-0">{item.prop}</code>
                <p className="text-xs text-zinc-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-bold text-white">Environment Variables</h3>
          <p className="text-sm text-zinc-500">
            offbyt respects standard environment variables for sensitive data.
          </p>
          <ul className="text-xs text-zinc-500 space-y-2 list-disc list-inside ml-2">
            <li><code className="text-zinc-300">offbyt_AI_KEY</code>: API key for AI-assisted mode.</li>
            <li><code className="text-zinc-300">DATABASE_URL</code>: Connection string for your database.</li>
            <li><code className="text-zinc-300">JWT_SECRET</code>: Secret key for signing tokens.</li>
          </ul>
        </section>
      </div>
    )
  },
  {
    id: 'examples',
    title: 'Examples',
    icon: <Code2 className="w-4 h-4" />,
    content: (
      <div className="space-y-12">
        <section className="space-y-4">
          <h3 className="text-2xl font-bold text-white">React CRUD App</h3>
          <p className="text-zinc-400">A simple task management application.</p>
          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
            <div>
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2">Frontend Pattern</p>
              <pre className="text-xs text-emerald-400">{`const [tasks, setTasks] = useState([]);
fetch('/api/tasks', { method: 'POST', body: JSON.stringify(newTask) });`}</pre>
            </div>
            <div>
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2">Generated Backend</p>
              <p className="text-xs text-zinc-500">Creates <code className="text-zinc-300">Task</code> model, <code className="text-zinc-300">taskController</code>, and <code className="text-zinc-300">/api/tasks</code> routes with full CRUD support.</p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-2xl font-bold text-white">Admin Dashboard</h3>
          <p className="text-zinc-400">A complex dashboard for managing users and analytics.</p>
          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
            <ul className="text-sm text-zinc-500 space-y-2">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Automatic RBAC detection</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Complex relationship mapping</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Aggregation pipeline generation</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-2xl font-bold text-white">Ecommerce App</h3>
          <p className="text-zinc-400">A full-featured store with products, cart, and orders.</p>
          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
            <p className="text-sm text-zinc-500">offbyt detects the <code className="text-zinc-300">Cart</code> context and generates session-based or database-backed cart logic automatically.</p>
          </div>
        </section>
      </div>
    )
  },
  {
    id: 'faq',
    title: 'FAQ',
    icon: <HelpCircle className="w-4 h-4" />,
    content: (
      <div className="space-y-8">
        {[
          { q: 'Is offbyt free?', a: 'Yes, the core CLI and offline mode are completely free and open-source.' },
          { q: 'Which frameworks are supported?', a: 'Currently React, Vue, and Svelte are supported for frontend. Express, Fastify, and NestJS for backend.' },
          { q: 'Can I customize generated code?', a: 'Absolutely. The generated code is standard Node.js code that you own and can modify as needed.' },
          { q: 'Does it support databases?', a: 'Yes, it supports MongoDB, PostgreSQL, MySQL, and SQLite out of the box.' },
          { q: 'Does it work offline?', a: 'Yes, the rule-based generation works entirely offline. AI mode requires an internet connection.' },
          { q: 'Is the generated backend production ready?', a: 'Yes, it includes security middleware, logging, and follows scalable architecture patterns.' }
        ].map((item, i) => (
          <div key={i} className="space-y-2">
            <h4 className="text-white font-bold flex gap-2">
              <span className="text-emerald-400">Q:</span> {item.q}
            </h4>
            <p className="text-sm text-zinc-500 pl-6">{item.a}</p>
          </div>
        ))}
      </div>
    )
  }
];
