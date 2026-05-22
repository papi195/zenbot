import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest } from 'next/server';
import {
  SYSTEM_PROMPT,
  CRISIS_REPLY,
  isCrisisMessage,
  buildGeminiHistory,
  type ChatMessage,
} from '@/lib/chat-prompt';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

function sseLine(payload: object): string {
  return `data: ${JSON.stringify(payload)}\n\n`;
}

export async function POST(req: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (payload: object) => {
        controller.enqueue(encoder.encode(sseLine(payload)));
      };

      try {
        const { messages } = (await req.json()) as { messages: ChatMessage[] };
        const lastMessage = messages[messages.length - 1];

        if (isCrisisMessage(lastMessage.content)) {
          send({ text: CRISIS_REPLY, isCrisis: true });
          send({ done: true });
          controller.close();
          return;
        }

        const model = genAI.getGenerativeModel({
          model: 'gemini-2.5-flash',
          systemInstruction: SYSTEM_PROMPT,
        });

        const history = buildGeminiHistory(messages);
        const chat = model.startChat({ history });

        let attempts = 0;
        let resultStream;

        while (attempts < 3) {
          try {
            resultStream = await chat.sendMessageStream(lastMessage.content);
            break;
          } catch (err: unknown) {
            attempts++;
            if (attempts === 3) throw err;
            await new Promise((res) => setTimeout(res, 2000 * attempts));
          }
        }

        for await (const chunk of resultStream!.stream) {
          try {
            const text = chunk.text();
            if (text) send({ text });
          } catch {
            /* chunk has no text */
          }
        }

        send({ done: true });
        controller.close();
      } catch (error) {
        console.error('Gemini API error:', error);
        send({
          error: 'I am having trouble responding right now. Please try again in a moment.',
        });
        send({ done: true });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
