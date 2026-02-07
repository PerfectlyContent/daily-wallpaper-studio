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
1. They describe their idea → React genuinely + ask what feeling/mood they want
2. They answer → Ask if they want it photorealistic, illustrated, or more artistic/painterly
3. They answer → Ask if they'd like any text/words on it, or keep it image-only
4. They answer → Say something brief like "Perfect, creating that now!" then output the prompt

CHAT GUIDELINES:
- Keep responses to 1-2 SHORT sentences
- React to what they ACTUALLY said, not generic praise
- Sound human, not like a form

WHEN READY (after exchange 4), output exactly:
[Your brief reply]

PROMPT: [detailed image generation prompt]

PROMPT ENGINEERING - THIS IS CRITICAL:
Your prompt MUST be 60-100 words and include ALL of these elements:

1. SCENE: Preserve EVERY detail from their original description - don't simplify!
2. STYLE: Add technical style terms:
   - Photorealistic: "ultra-detailed photograph, DSLR quality, sharp focus, professional photography"
   - Illustrated: "digital illustration, clean linework, vibrant colors, artstation quality"
   - Painted: "oil painting style, visible brushstrokes, rich textures, fine art quality"
3. LIGHTING: Always specify lighting ("golden hour sunlight", "soft diffused light", "dramatic rim lighting", "ethereal glow")
4. COLOR PALETTE: Mention specific colors that fit the mood
5. ATMOSPHERE: Add atmosphere words ("misty", "dreamy haze", "crisp clarity", "soft bokeh background")
6. COMPOSITION: Add composition guidance ("centered subject", "rule of thirds", "dynamic angle")
7. TEXT (if requested): "with elegant decorative text '[TEXT]' prominently displayed and fully visible"
8. QUALITY: End with "masterpiece quality, stunning detail, beautiful composition"

EXAMPLE:
User: "my daughter Ella playing in autumn leaves"
→ mood: magical → style: illustrated → text: "My Ella"

PROMPT: A joyful young girl named Ella playing in a magical swirl of autumn leaves, whimsical digital illustration style with soft glowing particles and fairy-tale charm, warm golden hour lighting filtering through trees, rich palette of amber orange crimson and gold, dreamy ethereal atmosphere with soft bokeh, centered composition with leaves dancing around her, with elegant decorative text 'My Ella' prominently displayed and fully visible, masterpiece quality, stunning detail, beautiful composition

Notice: 80+ words, specific lighting, colors, atmosphere, composition, style terms, quality keywords.`;


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
  // Rich style descriptions with technical terms
  let styleDesc = 'artistic digital art style, professional quality';
  let lightingDesc = 'beautiful natural lighting';

  if (/photo|real|realistic/i.test(style)) {
    styleDesc = 'ultra-detailed photorealistic style, DSLR photograph quality, sharp focus, professional photography, hyperrealistic';
    lightingDesc = 'cinematic lighting with natural shadows';
  } else if (/paint|painted|oil|watercolor/i.test(style)) {
    styleDesc = 'fine art oil painting style, visible expressive brushstrokes, rich canvas textures, museum quality artwork';
    lightingDesc = 'soft dramatic lighting with painterly color blending';
  } else if (/illustrat|cartoon|anime|drawn/i.test(style)) {
    styleDesc = 'polished digital illustration, clean refined linework, vibrant saturated colors, artstation trending quality';
    lightingDesc = 'stylized lighting with soft gradients';
  } else if (/stylized|artistic/i.test(style)) {
    styleDesc = 'stylized artistic rendering, creative interpretation, unique visual aesthetic';
    lightingDesc = 'artistic dramatic lighting';
  }

  // Rich mood descriptions with atmosphere, colors, and lighting
  let moodDesc = mood.toLowerCase();
  let colorPalette = 'harmonious color palette';
  let atmosphere = 'captivating atmosphere';

  if (/romantic|passion|love|intimate/i.test(mood)) {
    moodDesc = 'deeply romantic and passionate mood';
    colorPalette = 'warm rose gold, soft pinks, deep reds, and golden amber tones';
    atmosphere = 'intimate dreamy atmosphere with soft bokeh';
    lightingDesc = 'warm golden hour sunlight with gentle lens flare';
  } else if (/peaceful|calm|serene|relax/i.test(mood)) {
    moodDesc = 'peaceful and serene tranquil mood';
    colorPalette = 'soft pastels, gentle blues, sage greens, and cream whites';
    atmosphere = 'calm meditative atmosphere with soft diffused haze';
    lightingDesc = 'soft diffused natural light, gentle shadows';
  } else if (/energetic|lively|vibrant|fun|playful/i.test(mood)) {
    moodDesc = 'lively energetic and joyful mood';
    colorPalette = 'bold vibrant colors, electric blues, hot pinks, sunny yellows';
    atmosphere = 'dynamic exciting atmosphere with sense of movement';
    lightingDesc = 'bright vivid lighting with punchy contrast';
  } else if (/dark|moody|mysterious|gothic/i.test(mood)) {
    moodDesc = 'dark mysterious and atmospheric mood';
    colorPalette = 'deep blacks, midnight blues, rich purples, subtle gold accents';
    atmosphere = 'enigmatic moody atmosphere with dramatic shadows';
    lightingDesc = 'dramatic chiaroscuro lighting, deep shadows with rim light';
  } else if (/magical|mystical|dream|fantasy|enchant/i.test(mood)) {
    moodDesc = 'magical enchanting fairy-tale mood';
    colorPalette = 'ethereal purples, shimmering golds, soft teals, iridescent highlights';
    atmosphere = 'mystical dreamy atmosphere with glowing particles and soft sparkles';
    lightingDesc = 'ethereal magical glow with soft light rays';
  } else if (/cozy|warm|comfort/i.test(mood)) {
    moodDesc = 'cozy warm and comforting mood';
    colorPalette = 'warm browns, soft oranges, creamy whites, honey gold';
    atmosphere = 'inviting comfortable atmosphere with soft warmth';
    lightingDesc = 'warm ambient lighting like firelight or sunset';
  }

  // Build text instruction if user wants text
  let textInstruction = '';
  const wantsText = text && !/^(no|none|clean|nope|skip|nothing)$/i.test(text.trim());
  if (wantsText) {
    textInstruction = `, with elegant decorative text "${text}" prominently displayed and fully visible within the composition`;
  }

  return `${original}, ${styleDesc}, ${lightingDesc}, ${moodDesc}, ${colorPalette}, ${atmosphere}${textInstruction}, centered balanced composition, masterpiece quality, stunning intricate detail, beautiful artistic composition, phone wallpaper`;
}

