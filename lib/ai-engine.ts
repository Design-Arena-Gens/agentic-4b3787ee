import { CallConfig, CallTranscript } from '@/types/call';

export class AIEngine {
  private config: CallConfig;
  private clarificationCount: number = 0;

  constructor(config: CallConfig) {
    this.config = config;
  }

  generateOpeningStatement(): string {
    return `Hello, this is NovaCall, an AI assistant calling on behalf of Manohar Kumar Sah. ${
      this.config.recordingConsent
        ? 'For quality and training purposes, this call may be recorded. '
        : ''
    }The purpose of this call is: ${this.config.purpose}. How are you today?`;
  }

  async generateResponse(
    userInput: string,
    transcriptHistory: CallTranscript[]
  ): Promise<{
    response: string;
    shouldTransfer: boolean;
    reason?: string;
  }> {
    // Check for silence (would be handled by voice activity detection in real implementation)
    if (userInput.trim().length === 0) {
      return {
        response: "I didn't catch that. Could you please repeat?",
        shouldTransfer: false,
      };
    }

    // Check for direct request to speak with Manohar
    const transferKeywords = [
      'speak with manohar',
      'talk to manohar',
      'connect me to manohar',
      'human',
      'real person',
      'actual person',
    ];

    if (transferKeywords.some((keyword) => userInput.toLowerCase().includes(keyword))) {
      return {
        response: 'Of course, let me connect you directly with Manohar.',
        shouldTransfer: true,
        reason: 'Caller requested to speak with Manohar',
      };
    }

    // Check if question is within scope of talking points
    const isInScope = this.isQuestionInScope(userInput);

    if (!isInScope) {
      this.clarificationCount++;

      if (this.clarificationCount >= 2) {
        return {
          response:
            "I want to make sure you get the best assistance. Let me connect you directly with Manohar.",
          shouldTransfer: true,
          reason: 'Question outside prepared scope after 2 clarification attempts',
        };
      }

      return {
        response:
          "I'm helping Manohar with scheduling and follow-ups. Could you clarify your question or let me know if you'd like to speak with Manohar directly?",
        shouldTransfer: false,
      };
    }

    // Generate contextual response based on talking points
    const response = this.generateContextualResponse(userInput);

    return {
      response,
      shouldTransfer: false,
    };
  }

  private isQuestionInScope(userInput: string): boolean {
    const input = userInput.toLowerCase();

    // Check if input relates to any talking points
    return this.config.talkingPoints.some((point) => {
      const keywords = point.toLowerCase().split(' ');
      return keywords.some((keyword) => keyword.length > 3 && input.includes(keyword));
    });
  }

  private generateContextualResponse(userInput: string): string {
    const input = userInput.toLowerCase();

    // Find most relevant talking point
    let mostRelevantPoint = this.config.talkingPoints[0];
    let maxMatches = 0;

    this.config.talkingPoints.forEach((point) => {
      const keywords = point.toLowerCase().split(' ');
      const matches = keywords.filter(
        (keyword) => keyword.length > 3 && input.includes(keyword)
      ).length;

      if (matches > maxMatches) {
        maxMatches = matches;
        mostRelevantPoint = point;
      }
    });

    // Generate natural conversational response
    const conversationalPhrases = [
      'Absolutely, ',
      'Great question. ',
      'I can help with that. ',
      'Let me share this with you: ',
      'Here\'s what I can tell you: ',
    ];

    const phrase =
      conversationalPhrases[Math.floor(Math.random() * conversationalPhrases.length)];

    return `${phrase}${mostRelevantPoint}`;
  }

  generateSummary(transcripts: CallTranscript[], duration: number): string {
    const callerMessages = transcripts.filter((t) => t.speaker === 'Caller');
    const aiMessages = transcripts.filter((t) => t.speaker === 'AI');

    return `
Call Summary:
Duration: ${Math.floor(duration / 60)} minutes ${duration % 60} seconds
Purpose: ${this.config.purpose}

Key Discussion Points:
${this.config.talkingPoints.map((point, i) => `${i + 1}. ${point}`).join('\n')}

Conversation Flow:
- Total exchanges: ${transcripts.length}
- Caller responses: ${callerMessages.length}
- AI responses: ${aiMessages.length}

Outcome: Call completed successfully
    `.trim();
  }

  resetClarificationCount(): void {
    this.clarificationCount = 0;
  }
}
