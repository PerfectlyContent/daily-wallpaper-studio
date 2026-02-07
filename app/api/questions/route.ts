import { NextResponse } from 'next/server';

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * True AI conversational flow.
 *
 * No rigid exchange limits. No [READY] token hacks. The LLM has a genuine
 * conversation and decides organically when it has enough context to create
 * a rich image prompt. It signals readiness by including a JSON block in its
 * response with the final prompt.
 */

const SYSTEM_PROMPT = `You're Studio, a warm creative assistant who helps design personalized phone wallpapers. Be conversational, not robotic.

YOUR GOAL: Have a natural 3-exchange chat to understand what they want, then create it.

FLOW:
1. They describe their idea → React genuinely (not generic "beautiful!") + ask what feeling/mood they want
2. They answer → Nice! Ask if they want it photorealistic, illustrated, or more artistic/painterly
3. They answer → Ask if they'd like any text/words on it, or keep it image-only
4. They answer → Say something brief like "Perfect, creating that now!" then output the prompt

IMPORTANT GUIDELINES:
- Keep responses to 1-2 SHORT sentences - don't ramble
- React to what they ACTUALLY said, not generic praise
- Don't repeat their words back at them
- Sound human, not like a form

WHEN READY (after exchange 4), output exactly:
[Your brief reply]

PROMPT: [detailed image generation prompt]

YOUR PROMPT MUST:
- Preserve ALL details from their original description (don't simplify!)
- Include the mood/feeling they specified
- Include the style they chose
- If text requested: "with elegant text '[THEIR TEXT]' integrated into the design"
- Be 40-60 words, rich with visual detail
- NOT mention aspect ratio (that's handled automatically)

EXAMPLE CONVERSATION:
User: "my daughter Ella playing in autumn leaves"
You: "Love that! Should it feel cozy and warm, playful and energetic, or more magical/dreamy?"
User: "magical"
You: "Ooh nice choice. Want it photorealistic like a photo, or more illustrated/artistic?"
User: "illustrated"
You: "Last thing - any text you want on it, or just the image?"
User: "My Ella"
You: "Perfect, creating that now!

PROMPT: A young girl named Ella joyfully playing in a swirl of golden autumn leaves, magical illustrated style with soft glowing light particles, enchanted forest atmosphere, warm amber and orange tones, whimsical fairy-tale quality, with elegant text 'My Ella' integrated into the design, dreamy ethereal mood"

Remember: Sound like a real person, not a chatbot reading a script.`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const messages: ConversationMessage[] = body.messages || [];

    if (messages.length === 0) {
      return NextResponse.json({ error: 'No messages provided' }, { status: 400 });
    }

    const googleApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
    if (!googleApiKey) {
      return NextResponse.json(
        { error: 'Chat service is not configured. Please contact support.' },
        { status: 500 }
      );
    }

    try {
      const aiMessage = await callGeminiChat(googleApiKey, messages);
      return processAIResponse(aiMessage, messages);
    } catch (err) {
      console.error('Gemini chat error:', err);
      const errorMsg = err instanceof Error ? err.message : String(err);

      if (errorMsg.includes('429') || errorMsg.includes('quota') || errorMsg.includes('rate')) {
        return NextResponse.json(
          { error: 'Too many requests. Please wait a moment and try again.' },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { error: 'Something went wrong. Please try again.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Questions API error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

async function callGeminiChat(apiKey: string, messages: ConversationMessage[]): Promise<string> {
  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: SYSTEM_PROMPT,
  });

  // Convert messages to Gemini format
  const history = messages.slice(0, -1).map(m => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.content }],
  }));

  const chat = model.startChat({ history: history as any });
  const lastMessage = messages[messages.length - 1]?.content || '';

  const result = await chat.sendMessage(lastMessage);
  return result.response.text().trim();
}


