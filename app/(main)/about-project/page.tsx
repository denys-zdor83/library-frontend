export default function AboutProjectPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 animate-fade-in">
      {/* Hero */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-5">
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-4">About This Project</h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          A full-stack library management platform built with modern web technologies, covering the entire lifecycle
          from book browsing to borrowing, with role-based access control at every layer.
        </p>
      </div>

      <div className="space-y-8">

        {/* ── Section 1: General Information ───────────────────────────── */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">General Information</h2>
          </div>

          <p className="text-slate-600 leading-relaxed mb-6">
            <strong className="text-slate-800">City Library</strong> is a web platform that digitises the workflow of a
            public library. Its goal is to let community members discover, reserve, and borrow books online — eliminating
            paper-based queues and manual record-keeping. Library staff get a dedicated management interface, and the
            administrator retains full control over who can do what.
          </p>

          <h3 className="font-semibold text-slate-800 mb-4">Roles &amp; Permissions</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                title: 'Regular User',
                color: 'bg-emerald-50 border-emerald-100',
                icon: 'text-emerald-600',
                items: [
                  'Browse and search books',
                  'Filter by genre, author, year',
                  'Add books to cart',
                  'Submit borrow requests',
                  'Track personal bookings',
                  'Rate books (1–5 stars)',
                  'Manage profile & password',
                  'Browse library events',
                ],
              },
              {
                title: 'Librarian',
                color: 'bg-indigo-50 border-indigo-100',
                icon: 'text-indigo-600',
                items: [
                  'All browsing capabilities',
                  'Add books (if permitted)',
                  'Edit book details (if permitted)',
                  'Delete books (if permitted)',
                  'View all bookings (if permitted)',
                  'Approve / reject requests',
                  'Permissions set by admin',
                ],
              },
              {
                title: 'Administrator',
                color: 'bg-blue-50 border-blue-100',
                icon: 'text-blue-600',
                items: [
                  'Full book management',
                  'Full booking management',
                  'Manage librarian accounts',
                  'Grant / revoke permissions',
                  'Access to all data',
                  'Librarian registration',
                  'Librarian deletion',
                ],
              },
            ].map((role) => (
              <div key={role.title} className={`rounded-xl border p-5 ${role.color}`}>
                <h4 className={`font-semibold mb-3 ${role.icon}`}>{role.title}</h4>
                <ul className="space-y-1.5">
                  {role.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                      <svg className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${role.icon}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-slate-50 rounded-xl">
            <h3 className="font-semibold text-slate-800 mb-2">Key Features</h3>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-sm text-slate-600">
              {[
                'Real-time book search with debounce',
                'Multi-filter sidebar (genre, author, year, status)',
                'Sort by newest, oldest, most / least popular',
                'Paginated book catalogue',
                'Shopping-cart borrow flow',
                'Star rating system per book',
                'Library events with images',
                'Admin-controlled librarian permissions',
                'HTTP-only JWT cookie authentication',
                'Auto token refresh (5-minute access token)',
              ].map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section 2: Frontend ───────────────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 bg-violet-50 rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Frontend</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mb-6">
            {[
              {
                label: 'Framework',
                value: 'Next.js 15 (App Router)',
                note: 'File-system routing, React Server Components, layout nesting, Suspense boundaries for async data.',
              },
              {
                label: 'Language',
                value: 'TypeScript — strict mode',
                note: 'All components, hooks, and utilities are fully typed. No implicit any. Shared types in /types/index.ts.',
              },
              {
                label: 'Styling',
                value: 'Tailwind CSS v4',
                note: 'Utility-first with a custom colour palette (@theme inline). Animations and skeleton screens via CSS keyframes.',
              },
              {
                label: 'State Management',
                value: 'Redux Toolkit',
                note: 'Slices for auth, cart. Async thunks for all API calls. AppInitializer restores session on page load.',
              },
              {
                label: 'HTTP Layer',
                value: 'Custom Fetch wrapper',
                note: 'Built on the native Fetch API — no Axios. Handles JSON and FormData, credentials: include, unified error shape.',
              },
              {
                label: 'Image Handling',
                value: 'Next.js Image component',
                note: 'Automatic WebP conversion, lazy loading, and size-aware srcset. Remote patterns configured per environment.',
              },
            ].map((item) => (
              <div key={item.label} className="border border-slate-100 rounded-xl p-4">
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-0.5">{item.label}</p>
                <p className="font-semibold text-slate-900 mb-1">{item.value}</p>
                <p className="text-sm text-slate-500">{item.note}</p>
              </div>
            ))}
          </div>

          <h3 className="font-semibold text-slate-800 mb-3">Architecture &amp; Patterns</h3>
          <div className="space-y-3 text-sm text-slate-600">
            {[
              {
                title: 'App Router structure',
                desc: 'Routes grouped by layout: (main) for single-column pages, (books) for the sidebar layout. Each group has its own layout.tsx.',
              },
              {
                title: 'Authentication flow',
                desc: 'HTTP-only JWT cookies set by the backend. CookieJWTAuthentication reads the token on every request. AppInitializer calls /auth/me/ on mount to rehydrate Redux from the cookie.',
              },
              {
                title: 'Permission utilities',
                desc: 'lib/permissions.ts exposes canAddBooks, canEditBooks, canDeleteBooks, canViewBookings — each returning true for admin always, or checking the librarian\'s permissions array.',
              },
              {
                title: 'UX details',
                desc: 'Debounced search (400 ms), skeleton card placeholders during fetch, fade-in animations on content arrival, portal-based modals immune to stacking-context issues.',
              },
              {
                title: 'Code quality',
                desc: 'ESLint + TypeScript strict mode enforced. Functional components only. No class components, no any types, no direct DOM manipulation outside of refs.',
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 shrink-0" />
                <p><span className="font-medium text-slate-800">{item.title} — </span>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 3: Backend ────────────────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Backend</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mb-6">
            {[
              {
                label: 'Framework',
                value: 'Django 5 + Django REST Framework',
                note: 'Class-based APIViews for every endpoint. DRF serializers handle validation, nested relations, and field-level read_only.',
              },
              {
                label: 'Database',
                value: 'PostgreSQL',
                note: 'Relational schema with Django ORM. Migrations track every schema change. JSONField stores librarian permission arrays.',
              },
              {
                label: 'Authentication',
                value: 'SimpleJWT — HTTP-only cookies',
                note: 'Access token (5 min) + refresh token (1 day). CookieJWTAuthentication reads token from cookie, never from Authorization header.',
              },
              {
                label: 'RBAC',
                value: 'Role field + LibrarianProfile',
                note: 'CustomUser.role ∈ {user, librarian, admin}. Librarians get a LibrarianProfile with a JSON permissions list managed by admins.',
              },
              {
                label: 'Media Files',
                value: 'Django FileField / ImageField',
                note: 'Book covers and user avatars stored under MEDIA_ROOT. Full URLs built with request.build_absolute_uri in serializers.',
              },
              {
                label: 'CORS & CSRF',
                value: 'django-cors-headers',
                note: 'CORS_ALLOW_CREDENTIALS=True with explicit origin allowlist. CSRF_TRUSTED_ORIGINS matches CORS origins. DRF APIView is csrf_exempt.',
              },
            ].map((item) => (
              <div key={item.label} className="border border-slate-100 rounded-xl p-4">
                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-0.5">{item.label}</p>
                <p className="font-semibold text-slate-900 mb-1">{item.value}</p>
                <p className="text-sm text-slate-500">{item.note}</p>
              </div>
            ))}
          </div>

          <h3 className="font-semibold text-slate-800 mb-3">API &amp; Security</h3>
          <div className="space-y-3 text-sm text-slate-600">
            {[
              {
                title: 'Endpoint design',
                desc: 'All routes under /api/v1/. Books, events, bookings, cart, and auth each live in their own Django app with separate urls.py. No raw SQL — exclusively Django ORM.',
              },
              {
                title: 'Token security',
                desc: 'Tokens stored in HttpOnly; Secure; SameSite=Lax cookies — inaccessible to JavaScript. Rotation on every refresh ensures a stolen refresh token is single-use.',
              },
              {
                title: 'Input validation',
                desc: 'Every write endpoint goes through a DRF serializer with explicit field types, validators, and partial=True for PATCH. Django password validators enforce strength on registration.',
              },
              {
                title: 'Permission guards',
                desc: 'IsAuthenticated as default. Librarian/admin-only views use custom IsAdmin and IsAdminOrLibrarian permission classes. Role check happens at the view layer before any DB write.',
              },
              {
                title: 'Sensitive config',
                desc: 'SECRET_KEY, DB credentials, and all environment-specific values live in a .env file loaded by python-dotenv. The file is excluded from version control via .gitignore.',
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <p><span className="font-medium text-slate-800">{item.title} — </span>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 4: Deployment ─────────────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Deployment &amp; Server</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mb-6">
            {[
              {
                label: 'Server',
                value: 'VPS — Hostinger, Ubuntu 22.04 LTS',
                note: 'A dedicated virtual private server with full root access. No container orchestration — services run directly as systemd units.',
              },
              {
                label: 'Reverse Proxy',
                value: 'Nginx',
                note: 'Terminates TLS, routes /api/ traffic to Gunicorn via Unix socket, serves Next.js via PM2 proxy, and delivers static/media files directly from disk.',
              },
              {
                label: 'Backend Process',
                value: 'Gunicorn (3 workers)',
                note: 'Managed by systemd. Binds to a Unix socket under /run/citylibrary-backend/ with correct ownership so Nginx can communicate without TCP overhead.',
              },
              {
                label: 'Frontend Process',
                value: 'PM2 + Next.js standalone',
                note: 'PM2 keeps the Node.js process alive and restarts it on crash. next build produces an optimised standalone output served on port 3000.',
              },
              {
                label: 'SSL / TLS',
                value: "Let's Encrypt — Certbot",
                note: 'Free certificates for citylibrary.denyslab.com and api-citylibrary.denyslab.com. Auto-renewal via cron. HTTPS enforced on all routes.',
              },
              {
                label: 'Database',
                value: 'PostgreSQL on the same VPS',
                note: 'Listens on localhost only — never exposed to the internet. Managed by the deploy user with a dedicated DB user and password stored in .env.',
              },
            ].map((item) => (
              <div key={item.label} className="border border-slate-100 rounded-xl p-4">
                <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-0.5">{item.label}</p>
                <p className="font-semibold text-slate-900 mb-1">{item.value}</p>
                <p className="text-sm text-slate-500">{item.note}</p>
              </div>
            ))}
          </div>

          <h3 className="font-semibold text-slate-800 mb-3">Infrastructure Details</h3>
          <div className="space-y-3 text-sm text-slate-600">
            {[
              {
                title: 'Domain setup',
                desc: 'Custom domain denyslab.com with two subdomains: citylibrary.denyslab.com (frontend) and api-citylibrary.denyslab.com (backend). DNS A records point both to the same VPS IP.',
              },
              {
                title: 'Traffic flow',
                desc: 'Browser → Nginx (443 TLS) → PM2/Next.js for page requests. Browser → Nginx (443 TLS) → Gunicorn Unix socket → Django for API requests. Media files served directly by Nginx from /media/.',
              },
              {
                title: 'Media storage',
                desc: 'Uploaded book covers and avatars saved to MEDIA_ROOT on disk. Nginx serves them under /media/ with the alias directive. The deploy user owns the directory; www-data has read access.',
              },
              {
                title: 'Process management',
                desc: 'Gunicorn is a systemd service (citylibrary-backend) that starts on boot, restarts on failure, and loads environment variables from .env via EnvironmentFile. PM2 handles the Node.js side with pm2 startup.',
              },
              {
                title: 'Deployment workflow',
                desc: 'Code is pushed to GitHub. On the server: git pull, pip install (backend) or npm install + npm run build (frontend), followed by systemctl restart or pm2 restart. No downtime tooling yet — CI/CD pipeline planned.',
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <p><span className="font-medium text-slate-800">{item.title} — </span>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tech stack summary */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Next.js 15', sub: 'Frontend framework' },
            { label: 'Django 5', sub: 'Backend framework' },
            { label: 'PostgreSQL', sub: 'Database' },
            { label: 'Nginx + PM2', sub: 'Server layer' },
          ].map((item) => (
            <div key={item.label} className="bg-blue-600 rounded-2xl p-6 text-center text-white">
              <div className="text-xl font-bold mb-1">{item.label}</div>
              <div className="text-blue-200 text-xs">{item.sub}</div>
            </div>
          ))}
        </section>

      </div>
    </div>
  );
}
