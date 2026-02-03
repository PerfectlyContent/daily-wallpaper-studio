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

const SYSTEM_PROMPT = `You are "Studio", a creative wallpaper design assistant. You help people design beautiful phone wallpapers through a natural, fun conversation.

Your personality: You're a friend who happens to be an incredible visual designer. You're warm, creative, and perceptive. You pick up on subtle cues in what people say and build on them. You speak naturally — short sentences, casual tone, like texting a creative friend.

HOW THE CONVERSATION WORKS:
- The user tells you what they want (could be vague like "something chill" or specific like "a neon cyberpunk city")
- You have a real conversation. React to what they say. Share your own creative ideas. Ask follow-up questions when something is unclear or when you want to explore a direction further.
- The conversation can be as short as 1-2 exchanges or as long as 5-6 — whatever feels natural. Don't rush it, but don't drag it out either.
- When you feel you have a vivid enough picture to create something amazing, tell the user you're ready and include the prompt.

WHEN YOU'RE READY TO GENERATE:
When you have enough detail to create a stunning wallpaper, end your message with a JSON block like this:

\`\`\`prompt
{"prompt": "your detailed image generation prompt here"}
\`\`\`

The prompt should be a rich, detailed description for an AI image generator. Include:
- Subject matter and scene
- Art style (photographic, illustrated, abstract, painted, etc.)
- Color palette specifics
- Mood and atmosphere
- Composition details
- Lighting

Always prefix the prompt with "A phone wallpaper, vertical 9:16 aspect ratio, " and end with ". High quality, beautiful composition, visually striking. Safe for all audiences."

CONVERSATION RULES:
- Keep each response to 1-3 short sentences
- Be specific and creative — don't ask generic questions like "what colors do you want?"
- Instead of listing options, suggest something specific and ask if they like that direction
- React genuinely to what they say — show enthusiasm, build on their ideas
- If they give you a lot of detail upfront, you might be ready after just one exchange
- If they're vague, explore more before generating
- NEVER use bullet points, numbered lists, or formal formatting
- Match your energy to theirs — moody request = moody tone, fun request = fun tone
- You're co-creating with them, not interviewing them`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const messages: ConversationMessage[] = body.messages || [];

    if (messages.length === 0) {
      return NextResponse.json({ error: 'No messages provided' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      // Fallback: no API key available
      return NextResponse.json({
        success: true,
        data: {
          reply: "I love that idea! I'm picturing something really beautiful. Let me create it for you.",
          finalPrompt: buildFallbackPrompt(messages),
        }
      });
    }

    try {
      const OpenAI = (await import('openai')).default;
      const openai = new OpenAI({ apiKey });

      const chatMessages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      ];

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: chatMessages,
        max_tokens: 300,
        temperature: 0.85,
      });

      const aiMessage = completion.choices[0]?.message?.content?.trim() || '';

      // Check if the AI included a prompt block (meaning it's ready to generate)
      const promptMatch = aiMessage.match(/```prompt\s*\n?\{[\s\S]*?"prompt"\s*:\s*"([\s\S]*?)"\s*\}\s*\n?```/);

      if (promptMatch) {
        // Extract the reply text (everything before the prompt block)
        const reply = aiMessage.replace(/```prompt[\s\S]*?```/, '').trim();
        const finalPrompt = promptMatch[1]
          .replace(/\\n/g, ' ')
          .replace(/\\"/g, '"')
          .trim();

        return NextResponse.json({
          success: true,
          data: {
            reply: reply || "Perfect — I can see it clearly now. Let me bring this to life.",
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

    } catch (err) {
      console.error('OpenAI chat error:', err);
      // Fallback on API error
      return NextResponse.json({
        success: true,
        data: {
          reply: "That sounds amazing — let me create something beautiful based on what you've told me.",
          finalPrompt: buildFallbackPrompt(messages),
        }
      });
    }

  } catch (error) {
    console.error('Questions API error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}

function buildFallbackPrompt(messages: ConversationMessage[]): string {
  const userMessages = messages.filter(m => m.role === 'user').map(m => m.content);
  const combined = userMessages.join(', ');
  return `A phone wallpaper, vertical 9:16 aspect ratio, ${combined}. High quality, beautiful composition, visually striking. Safe for all audiences.`;
}
