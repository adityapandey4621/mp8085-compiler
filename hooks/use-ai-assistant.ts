import { useState, useEffect } from 'react';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface AIAssistantState {
  tokens: number;
  messagesUsed: number;
  maxMessagesPerSession: number;
  sessionActive: boolean;
  conversation: Message[];
  loading: boolean;
  error: string | null;
}

export interface AIContext {
  code: string;
  registers: any;
  flags: any;
}

const AI_INSTRUCTIONS = {
  GUIDED_HELP: `You are an 8085 microprocessor assembly language instructor. Help the user write 8085 assembly code step by step.
1. Understand what they want to accomplish
2. Ask clarifying questions if needed
3. Guide them through the logic and register usage
4. Provide correct opcodes and addressing modes
5. Explain each instruction's function and effect on flags
6. Point out common mistakes and best practices

Focus on educational guidance rather than just providing code directly.`,

  CODE_REVIEW: `Review the user's 8085 assembly code and provide:
1. Correctness of syntax and opcodes
2. Logic flow and potential bugs
3. Register usage optimization
4. Memory addressing issues
5. Flag operations and their consequences
Provide constructive feedback to help improve their code.`,

  DEBUGGING: `Help the user debug their 8085 assembly program:
1. Identify the issue based on their description
2. Ask about register values, memory contents, and flag states
3. Suggest test cases and debugging approaches
4. Walk through execution step by step if needed
5. Point out off-by-one errors, register overwrites, etc.`,
};

export const useAIAssistant = () => {
  const [state, setState] = useState<AIAssistantState>({
    tokens: 0,
    messagesUsed: 0,
    maxMessagesPerSession: 1, // Only 1 usage before needing tokens
    sessionActive: false,
    conversation: [],
    loading: false,
    error: null,
  });

  // Load state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('aiAssistantState');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState((prev) => ({
          ...prev,
          tokens: parsed.tokens || 0,
          messagesUsed: parsed.messagesUsed || 0,
        }));
      } catch (e) {
        console.error('Failed to load saved state:', e);
      }
    }
  }, []);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem(
      'aiAssistantState',
      JSON.stringify({
        tokens: state.tokens,
        messagesUsed: state.messagesUsed,
      })
    );
  }, [state.tokens, state.messagesUsed]);

  const canUseAssistant = (): boolean => {
    return state.tokens > 0 || state.messagesUsed < state.maxMessagesPerSession;
  };

  const startSession = async (
    userMessage: string,
    assistantType: 'guided' | 'review' | 'debug' = 'guided',
    context?: AIContext
  ): Promise<string | null> => {
    if (!canUseAssistant()) {
      setState((prev) => ({
        ...prev,
        error: 'No tokens available. Please purchase tokens to continue.',
      }));
      return null;
    }

    if (state.messagesUsed >= state.maxMessagesPerSession && state.tokens === 0) {
      setState((prev) => ({
        ...prev,
        error: 'Free session used. Please purchase tokens to continue.',
      }));
      return null;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      // Create the conversation history for the AI
      const messages = [
        {
          role: 'user' as const,
          content: userMessage,
        },
      ];

      // Call the API (you would integrate with actual AI service)
      const response = await callAIService(userMessage, assistantType, state.conversation, context);

      if (!response) {
        throw new Error('Failed to get response from AI service');
      }

      // Update state
      setState((prev) => {
        const newMessagesUsed = prev.tokens > 0 ? prev.messagesUsed : prev.messagesUsed + 1;
        const newTokens = prev.tokens > 0 ? Math.max(0, prev.tokens - 1) : prev.tokens;

        return {
          ...prev,
          tokens: newTokens,
          messagesUsed: newMessagesUsed,
          sessionActive: true,
          conversation: [
            ...prev.conversation,
            {
              id: Date.now() + '_user',
              role: 'user',
              content: userMessage,
              timestamp: Date.now(),
            },
            {
              id: Date.now() + '_assistant',
              role: 'assistant',
              content: response,
              timestamp: Date.now(),
            },
          ],
          loading: false,
        };
      });

      return response;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      }));
      return null;
    }
  };

  const addTokens = (amount: number): void => {
    setState((prev) => ({
      ...prev,
      tokens: prev.tokens + amount,
    }));
  };

  const resetSession = (): void => {
    setState((prev) => ({
      ...prev,
      conversation: [],
      sessionActive: false,
      error: null,
    }));
  };

  return {
    ...state,
    startSession,
    addTokens,
    resetSession,
    canUseAssistant,
  };
};

