import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `You are ZenBot, a compassionate mental health awareness 
chatbot designed specifically to support university students in Nigeria and across Africa.

Your role:
- Listen empathetically and validate the student's feelings without judgment
- Provide psychoeducation about anxiety, depression, stress, and academic burnout
- Suggest practical, evidence-based coping strategies such as deep breathing, 
  journaling, exercise, and talking to someone trusted
- Be culturally sensitive to African university student experiences such as 
  family pressure, financial stress, ASUU strikes, and hostel life
- Always respond in a warm, caring, non-judgmental, and supportive tone
- Keep responses concise and conversational, not too long
- Occasionally ask follow-up questions to better understand how the student is feeling

IMPORTANT SAFETY RULE: You are NOT a licensed therapist or medical professional. 
Never diagnose anyone. If a user expresses thoughts of suicide, self-harm, or says 
they want to hurt themselves or others, ALWAYS respond with empathy first, then 
immediately provide these crisis resources:
- Mentally Aware Nigeria Initiative: 0800-1000-6464 (free, 24/7)
- LASUTH Psychiatric Unit Lagos: +234-1-793-0000
- Tell them to speak to their university counsellor or go to the student health centre`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    // Crisis detection check
    const lastMessage = messages[messages.length - 1].content.toLowerCase();
    const crisisKeywords = [
      'kill myself', 'suicide', 'want to die', 'end my life',
      'hurt myself', 'self harm', 'no reason to live', 'better off dead',
    ];

    const isCrisis = crisisKeywords.some((kw) => lastMessage.includes(kw));

    if (isCrisis) {
      return NextResponse.json({
        reply: `I'm really glad you reached out, and I want you to know that what you're feeling matters deeply. You are not alone in this.\n\nPlease reach out to someone who can really help right now:\n\n📞 Mentally Aware Nigeria: 0800-1000-6464 (free, 24/7)\n📞 LASUTH Psychiatric Unit: +234-1-793-0000\n\nYou can also walk into your university's student health centre or talk to a trusted lecturer or counsellor today. You deserve real support. 💚`,
        isCrisis: true,
      });
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: SYSTEM_PROMPT,
    });

    // Build chat history — skip the first assistant welcome message
    // Gemini requires history to start with a 'user' message
    const history = messages
      .slice(0, -1)
      .filter((_: any, index: number) => index !== 0)
      .map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      }));

    const chat = model.startChat({ history });

    // Send with retry logic for 503 overload errors
    let result;
    let attempts = 0;
    while (attempts < 3) {
      try {
        result = await chat.sendMessage(messages[messages.length - 1].content);
        break;
      } catch (err: any) {
        attempts++;
        if (attempts === 3) throw err;
        await new Promise((res) => setTimeout(res, 2000 * attempts));
      }
    }

    const reply = result!.response.text();
    return NextResponse.json({ reply });

  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json(
      { reply: 'I am having trouble responding right now. Please try again in a moment.' },
      { status: 500 }
    );
  }
}