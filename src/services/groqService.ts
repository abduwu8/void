import { GROQ_API_KEY, GROQ_API_URL, ASSISTANT_CONFIG } from '../config/api';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface CompletionRequest {
  model: string;
  messages: Message[];
  temperature: number;
  max_tokens: number;
  stream?: boolean;
}

interface CompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: Message;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class GroqService {
  private apiKey: string;
  private apiUrl: string;
  private model: string;

  constructor(apiKey = GROQ_API_KEY, apiUrl = GROQ_API_URL) {
    this.apiKey = apiKey;
    this.apiUrl = apiUrl;
    this.model = ASSISTANT_CONFIG.model;
  }

  /**
   * Set the model to use for completions
   */
  setModel(model: string): void {
    this.model = model;
  }

  /**
   * Test the connection to the API
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'user',
              content: 'Hello'
            }
          ],
          temperature: 0.7,
          max_tokens: 10
        })
      });

      return response.ok;
    } catch (error) {
      console.error('API connection test failed:', error);
      return false;
    }
  }

  /**
   * Get coding assistance based on the provided code and context
   */
  async getAssistance(code: string, language: string, context?: string): Promise<string> {
    try {
      const messages: Message[] = [
        {
          role: 'system',
          content: `You are a professional coding assistant specialized in ${language}.
          Your guidance should be technically accurate, clear, and focused on best practices.
          Provide concise, well-structured advice that helps developers write more efficient and maintainable code.
          Maintain a formal, professional tone while being approachable and occasionally using subtle, appropriate humor.
          Do not use casual language, slang, or emojis.`
        },
        {
          role: 'user',
          content: `
            I'm writing code in ${language}.
            ${context ? `Context: ${context}` : ''}
            
            Here's my current code:
            \`\`\`${language}
            ${code}
            \`\`\`
            
            Can you provide guidance, suggestions, or point out any issues? Focus on helping me improve this code.
          `
        }
      ];

      const response = await this.createCompletion({
        model: this.model,
        messages,
        temperature: ASSISTANT_CONFIG.temperature,
        max_tokens: ASSISTANT_CONFIG.maxTokens
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error getting assistance from Groq:', error);
      return 'Sorry, I encountered an error while analyzing your code. Please try again later.';
    }
  }

  /**
   * Get detailed explanation of code
   */
  async getExplanation(code: string, language: string): Promise<string> {
    try {
      const messages: Message[] = [
        {
          role: 'system',
          content: `You are a professional programming instructor with expertise in ${language}.
          Your task is to provide technically precise explanations that are clear, thorough, and educational.
          Break down complex concepts methodically using formal language that is still accessible.
          Focus on accuracy and clarity while maintaining a professional tone.
          You may use subtle, appropriate humor occasionally, but prioritize technical precision.
          Do not use casual language, slang, or emojis.`
        },
        {
          role: 'user',
          content: `
            Please explain this ${language} code in detail:
            \`\`\`${language}
            ${code}
            \`\`\`
            
            Break down how it works, explain any important concepts, and mention any best practices or improvements.
          `
        }
      ];

      const response = await this.createCompletion({
        model: this.model,
        messages,
        temperature: 0.5, // Lower temperature for more focused explanations
        max_tokens: ASSISTANT_CONFIG.maxTokens
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error getting explanation from Groq:', error);
      return 'Sorry, I encountered an error while generating the explanation. Please try again later.';
    }
  }

  /**
   * Get debug help for code
   */
  async getDebugHelp(code: string, language: string): Promise<string> {
    try {
      const messages: Message[] = [
        {
          role: 'system',
          content: `You are a professional ${language} debugging expert.
          Your task is to identify bugs, logical errors, and potential issues with technical precision.
          When appropriate, provide corrected code within markdown code blocks that fixes the identified issues.
          Use formal, technically accurate language while remaining accessible.
          You may incorporate subtle, tasteful humor occasionally, but maintain professionalism throughout.
          Do not use casual language, slang, or emojis.`
        },
        {
          role: 'user',
          content: `
            Please debug this ${language} code:
            \`\`\`${language}
            ${code}
            \`\`\`
            
            Identify any bugs or issues, explain what's wrong, and provide corrected code if possible.
          `
        }
      ];

      const response = await this.createCompletion({
        model: this.model,
        messages,
        temperature: 0.3, // Lower temperature for more precise debugging
        max_tokens: ASSISTANT_CONFIG.maxTokens
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error getting debug help from Groq:', error);
      return 'Sorry, I encountered an error while debugging. Please try again later.';
    }
  }

  /**
   * Make a request to the Groq API for a completion
   */
  private async createCompletion(request: CompletionRequest): Promise<CompletionResponse> {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq API request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  }
} 