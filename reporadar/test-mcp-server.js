#!/usr/bin/env node

/**
 * Test script for RepoRadar GitHub Analysis MCP Server
 * This script tests the MCP server functionality locally
 */

import { spawn } from 'child_process'
import { writeFileSync } from 'fs'

// Test configuration
const TEST_CONFIG = {
  githubUrl: 'https://github.com/zhan4808/GRDB.swift',
  githubToken: process.env.GITHUB_TOKEN || 'test_token',
  mcpServerPath: './mcp-server.js'
}

// Test cases
const TEST_CASES = [
  {
    name: 'analyze_author_profile',
    args: {
      github_url: TEST_CONFIG.githubUrl,
      github_token: TEST_CONFIG.githubToken
    }
  },
  {
    name: 'analyze_repository', 
    args: {
      github_url: TEST_CONFIG.githubUrl,
      github_token: TEST_CONFIG.githubToken
    }
  },
  {
    name: 'get_repository_languages',
    args: {
      owner: 'zhan4808',
      repo: 'GRDB.swift',
      github_token: TEST_CONFIG.githubToken
    }
  },
  {
    name: 'get_user_profile',
    args: {
      username: 'zhan4808',
      github_token: TEST_CONFIG.githubToken
    }
  }
]

// MCP Protocol Messages
function createListToolsRequest() {
  return {
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/list',
    params: {}
  }
}

function createCallToolRequest(toolName: string, args: any) {
  return {
    jsonrpc: '2.0',
    id: Math.floor(Math.random() * 1000),
    method: 'tools/call',
    params: {
      name: toolName,
      arguments: args
    }
  }
}

// Test runner
async function runTests() {
  console.log('🧪 Starting RepoRadar MCP Server Tests...\n')

  // Start the MCP server
  const serverProcess = spawn('node', [TEST_CONFIG.mcpServerPath], {
    stdio: ['pipe', 'pipe', 'pipe']
  })

  let serverOutput = ''
  let serverError = ''

  serverProcess.stdout.on('data', (data) => {
    serverOutput += data.toString()
  })

  serverProcess.stderr.on('data', (data) => {
    serverError += data.toString()
  })

  // Wait for server to start
  await new Promise(resolve => setTimeout(resolve, 2000))

  try {
    // Test 1: List tools
    console.log('📋 Testing tools/list...')
    const listToolsRequest = createListToolsRequest()
    serverProcess.stdin.write(JSON.stringify(listToolsRequest) + '\n')

    await new Promise(resolve => setTimeout(resolve, 1000))

    // Test 2: Call each tool
    for (const testCase of TEST_CASES) {
      console.log(`🔧 Testing ${testCase.name}...`)
      
      const callRequest = createCallToolRequest(testCase.name, testCase.args)
      serverProcess.stdin.write(JSON.stringify(callRequest) + '\n')

      await new Promise(resolve => setTimeout(resolve, 3000))
    }

    // Wait for all responses
    await new Promise(resolve => setTimeout(resolve, 5000))

    console.log('\n📊 Test Results:')
    console.log('Server Output:', serverOutput)
    console.log('Server Error:', serverError)

    // Save results to file
    const results = {
      timestamp: new Date().toISOString(),
      testCases: TEST_CASES,
      serverOutput,
      serverError,
      success: serverOutput.includes('"result"') && !serverError.includes('Error')
    }

    writeFileSync('./mcp-test-results.json', JSON.stringify(results, null, 2))
    console.log('\n✅ Test results saved to mcp-test-results.json')

  } catch (error) {
    console.error('❌ Test failed:', error)
  } finally {
    serverProcess.kill()
  }
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(console.error)
}

export { runTests, TEST_CASES }
