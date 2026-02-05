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

const SYSTEM_PROMPT = `You're Studio, a wallpaper designer. Chat casually.

RULES:
- MAX 2 sentences per reply
- Ask ONE question per message

FLOW:
1. React + ask about mood/vibe
2. React + ask about style (photo/illustrated/painted)
3. React + ask "Want any text on it?"
4. Say something short like "Love it!" then on THE NEXT LINE output EXACTLY:
{"prompt": "your detailed prompt here"}

IF USER WANTS TEXT: Include "with bold text reading 'THEIR_TEXT' prominently displayed"

STEP 4 EXAMPLE:
Love it, creating now!
{"prompt": "A phone wallpaper, 9:16 aspect ratio, cute lamp with funny face, whimsical painted style, soft pastels, with bold text reading 'GAIA' prominently displayed, warm cozy lighting. High quality, visually striking."}

CRITICAL: On step 4, your response MUST end with a JSON object containing "prompt". No code blocks, just the raw JSON on its own line.`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const messages: ConversationMessage[] = body.messages || [];

    if (messages.length === 0) {
      return NextResponse.json({ error: 'No messages provided' }, { status: 400 });
    }

    // Try Cloudflare Workers AI first (FREE!)
    const cfAccountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const cfApiToken = process.env.CLOUDFLARE_API_TOKEN;

    if (cfAccountId && cfApiToken) {
      try {
        const aiMessage = await callCloudflareAI(cfAccountId, cfApiToken, messages);
        return processAIResponse(aiMessage, messages);
      } catch (err) {
        console.error('Cloudflare AI error:', err);
        // Fall through to OpenAI or fallback
      }
    }

    // Try OpenAI as backup
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
      try {
        const aiMessage = await callOpenAI(openaiKey, messages);
        return processAIResponse(aiMessage, messages);
      } catch (err) {
        console.error('OpenAI chat error:', err);
      }
    }

    // Final fallback
    return NextResponse.json({
      success: true,
      data: {
        reply: "I love that idea! I'm picturing something really beautiful. Let me create it for you.",
        finalPrompt: buildFallbackPrompt(messages),
      }
    });

  } catch (error) {
    console.error('Questions API error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}

async function callCloudflareAI(accountId: string, apiToken: string, messages: ConversationMessage[]): Promise<string> {
  const chatMessages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages.map(m => ({ role: m.role, content: m.content })),
  ];

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/meta/llama-3.1-8b-instruct`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: chatMessages,
        max_tokens: 350,
        temperature: 0.7,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Cloudflare AI error: ${response.status}`);
  }

  const data = await response.json();
  return data.result?.response?.trim() || '';
}

async function callOpenAI(apiKey: string, messages: ConversationMessage[]): Promise<string> {
  const OpenAI = (await import('openai')).default;
  const openai = new OpenAI({ apiKey });

  const chatMessages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
  ];

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: chatMessages,
    max_tokens: 500,
    temperature: 0.85,
  });

  return completion.choices[0]?.message?.content?.trim() || '';
}

function processAIResponse(aiMessage: string, messages: ConversationMessage[]) {
  console.log('AI Response:', aiMessage); // Debug

  // Try multiple regex patterns to catch various formats
  let finalPrompt: string | null = null;

  // Pattern 1: Standard ```prompt block
  const pattern1 = aiMessage.match(/```prompt\s*\n?\{[\s\S]*?"prompt"\s*:\s*"([\s\S]*?)"\s*\}/);
  // Pattern 2: Just {"prompt": "..."} anywhere
  const pattern2 = aiMessage.match(/\{\s*"prompt"\s*:\s*"([\s\S]*?)"\s*\}/);
  // Pattern 3: prompt: "..." without JSON wrapper
  const pattern3 = aiMessage.match(/"prompt"\s*:\s*"([\s\S]*?)"/);

  if (pattern1) {
    finalPrompt = pattern1[1];
  } else if (pattern2) {
    finalPrompt = pattern2[1];
  } else if (pattern3) {
    finalPrompt = pattern3[1];
  }

  if (finalPrompt) {
    // Clean up the prompt
    finalPrompt = finalPrompt
      .replace(/\\n/g, ' ')
      .replace(/\\"/g, '"')
      .replace(/`/g, '')
      .trim();

    // Extract reply (everything before any prompt-related content)
    let reply = aiMessage
      .replace(/```prompt[\s\S]*$/i, '')
      .replace(/\{[\s\S]*"prompt"[\s\S]*\}[\s\S]*$/i, '')
      .trim();

    // If no reply extracted, use a default
    if (!reply || reply.includes('"prompt"')) {
      reply = "Perfect, creating that for you now!";
    }

    return NextResponse.json({
      success: true,
      data: {
        reply,
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

function buildFallbackPrompt(messages: ConversationMessage[]): string {
  const userMessages = messages.filter(m => m.role === 'user').map(m => m.content);
  const combined = userMessages.join(', ').toLowerCase();

  // Detect mood hints and enhance accordingly
  const isMoody = /dark|moody|mysterious|night|deep|shadow/i.test(combined);
  const isDreamy = /dream|soft|ethereal|gentle|peaceful|calm|serene/i.test(combined);
  const isBold = /bold|vibrant|bright|energetic|neon|pop/i.test(combined);

  let styleEnhancement = 'artistic rendering with rich detail';
  let lightingEnhancement = 'beautiful natural lighting';
  let moodEnhancement = 'visually captivating atmosphere';

  if (isMoody) {
    styleEnhancement = 'cinematic style with deep shadows and rich contrast';
    lightingEnhancement = 'dramatic low-key lighting with subtle highlights';
    moodEnhancement = 'mysterious and contemplative mood';
  } else if (isDreamy) {
    styleEnhancement = 'soft painterly style with gentle gradients';
    lightingEnhancement = 'soft diffused golden hour light';
    moodEnhancement = 'peaceful and ethereal atmosphere';
  } else if (isBold) {
    styleEnhancement = 'vivid high-contrast style with saturated colors';
    lightingEnhancement = 'bright dynamic lighting with bold shadows';
    moodEnhancement = 'energetic and striking visual impact';
  }

  return `A phone wallpaper, vertical 9:16 aspect ratio, ${combined}, ${styleEnhancement}, ${lightingEnhancement}, ${moodEnhancement}, beautiful composition with balanced elements, fine details and textures. High quality, visually striking. Safe for all audiences.`;
}
