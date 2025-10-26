# DueDeck

An AI-powered tool that analyzes GitHub repositories with comprehensive code quality insights, security scanning, and repository intelligence.

## ✅ Completed Phases

### Phase 1: Landing Page & Core UI ✅

#### Project Setup
- Next.js 14 with TypeScript (strict mode)
- App Router architecture
- Tailwind CSS + shadcn/ui components
- Prisma ORM with PostgreSQL schema
- Environment variable structure for all integrations
- ESLint configuration with custom rules

#### Landing Page Components
- **Navigation**: Logo, links to Dashboard/Pricing/How It Works, Sign In/Sign Up buttons
- **Hero Section**:
  - Compelling headline
  - GitHub URL input with validation
  - "Analyze Repository" CTA button
  - Trust indicators
- **Features Section**: 3 feature cards:
  - Code Quality Analysis
  - Security & Vulnerability Scanning
  - Repository Intelligence
- **How It Works**: 4-step process visualization
- **Pricing Section**: 3 tiers (Free, Pro, Enterprise)
- **Footer**: Navigation links and legal info

#### Service Layer Stubs
All integration services with mock implementations:
- `brightdata.service.ts` - Repository context scraping
- `coderabbit.service.ts` - Code quality analysis
- `elastic.service.ts` - Repository indexing
- `mcp.service.ts` - Analysis orchestration
- `letta.service.ts` - Memory-powered AI agent
- `sierra.service.ts` - Report generation
- `fetchai.service.ts` - Autonomous data fetchers

#### Database Schema
Prisma schema with:
- User model (GitHub OAuth support, plan tiers)
- Analysis model (repo data, status tracking, report URL)
- Plan enum (FREE, PRO, ENTERPRISE)
- Status enum (QUEUED, ANALYZING, GENERATING, COMPLETE, FAILED)

---

### Phase 2: Repository Analysis Dashboard ✅

#### Dashboard Page (`/dashboard`)
- Repository input form with GitHub URL validation
- Previous analyses table with:
  - Repository name and URL
  - Status badges
  - Code quality scores with visual progress bars
  - Security ratings
  - Action buttons (View Report/View Progress)

#### Components
- `RepoInputForm` - Form to start new analysis
- `AnalysesTable` - Table showing analysis history
- `AnalysisStatus` - Real-time progress tracker

---

### Phase 4: API Routes ✅

#### Implemented Endpoints

**POST /api/analyze**
- Accepts GitHub repository URL
- Validates URL format
- Orchestrates analysis workflow
- Returns analysis ID and job ID

**GET /api/analysis/[id]**
- Fetches analysis status and progress
- Returns step-by-step progress information
- Includes code quality score and security rating

**GET /api/reports/[id]**
- Generates and returns comprehensive report
- Returns markdown-formatted analysis

---

### Phase 5: Results Display ✅

#### Results Page (`/results/[id]`)
- Real-time analysis status tracker with:
  - Overall progress bar
  - Individual step progress
  - Status indicators (pending, running, complete, failed)
- Auto-polling for live updates (5-second intervals)
- Comprehensive report viewer

#### Report Viewer Component
- Key metrics dashboard:
  - Code Quality Score (0-100 with visual progress)
  - Security Rating badge
  - Analysis completion date
- Download options:
  - Markdown export
  - PDF export (placeholder)
- Full report with formatted markdown

---

## Project Structure

```
/app
  /page.tsx                     # Landing page
  /(dashboard)
    /dashboard/page.tsx         # Main dashboard
    /results/[id]/page.tsx      # Analysis results
  /api
    /analyze/route.ts           # Start analysis
    /analysis/[id]/route.ts     # Get analysis status
    /reports/[id]/route.ts      # Get report
/components
  /ui                           # shadcn components
  /landing                      # Landing page sections
  /dashboard                    # Dashboard components
  /results                      # Results display components
/lib
  /services                     # Integration service stubs
  /db                           # Prisma client
  /utils                        # Helper functions
/prisma
  /schema.prisma                # Database schema
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (optional - can use mock data)

### Installation

1. Install dependencies:
```bash
cd duedeck
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

3. (Optional) Set up the database:
```bash
npx prisma generate
npx prisma db push
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3001](http://localhost:3001) in your browser.

### Available Routes

- `/` - Landing page
- `/dashboard` - Analysis dashboard
- `/results/[id]` - View analysis results
- `/api/analyze` - POST endpoint to start analysis
- `/api/analysis/[id]` - GET endpoint for analysis status
- `/api/reports/[id]` - GET endpoint for generated report

---

## Features

### Current Features (Mock Data)
✅ GitHub repository URL validation
✅ Analysis workflow orchestration
✅ Real-time progress tracking
✅ Code quality scoring (0-100)
✅ Security vulnerability detection
✅ Repository metrics collection
✅ Markdown report generation
✅ Report export (Markdown)
✅ Analysis history

### Integration Points (Ready for Real APIs)
- Bright Data - Web scraping and proxy services
- CodeRabbit - Code quality and security analysis
- Elasticsearch - Data indexing and search
- MCP - Workflow orchestration
- Letta - Context-aware AI agent
- Sierra - Content generation
- Fetch.ai - Autonomous data collection agents

---

## Next Steps

### Phase 3: Connect Real APIs
- Replace mock data with real API calls
- Implement authentication with NextAuth.js
- Connect to PostgreSQL database
- Set up background job processing

### Phase 6: Admin Dashboard
- Analytics dashboard with charts
- User management
- Export functionality
- Revenue tracking

### Additional Enhancements
- Add React Query for better data fetching
- Implement Server-Sent Events for real-time updates
- Add Stripe payment integration
- Implement rate limiting with Upstash Redis
- Add webhook handlers for async processing
- PDF report generation

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Database**: PostgreSQL + Prisma
- **Auth**: NextAuth.js (to be configured)

## License

MIT
