// This is where you should set your Groq API key
// Replace the placeholder with your actual API key
export const GROQ_API_KEY = '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';

// Groq API endpoint
export const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Default model to use
export const DEFAULT_MODEL = 'llama3-70b-8192';

// Configuration for the AI assistant
export const ASSISTANT_CONFIG = {
  temperature: 0.7,
  maxTokens: 1024,
  model: DEFAULT_MODEL,
  systemPrompt: `You are a professional coding assistant for the void IDE.
  Provide clear, accurate, and technically precise advice to help developers improve their code.
  Your responses should be formal yet accessible, focusing on best practices, efficiency, and code quality.
  Maintain a professional tone with occasional appropriate humor.
  Prioritize clarity and accuracy above all else.`
}; 