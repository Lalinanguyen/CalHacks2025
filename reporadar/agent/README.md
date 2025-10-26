# RepoRadar Central Agent Coordinator

## Overview

The Central Agent Coordinator is the orchestration layer that coordinates 3 specialized MCP (Model Context Protocol) servers to provide comprehensive startup analysis for RepoRadar.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Central Agent Coordinator                   │
│                  (coordinator.ts)                        │
└─────────────────────────────────────────────────────────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
           ▼               ▼               ▼
    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │ GitHub   │    │ Market   │    │ Founder  │
    │ MCP      │    │ MCP      │    │ MCP      │
    │ :3001    │    │ :3002    │    │ :3003    │
    └──────────┘    └──────────┘    └──────────┘
           │               │               │
           └───────────────┼───────────────┘
                           │
                           ▼
                 ┌─────────────────┐
                 │ Report Generator │
                 └─────────────────┘
```

## Components

### 1. Central Coordinator (`coordinator.ts`)

**Purpose**: Orchestrates parallel analysis across all MCP servers and synthesizes results.

**Key Functions**:
- `analyzeStartup()` - Main analysis orchestrator
- `analyzeStartupWithRetry()` - Fault-tolerant version with exponential backoff

**Flow**:
1. Initialize MCP client connections in parallel
2. Execute analysis requests to all 3 servers simultaneously
3. Collect results from all servers
4. Pass to report generator for synthesis
5. Return comprehensive analysis

### 2. MCP Clients (`/lib/mcp-clients/`)

#### GitHub Client (`github-client.ts`)
- **Port**: 3001
- **Purpose**: Technical repository analysis
- **Methods**:
  - `analyze(repoUrl)` - Full repository analysis
  - `getMetrics(repoUrl)` - Detailed metrics
- **Output**: Code quality, commit activity, contributors, test coverage, issues

#### Market Client (`market-client.ts`)
- **Port**: 3002
- **Purpose**: Market intelligence and competitive analysis
- **Methods**:
  - `research(productName)` - Market research
  - `analyzeCompetitors()` - Competitor analysis
  - `getTrends(industry)` - Market trends
- **Output**: Market size, competitors, trends, opportunities, risks

#### Founder Client (`founder-client.ts`)
- **Port**: 3003
- **Purpose**: Founder background and credibility analysis
- **Methods**:
  - `profile(founderName)` - Founder profiling
  - `getVentures()` - Previous ventures
  - `getNetworkStrength()` - Network analysis
- **Output**: Experience, education, expertise, credibility score

### 3. Report Generator (`/lib/report-generator.ts`)

**Purpose**: Synthesizes raw analysis data into actionable insights.

**Output Structure**:
```typescript
{
  sections: {
    technical: ReportSection,
    market: ReportSection,
    founder: ReportSection
  },
  overallScore: number (0-100),
  investmentGrade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F',
  recommendation: string,
  keyTakeaways: string[],
  nextSteps: string[]
}
```

**Scoring Algorithm**:
- Technical: 40% weight
- Market: 35% weight
- Founder: 25% weight

### 4. API Endpoint (`/app/api/analyze/route.ts`)

**POST /api/analyze**
```json
{
  "repoUrl": "https://github.com/owner/repo",
  "founderName": "John Doe",
  "productName": "MyStartup"
}
```

**Response**:
```json
{
  "success": true,
  "timestamp": "2025-01-26T12:00:00Z",
  "input": { ... },
  "data": {
    "technical": { ... },
    "market": { ... },
    "founder": { ... }
  },
  "report": { ... }
}
```

**GET /api/analyze**
Health check endpoint that returns MCP server connectivity status.

## Environment Variables

Add to `.env.local`:

```bash
GITHUB_MCP_URL="http://localhost:3001"
MARKET_MCP_URL="http://localhost:3002"
FOUNDER_MCP_URL="http://localhost:3003"
```

## Usage

### Basic Analysis
```typescript
import { analyzeStartup } from '@/agent/coordinator';

const results = await analyzeStartup(
  'https://github.com/username/repo',
  'Founder Name',
  'Product Name'
);
```

### With Retry Logic
```typescript
import { analyzeStartupWithRetry } from '@/agent/coordinator';

const results = await analyzeStartupWithRetry({
  repoUrl: 'https://github.com/username/repo',
  founderName: 'Founder Name',
  productName: 'Product Name'
});
```

### Via API
```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "repoUrl": "https://github.com/username/repo",
    "founderName": "Founder Name",
    "productName": "Product Name"
  }'
```

## Development Mode

Currently, all MCP clients include fallback mock data for development when MCP servers are not running. This allows:

1. **Testing the coordinator logic** without actual MCP servers
2. **Frontend development** with realistic data
3. **API testing** without external dependencies

To disable mock mode and use real MCP servers:
1. Start your MCP servers on the configured ports
2. Remove the try-catch fallback logic in each client
3. Ensure proper MCP server transport configuration

## Next Steps

1. **Implement actual MCP servers** for GitHub, Market, and Founder analysis
2. **Configure MCP transport** (stdio, HTTP, or other protocols)
3. **Database integration** - Save analysis results to Prisma
4. **Background jobs** - Process long-running analyses asynchronously
5. **Webhooks** - Notify when analysis completes
6. **Caching** - Cache MCP responses for faster repeated queries

## Error Handling

The coordinator includes comprehensive error handling:

- **Connection failures**: Graceful fallback to mock data in dev mode
- **Timeout protection**: 60-second max duration for API routes
- **Retry logic**: Exponential backoff for transient failures
- **Validation**: Input validation for all required fields

## Performance

- **Parallel execution**: All 3 MCP servers queried simultaneously
- **Expected latency**: ~2-5 seconds for full analysis (depends on MCP servers)
- **Optimization**: Consider caching frequently requested analyses

## Testing

```bash
# Test health endpoint
curl http://localhost:3000/api/analyze

# Test full analysis
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d @test-data.json
```

## Troubleshooting

**Issue**: MCP clients failing to connect
- **Solution**: Check that MCP servers are running on configured ports
- **Solution**: Verify environment variables are loaded
- **Solution**: Check network connectivity and firewall rules

**Issue**: Timeout errors
- **Solution**: Increase `maxDuration` in route.ts
- **Solution**: Optimize MCP server response times
- **Solution**: Use background job processing for long analyses
