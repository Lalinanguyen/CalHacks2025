import { LettaClient } from '@letta-ai/letta-client'

// connect to a local server
let client = new LettaClient({
    baseUrl: process.env.LETTA_SERVER_URL!,
});

// connect to Letta Cloud
client = new LettaClient({
    token: process.env.LETTA_API_KEY!,
    project: process.env.LETTA_PROJECT_ID!,
});

export default client