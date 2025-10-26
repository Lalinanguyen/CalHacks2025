# Floating Chat Widget - User Guide

## Overview

The AI-powered chat assistant is now available as a floating widget in the bottom-right corner of every page in the RepoRadar app!

## How to Use

### Opening the Chat

1. **Look for the chat button** in the bottom-right corner of any page
   - It's a blue circular button with a message icon
   - The button follows you as you scroll

2. **Click the button** to open the chat window
   - The chat window slides up from the bottom-right
   - Size: 400px wide × 600px tall

### Chat Window Features

#### Header Controls
- **Minimize button** (−) - Collapse the chat to just the header
- **Close button** (×) - Close the chat window completely

#### Chat Area
- **Message history** - See your full conversation
- **Auto-scrolling** - Automatically scrolls to latest messages
- **Timestamps** - Each message shows when it was sent

#### Quick Questions
- **Suggested questions** appear below the chat
- Click any suggestion to send it instantly
- Questions adapt based on available analysis data

#### Message Input
- Type your question in the input box
- Press **Enter** to send (or click the send button)
- The AI responds in seconds

### Notifications

When the chat is closed:
- New AI responses show a **red notification badge**
- The badge shows the count of unread messages
- Badge disappears when you open the chat

### States

1. **Closed** - Just the floating button visible
2. **Open** - Full chat window displayed
3. **Minimized** - Header only (conversation hidden but active)

## What You Can Ask

The chatbot can help with:

### General Questions (No Analysis Required)
- "What can you help me with?"
- "How do you analyze market fit?"
- "What factors do you consider for investments?"

### Analysis-Specific Questions (After Running Analysis)
- "What is the market fit for this startup?"
- "Should I invest in this startup?"
- "What are the main risks I should be aware of?"
- "How does the technical quality compare?"
- "Tell me about the founder's background"
- "How competitive is this market?"
- "What improvements would increase the score?"
- "What makes this a strong/weak investment?"

## Context Awareness

The chatbot becomes smarter when analysis data is available:

### With Analysis Context
When you've run an analysis, the chatbot has access to:
- **Technical metrics** - Code quality, test coverage, contributors
- **Market data** - Market size, competitors, trends, opportunities, risks
- **Founder info** - Experience, credibility, expertise
- **Investment scores** - Overall score, grade, recommendations

### Without Analysis Context
- Still helpful with general questions
- Explains how the platform works
- Guides you on what to analyze

## Tips for Best Results

1. **Be specific** - "What are the technical risks?" is better than "Tell me about risks"
2. **Ask follow-ups** - The chatbot remembers your conversation
3. **Use suggestions** - They're tailored to your analysis results
4. **Review before asking** - Check if the info is already in the analysis report

## Example Conversations

### Example 1: Understanding Market Fit

**You:** "What is the market fit for this startup?"

**AI:** "Based on the analysis, the market size is $50B Global Market. Key opportunities identified include: Underserved mid-market segment, International expansion potential. This indicates strong market potential."

**You:** "How competitive is it?"

**AI:** "The main competitors identified are: CompanyA, CompanyB, CompanyC. Understanding the competitive landscape is crucial for market positioning."

### Example 2: Investment Decision

**You:** "Should I invest in this startup?"

**AI:** "The startup received an investment grade of B+ with an overall score of 83/100. Promising investment opportunity with strong technical foundation and experienced team. Monitor competitive landscape closely."

**You:** "What are the next steps?"

**AI:** "Recommended next steps include: Conduct detailed competitive analysis, Validate go-to-market strategy, Review financial projections and unit economics, Schedule follow-up due diligence meeting."

## Technical Details

### Component Architecture
- **Global availability** - Integrated in `app/layout.tsx`
- **Client-side rendering** - Uses React hooks for state management
- **API integration** - Connects to `/api/chat` endpoint
- **Responsive** - Works on desktop (mobile coming soon)

### Performance
- **Lightweight** - No impact when closed
- **Fast responses** - Sub-second for keyword-based answers
- **Efficient** - Only loads when opened

### Privacy
- **Session-based** - Conversations stored in browser only
- **No tracking** - Messages not sent to external services (unless LLM API integrated)
- **Secure** - All communication over HTTPS

## Customization Options

### For Developers

Change the appearance by modifying `floating-chat-widget.tsx`:

```tsx
// Change position
className="fixed bottom-6 right-6"  // Default
// Options: top-6, left-6, etc.

// Change size
className="w-[400px] h-[600px]"  // Default
// Adjust to your needs

// Change colors
// Uses theme colors from Tailwind config
```

### Integration with Analysis Results

When viewing analysis results, the chatbot automatically receives:
- Full technical analysis
- Complete market research
- Founder profile data
- Investment recommendations

You can pass custom context:

```tsx
<FloatingChatWidget
  analysisContext={{
    technical: { /* your data */ },
    market: { /* your data */ },
    founder: { /* your data */ },
    report: { /* your data */ }
  }}
/>
```

## Keyboard Shortcuts

- **Enter** - Send message
- **Shift+Enter** - New line (coming soon)
- **Esc** - Close chat (coming soon)

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Troubleshooting

### Chat button not appearing
- Check if JavaScript is enabled
- Clear browser cache and reload
- Verify you're on a supported browser

### Messages not sending
- Check your internet connection
- Refresh the page
- Try again in a few seconds

### Slow responses
- Check your network speed
- Server might be processing a complex query
- Try a simpler question first

### Chat window too small/large
- This is configurable by developers
- Current size: 400×600px
- Report preferences to your team

## Future Enhancements

Coming soon:
- 🎤 Voice input/output
- 📱 Mobile-optimized version
- 💾 Conversation history persistence
- 🌍 Multi-language support
- 📊 Data visualization in responses
- 🔗 Share conversation links
- 📥 Export conversations
- 🎨 Theme customization

## Feedback

Found a bug or have a suggestion?
- File an issue on the project repository
- Contact the development team
- Use the feedback form (coming soon)

---

**Enjoy your AI-powered assistant!** 🤖✨

The chatbot is here to help you make better investment decisions by understanding startup market fit and potential.
