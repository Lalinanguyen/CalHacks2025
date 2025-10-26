# Development Guide

## Current Status

RepoRadar is a fully functional MVP with mock data. The application includes:
- ✅ Landing page with features and pricing
- ✅ Dashboard for managing analyses
- ✅ Results page with real-time progress tracking
- ✅ API routes for analysis workflow
- ✅ Report generation and export

## Running the Application

The dev server is currently running at: **http://localhost:3001**

```bash
npm run dev
```

## Testing the Flow

1. **Landing Page** (`/`)
   - View features, pricing, and how it works
   - Click "Get Started" or navigate to Dashboard

2. **Dashboard** (`/dashboard`)
   - Enter a GitHub repository URL (e.g., `https://github.com/facebook/react`)
   - Click "Start Analysis"
   - View previous analyses in the table

3. **Results Page** (`/results/[id]`)
   - See real-time analysis progress
   - View comprehensive report when complete
   - Download report as Markdown

## Integration Roadmap

### Priority 1: Core Integrations

#### 1. CodeRabbit Integration
**File**: `lib/services/coderabbit.service.ts`

Replace mock implementation with real CodeRabbit API:
```typescript
export async function analyzeCodeQuality(repoUrl: string) {
  const response = await fetch(`${process.env.CODERABBIT_API_URL}/analyze`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.CODERABBIT_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ repoUrl }),
  })

  return await response.json()
}
```

#### 2. Bright Data Integration
**File**: `lib/services/brightdata.service.ts`

Implement web scraping for repository context:
```typescript
export async function scrapeRepoContext(repoUrl: string) {
  // Use Bright Data proxy to scrape:
  // - Contributor profiles
  // - Star history
  // - Fork network
  // - Issue trends
}
```

#### 3. MCP Orchestration
**File**: `lib/services/mcp.service.ts`

Set up workflow automation:
```typescript
export async function orchestrateAnalysis(repoUrl: string) {
  // Coordinate all analysis steps
  // Manage state transitions
  // Handle errors and retries
}
```

### Priority 2: Database Integration

**Current**: Using mock data
**Next**: Connect to PostgreSQL

1. Update `.env.local` with real database URL
2. Run migrations:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

3. Update API routes to use Prisma:
```typescript
// app/api/analyze/route.ts
import { prisma } from '@/lib/db/prisma'

const analysis = await prisma.analysis.create({
  data: {
    userId: session.user.id,
    repoUrl,
    repoName,
    status: 'QUEUED',
  },
})
```

### Priority 3: Authentication

**Current**: Mock auth buttons
**Next**: Implement NextAuth.js

1. Install NextAuth:
```bash
npm install next-auth @auth/prisma-adapter
```

2. Create auth configuration:
```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  adapter: PrismaAdapter(prisma),
}
```

3. Protect routes with middleware

### Priority 4: Background Jobs

**Current**: Synchronous analysis
**Next**: Async processing with job queue

Options:
- BullMQ + Redis
- Inngest
- Trigger.dev

Example with BullMQ:
```typescript
// lib/jobs/analysis-queue.ts
import { Queue } from 'bullmq'

export const analysisQueue = new Queue('analysis', {
  connection: {
    host: process.env.REDIS_HOST,
    port: 6379,
  },
})

// Add job
await analysisQueue.add('analyze', { repoUrl, analysisId })
```

### Priority 5: Real-time Updates

**Current**: Polling every 5 seconds
**Next**: Server-Sent Events or WebSockets

Example with SSE:
```typescript
// app/api/analysis/[id]/stream/route.ts
export async function GET(request, { params }) {
  const stream = new ReadableStream({
    start(controller) {
      const interval = setInterval(async () => {
        const analysis = await prisma.analysis.findUnique({
          where: { id: params.id },
        })

        controller.enqueue(`data: ${JSON.stringify(analysis)}\n\n`)

        if (analysis.status === 'COMPLETE') {
          clearInterval(interval)
          controller.close()
        }
      }, 1000)
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
```

## API Endpoints to Implement

### Webhook Handler
**Path**: `/api/webhooks/postman`

For receiving callbacks from integrations:
```typescript
export async function POST(request) {
  const signature = request.headers.get('x-webhook-signature')
  const body = await request.json()

  // Verify signature
  // Update analysis status
  // Trigger next step
}
```

### Payment Integration
**Path**: `/api/payment/checkout`

For Stripe integration:
```typescript
export async function POST(request) {
  const { priceId } = await request.json()

  const session = await stripe.checkout.sessions.create({
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'payment',
    success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/pricing`,
  })

  return NextResponse.json({ url: session.url })
}
```

## Testing Checklist

- [ ] GitHub URL validation
- [ ] Analysis creation
- [ ] Progress tracking
- [ ] Report generation
- [ ] Markdown export
- [ ] Error handling
- [ ] Rate limiting
- [ ] Authentication flow
- [ ] Payment processing
- [ ] Webhook handling

## Production Deployment

### Environment Variables to Set

```bash
# Database
DATABASE_URL=

# NextAuth
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=

# GitHub OAuth
GITHUB_ID=
GITHUB_SECRET=

# Integration APIs
CODERABBIT_API_KEY=
BRIGHTDATA_API_KEY=
ELASTIC_CLOUD_ID=
# ... etc
```

### Recommended Hosting

- **Frontend**: Vercel (native Next.js support)
- **Database**: Supabase, Railway, or Neon
- **Redis**: Upstash
- **File Storage**: AWS S3 or Cloudflare R2

### Performance Optimizations

1. Enable React Server Components where possible
2. Implement Redis caching for analyses
3. Use incremental static regeneration for public pages
4. Optimize images with next/image
5. Add loading states and skeleton screens
6. Implement pagination for analyses table

## Code Quality

Run linting and type checking:
```bash
npm run lint
npm run build  # TypeScript check
```

Format code:
```bash
npx prettier --write .
```

## Monitoring & Analytics

Consider adding:
- Sentry for error tracking
- PostHog or Mixpanel for product analytics
- Vercel Analytics for performance
- LogRocket for session replay

## Support

For questions or issues, check:
- Next.js 14 App Router docs
- shadcn/ui documentation
- Prisma documentation
- Integration partner documentation