function processAIResponse(aiMessage: string, messages: ConversationMessage[]) {
  console.log('AI Response:', aiMessage); // Debug

  // Check for "PROMPT:" format (Gemini style)
  const promptMatch = aiMessage.match(/PROMPT:\s*([\s\S]+?)(?:$|(?=\n\n))/i);

  if (promptMatch) {
    const aiPrompt = promptMatch[1].trim();
    const reply = aiMessage.replace(/PROMPT:[\s\S]+$/i, '').trim() || "Love it, creating now!";

    // Use AI's prompt but ensure it has required elements
    const userMessages = messages.filter(m => m.role === 'user');
    let finalPrompt = aiPrompt;

    // If AI forgot something, supplement with our builder
    if (userMessages.length >= 4) {
      const textRequest = userMessages[3]?.content || '';
      const wantsText = textRequest && !/^(no|none|clean|nope|skip|nothing)$/i.test(textRequest.trim());

      // Check if text was requested but not in prompt
      if (wantsText && !aiPrompt.toLowerCase().includes(textRequest.toLowerCase())) {
        finalPrompt = aiPrompt.replace(/,?\s*(high quality|beautiful composition).*$/i, '') +
          `, with large decorative text displaying "${textRequest.toUpperCase()}" prominently, high quality, beautiful composition`;
      }
    }

    return NextResponse.json({
      success: true,
      data: { reply, finalPrompt }
    });
  }

  // Check for JSON format (legacy)
  const jsonMatch = aiMessage.match(/\{\s*"prompt"\s*:\s*"([\s\S]*?)"\s*\}/);
  if (jsonMatch) {
    const reply = aiMessage.replace(/\{[\s\S]*"prompt"[\s\S]*\}[\s\S]*$/i, '').trim() || "Creating now!";
    return NextResponse.json({
      success: true,
      data: { reply, finalPrompt: jsonMatch[1] }
    });
  }

  // Check if AI is ready but didn't format properly
  const isReady = /creating|let me create|love it/i.test(aiMessage) &&
                  messages.filter(m => m.role === 'user').length >= 4;

  if (isReady) {
    const userMessages = messages.filter(m => m.role === 'user');
    const originalRequest = userMessages[0]?.content || '';
    const moodVibe = userMessages[1]?.content || '';
    const style = userMessages[2]?.content || '';
    const textRequest = userMessages[3]?.content || '';
    const finalPrompt = buildPromptFromConversation(originalRequest, moodVibe, style, textRequest);

    return NextResponse.json({
      success: true,
      data: {
        reply: aiMessage.split('\n')[0] || "Creating now!",
        finalPrompt,
      }
    });
  }

  // Not ready yet — just a conversational response
  return NextResponse.json({
    success: true,
    data: {
      reply: aiMessage,
      finalPrompt: null,
    }
  });
}

function buildPromptFromConversation(original: string, mood: string, style: string, text: string): string {
  // Determine style description
  let styleDesc = 'artistic style';
  if (/photo|real|realistic/i.test(style)) {
    styleDesc = 'photorealistic style, highly detailed photograph';
  } else if (/paint|painted|oil|watercolor/i.test(style)) {
    styleDesc = 'painted artistic style, visible brushstrokes, painterly quality';
  } else if (/illustrat|cartoon|anime|drawn/i.test(style)) {
    styleDesc = 'illustrated style, artistic illustration';
  } else if (/stylized/i.test(style)) {
    styleDesc = 'stylized artistic rendering';
  }

  // Determine mood description
  let moodDesc = mood.toLowerCase();
  if (/romantic|passion|love|intimate/i.test(mood)) {
    moodDesc = 'romantic and passionate atmosphere, warm intimate mood';
  } else if (/peaceful|calm|serene|relax/i.test(mood)) {
    moodDesc = 'peaceful and serene atmosphere, calming mood';
  } else if (/energetic|lively|vibrant|fun/i.test(mood)) {
    moodDesc = 'lively and energetic atmosphere, vibrant mood';
  } else if (/dark|moody|mysterious/i.test(mood)) {
    moodDesc = 'dark and mysterious atmosphere, moody lighting';
  } else if (/magical|mystical|dream/i.test(mood)) {
    moodDesc = 'magical and mystical atmosphere, dreamy quality';
  }

  // Build text instruction if user wants text
  let textInstruction = '';
  const wantsText = text && !/^(no|none|clean|nope|skip|nothing)$/i.test(text.trim());
  if (wantsText) {
    textInstruction = `. Include decorative text "${text.toUpperCase()}" sized to fit completely within the image width`;
  }

  return `Create a phone wallpaper image in 9:16 vertical aspect ratio. Scene: ${original}. Style: ${styleDesc}. Mood: ${moodDesc}${textInstruction}. Make it beautiful, high quality, and visually striking.`;
}

