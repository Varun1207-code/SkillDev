import { NextResponse } from 'next/server';
import Bytez from 'bytez.js';

type Message = { role: 'user' | 'assistant'; content: string };

const buildMessages = (messagesPayload: any, singleMessage?: string): { msgs?: Message[]; error?: string } => {
    let m: Message[] = [];
    if (Array.isArray(messagesPayload)) m = messagesPayload;
    else if (typeof singleMessage === 'string' && singleMessage.trim()) m = [{ role: 'user', content: singleMessage } as Message];
    else m = [];

    if (m.length === 0) return { error: 'No message(s) provided' };

    for (const [i, item] of m.entries()) {
        if (!item || typeof item.content !== 'string' || !item.content.trim()) return { error: `Invalid message at index ${i}` };
        if (item.role !== 'user' && item.role !== 'assistant') return { error: `Invalid role for message at index ${i}` };
        if (item.content.length > 5000) return { error: `Message at index ${i} is too long` };
    }
    return { msgs: m };
};

const runModel = async (model: any, messagesToRun: Message[], modelId: string) => {
    try {
        const res = await model.run(messagesToRun);
        return res;
    } catch (e: any) {
        console.error('[chat API] model.run failed', { modelId, messageCount: messagesToRun.length, error: e?.message ?? e });
        throw e;
    }
};

// Normalize the model output to a single text string so the client gets a
// predictable shape (avoids React rendering objects as children).
const normalizeModelOutputToText = (output: any) => {
    if (!output) return '';
    if (typeof output === 'string') return output;
    if (Array.isArray(output)) {
        // Join string arrays or arrays of { content } objects
        if (output.every((e) => typeof e === 'string')) return output.join(' ');
        if (output.every((e) => typeof e === 'object' && typeof e.content === 'string')) return output.map((e) => e.content).join(' ');
        // Fallback: JSON stringify
        return JSON.stringify(output);
    }
    if (typeof output === 'object') {
        if (typeof output.content === 'string') return output.content;
        if (typeof output.message === 'string') return output.message;
        return JSON.stringify(output);
    }
    return String(output);
};

// NOTE: Keep API key server-side. No secret should be hard-coded for production.
const SAMPLE_KEY = '38ef7731c790c4903fd8d3813f05b319';

export async function POST(request: Request) {
    try {
        // Ensure we have an API key available (preferably from env vars)
        const envKey = process.env.BYTEZ_API_KEY;
        const apiKey = envKey ?? (process.env.NODE_ENV === 'production' ? undefined : SAMPLE_KEY);
        if (!apiKey) {
            console.error('Bytez API key is missing (BYTEZ_API_KEY)');
            return NextResponse.json({ error: 'Server misconfiguration: Bytez API key not set' }, { status: 500 });
        }

        // Create SDK per-request to be explicit and avoid global initialization during build/time.
        const sdk = new Bytez(apiKey);
        // Expect either { message: string, model?: string } or { messages: Message[], model?: string }
        const { message, messages, model: modelName } = await request.json();
        let messageCount = 0;
        if (Array.isArray(messages)) {
            messageCount = messages.length;
        } else if (message) {
            messageCount = 1;
        }
        console.debug('[chat API] modelName:', modelName, 'messages:', messageCount);

        // Build + validate message array for the model.

        const { msgs, error: validationError } = buildMessages(messages, message);
        if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });
        if (!msgs) return NextResponse.json({ error: 'No message(s) provided' }, { status: 400 });

        // Choose model – default to Qwen3-0.6B as requested.
        const modelId = modelName ?? 'Qwen/Qwen3-0.6B';
        const model = sdk.model(modelId);

        // Run the model with the full conversation history (helper above)
        const { error, output } = await runModel(model, msgs, modelId);

        if (error) {
            console.error('[chat API] Bytez error:', error);
            // Fallback to mock response for demonstration if API fails
            const mockResponse = "I'm currently having trouble connecting to my brain (Bytez API), but I can tell you that " +
                (msgs[msgs.length - 1].content.toLowerCase().includes('react') ? "React is a JavaScript library for building user interfaces." :
                    msgs[msgs.length - 1].content.toLowerCase().includes('css') ? "CSS stands for Cascading Style Sheets." :
                        "I am an AI assistant focused on Web Development and Machine Learning.");
            return NextResponse.json({ response: mockResponse }, { status: 200 });
        }

        const textResponse = normalizeModelOutputToText(output);
        return NextResponse.json({ response: textResponse }, { status: 200 });
    } catch (err: any) {
        console.error('Chat API error:', err);
        return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
    }
}