// Simulated AI service call (replace with actual API)
async function callAIService(
  userMessage: string,
  assistantType: 'guided' | 'review' | 'debug',
  conversationHistory: Message[],
  context?: AIContext
): Promise<string> {
  // This is a placeholder. In production, this would call your actual AI service
  // For now, return helpful guidance based on the assistant type

  const systemPrompt = {
    guided: AI_INSTRUCTIONS.GUIDED_HELP,
    review: AI_INSTRUCTIONS.CODE_REVIEW,
    debug: AI_INSTRUCTIONS.DEBUGGING,
  }[assistantType];

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Return placeholder response (in production, this would be from your API)
  return generateAssistantResponse(userMessage, assistantType, context);
}

function generateAssistantResponse(
  userMessage: string,
  assistantType: 'guided' | 'review' | 'debug',
  context?: AIContext
): string {
  const lowerMessage = userMessage.toLowerCase();

  if (assistantType === 'guided') {
    if (lowerMessage.includes('mvi')) {
      return `Great! You want to learn about the MVI (Move Immediate) instruction. 
      
MVI is used to load an 8-bit immediate value into a register. 
Format: MVI register, data

The instruction:
1. Takes 2 bytes (1 opcode + 1 data byte)
2. Takes 7 clock cycles
3. Loads the immediate value directly into the specified register
4. Does NOT affect any flags

Example: MVI A, 42H    ; Load 42 hex into accumulator

Can you tell me which register you want to load the value into? And what value do you want to load?`;
    }

    if (lowerMessage.includes('add') || lowerMessage.includes('arithmetic')) {
      return `Good question about arithmetic instructions!

The 8085 has several arithmetic instructions:

**ADD register** - Add register to A
**ADI data** - Add immediate value to A  
**SUB register** - Subtract register from A
**SUI data** - Subtract immediate value from A
**INR register** - Increment register (adds 1)
**DCR register** - Decrement register (subtracts 1)

All these instructions affect the flags: Z, S, P, CY, and AC

What specific arithmetic operation are you trying to do? For example, are you trying to add two numbers together, or perform some calculation?`;
    }

    return `I'm here to help you learn 8085 assembly programming!

You can ask me about:
1. **Specific instructions** (MOV, MVI, ADD, SUB, JMP, CALL, etc.)
2. **Register operations** and addressing modes
3. **Logic flow** - how to structure your program
4. **Flags** and how they work
5. **Memory addressing** techniques

What would you like to learn about today?`;
  }

  if (assistantType === 'review') {
    if (context && context.code) {
      return `Code Review Analysis for your current code:

✓ **Structure:**
- Found ${context.code.split('\n').filter(l => l.trim() && !l.trim().startsWith(';')).length} lines of code.

⚠️ **Suggestions:**
- Ensure you have a HLT instruction at the end.
- Check if you are initializing registers before use.

Would you like me to analyze a specific part of your code?`;
    }

    if (lowerMessage.includes('MVI') || lowerMessage.includes('ADD')) {
      return `Code Review Analysis:

✓ **Correct Elements:**
- Instruction syntax appears correct
- Register usage follows addressing mode rules

⚠️ **Suggestions:**
- Consider the order of operations
- Ensure all used registers are initialized
- Check if you need to save/restore register values

Could you share your complete code snippet for a more detailed review?`;
    }

    return `Please paste the 8085 assembly code you'd like me to review. Include:
1. The assembly instructions
2. What you're trying to accomplish
3. Any errors or unexpected behavior

I'll analyze it for:
- Correctness of syntax and opcodes
- Logic flow and potential bugs
- Register usage and optimization
- Flag operations`;
  }

  if (assistantType === 'debug') {
    if (context) {
      return `Debug Helper: Analyzing current state...

**Current Registers:**
A: ${context.registers.A || '00'} | B: ${context.registers.B || '00'} | C: ${context.registers.C || '00'}
DE: ${context.registers.D}${context.registers.E} | HL: ${context.registers.H}${context.registers.L}
PC: ${context.registers.PC} | SP: ${context.registers.SP}

**Flags:**
Z: ${context.flags.Z} | S: ${context.flags.S} | CY: ${context.flags.CY}

Based on this state, what specific issue are you observing? The registers show the values above.`;
    }

    return `Debug Helper: Let's figure out what's wrong!

To help you debug, I need to know:
1. **What's the expected behavior?** What should the program do?
2. **What's happening instead?** What's the actual behavior?
3. **Register values** - What are the values in A, B, C, etc.?
4. **Memory contents** - What's in memory at key addresses?
5. **Flags status** - What are the Zero, Carry, Sign flags?

Share these details and I'll help you find the issue!`;
  }

  return 'How can I help you with 8085 assembly programming?';
}
