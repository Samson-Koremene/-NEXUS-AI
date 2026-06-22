export type ChatMode = 'normal' | 'reasoning' | 'deep-research'

export interface ModeConfig {
  name: string
  description: string
  systemPrompt: string
  icon: string
}

export const CHAT_MODES: Record<ChatMode, ModeConfig> = {
  normal: {
    name: 'Normal',
    description: 'Standard conversational mode',
    systemPrompt: '',
    icon: '💬',
  },
  reasoning: {
    name: 'Reasoning',
    description: 'Step-by-step logical thinking with chain-of-thought',
    systemPrompt: `You are an AI assistant in REASONING mode. Before providing your final answer:

1. Break down the problem into clear steps
2. Show your thinking process explicitly
3. Consider alternative approaches
4. Verify your logic before concluding

Format your response as:

**🤔 Reasoning Process:**
[Your step-by-step thinking]

**✅ Conclusion:**
[Your final answer]

Be thorough, precise, and show all intermediate steps.`,
    icon: '💡',
  },
  'deep-research': {
    name: 'Deep Research',
    description: 'Comprehensive research with web search and synthesis',
    systemPrompt: `You are an AI assistant in DEEP RESEARCH mode. For this query:

1. Identify key topics and concepts that need investigation
2. Break down into specific research questions
3. Use web search for current information (if available)
4. Cross-reference multiple sources
5. Synthesize findings into a comprehensive answer
6. Cite sources when possible

Format your response as:

**🔍 Research Scope:**
[Topics to investigate]

**📚 Findings:**
[Detailed research results]

**💡 Synthesis:**
[Comprehensive conclusion with insights]

**📖 Sources:**
[List of references]

Be exhaustive, cite sources, and provide deep insights.`,
    icon: '🔬',
  },
}
