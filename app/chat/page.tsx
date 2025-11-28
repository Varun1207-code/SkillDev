// 'use client';

// import { useState, useRef, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';

// // API key is handled server-side now (server uses Bytez SDK)
// /*
//     To run the server-side Bytez SDK, install:
//     npm i bytez.js || yarn add bytez.js

//     Example server usage:
//     import Bytez from 'bytez.js'
//     const sdk = new Bytez(process.env.BYTEZ_API_KEY)
//     const model = sdk.model('openai/gpt-4o')
//     const { output } = await model.run(messages)
// */

// type Message = {
//     id: string;
//     role: 'user' | 'assistant';
//     content: string;
// };

// export default function ChatPage() {
//     const [messages, setMessages] = useState<Message[]>([
//         {
//             id: `msg-init`,
//             role: 'assistant',
//             content: 'Hello! I am your AI study assistant. Ask me anything about Web Development or Machine Learning!'
//         }
//     ]);
//     const [input, setInput] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [model, setModel] = useState('Qwen/Qwen3-0.6B');
//     const messagesEndRef = useRef<HTMLDivElement>(null);

//     const scrollToBottom = () => {
//         messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     };

//     useEffect(() => {
//         scrollToBottom();
//     }, [messages]);

//     const idCounter = useRef(0);
//     const nextId = () => {
//         idCounter.current += 1;
//         return `msg-${idCounter.current}`;
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!input.trim() || loading) return;

//         const userMsg: Message = { id: nextId(), role: 'user', content: input };
//         const newMessages = [...messages, userMsg];
//         setMessages(newMessages);
//         setInput('');
//         setLoading(true);

//         try {
//             const res = await fetch('/api/chat', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     messages: newMessages,
//                     model: model
//                 }),
//             });

//             const data = await res.json();

//             // Defensive normalization: ensure the model response is a string
//             const normalizeResponse = (out: any): string => {
//                 if (!out) return '';
//                 if (typeof out === 'string') return out;
//                 if (Array.isArray(out)) {
//                     if (out.every((e) => typeof e === 'string')) return out.join(' ');
//                     if (out.every((e) => typeof e === 'object' && typeof e.content === 'string')) return out.map((e) => e.content).join(' ');
//                     return JSON.stringify(out);
//                 }
//                 if (typeof out === 'object') {
//                     if (typeof out.content === 'string') return out.content;
//                     if (typeof out.message === 'string') return out.message;
//                     return JSON.stringify(out);
//                 }
//                 return String(out);
//             };

//             if (res.ok) {
//                 const responseText = normalizeResponse(data?.response);
//                 setMessages(prev => [...prev, { id: nextId(), role: 'assistant', content: responseText }]);
//             } else {
//                 console.error('API error:', data.error);
//                 setMessages(prev => [...prev, { id: nextId(), role: 'assistant', content: `Error: ${data.error || 'Unknown error'}` }]);
//             }
//         } catch (err: any) {
//             console.error('Chat error:', err);
//             setMessages(prev => [...prev, { id: nextId(), role: 'assistant', content: `Error: ${err.message || 'Something went wrong'}` }]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
//             {/* Header with model selector */}
//             <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 p-4 sticky top-0 z-10">
//                 <div className="max-w-4xl mx-auto flex items-center justify-between">
//                     <div className="flex items-center space-x-2">
//                         <div className="p-2 bg-linear-to-r from-indigo-500 to-purple-500 rounded-lg">
//                             <Sparkles className="w-5 h-5 text-white" />
//                         </div>
//                         <h1 className="text-lg font-bold text-gray-900 dark:text-white">AI Assistant</h1>
//                     </div>
//                     <select
//                         value={model}
//                         onChange={e => setModel(e.target.value)}
//                         className="rounded-md border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-1"
//                     >
//                         <option value="Qwen/Qwen3-0.6B">Qwen 3 0.6B</option>
//                         <option value="meta-llama/Meta-Llama-3-8B-Instruct">Llama 3 8B</option>
//                         <option value="Qwen/Qwen2.5-7B-Instruct">Qwen 2.5 7B</option>
//                         <option value="google/gemma-2-9b-it">Gemma 2 9B</option>
//                         <option value="microsoft/Phi-3-mini-4k-instruct">Phi 3 Mini</option>
//                     </select>
//                 </div>
//             </header>

//             {/* Messages area */}
//             <div className="flex-1 overflow-y-auto p-4 sm:p-6">
//                 <div className="max-w-4xl mx-auto space-y-6">
//                     <AnimatePresence initial={false}>
//                         {messages.map((msg) => (
//                             <motion.div
//                                 key={msg.id}
//                                 initial={{ opacity: 0, y: 10 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 transition={{ duration: 0.3 }}
//                                 className={`flex items-start space-x-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
//                             >
//                                 {msg.role === 'assistant' && (
//                                     <div className="shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center border border-indigo-200 dark:border-indigo-800">
//                                         <Bot className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
//                                     </div>
//                                 )}
//                                 <div
//                                     className={`max-w-[70%] p-4 rounded-2xl shadow-sm ${msg.role === 'user'
//                                         ? 'bg-indigo-600 text-white rounded-tr-none'
//                                         : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-tl-none'}
//                   `}
//                                 >
//                                     <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">{msg.content}</p>
//                                 </div>
//                                 {msg.role === 'user' && (
//                                     <div className="shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
//                                         <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
//                                     </div>
//                                 )}
//                             </motion.div>
//                         ))}
//                     </AnimatePresence>

//                     {loading && (
//                         <motion.div
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             className="flex items-start space-x-3"
//                         >
//                             <div className="shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center border border-indigo-200 dark:border-indigo-800">
//                                 <Bot className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
//                             </div>
//                             <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-none px-5 py-4 border border-gray-100 dark:border-gray-700 shadow-sm">
//                                 <div className="flex space-x-1">
//                                     <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
//                                     <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
//                                     <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
//                                 </div>
//                             </div>
//                         </motion.div>
//                     )}
//                     <div ref={messagesEndRef} />
//                 </div>
//             </div>

//             {/* Input area */}
//             <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
//                 <div className="max-w-4xl mx-auto">
//                     <form onSubmit={handleSubmit} className="relative flex items-center">
//                         <input
//                             id="chat-input"
//                             type="text"
//                             value={input}
//                             onChange={e => setInput(e.target.value)}
//                             placeholder="Ask a question..."
//                             className="w-full pl-6 pr-14 py-4 bg-gray-100 dark:bg-gray-800 border-transparent focus:bg-white dark:focus:bg-gray-800 border focus:border-indigo-500 rounded-full focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none text-gray-900 dark:text-white placeholder-gray-500"
//                             disabled={loading}
//                         />
//                         <button
//                             type="submit"
//                             disabled={!input.trim() || loading}
//                             className="absolute right-2 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors shadow-md"
//                         >
//                             {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
//                         </button>
//                     </form>
//                     <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-3">
//                         AI can make mistakes. Check important
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// }
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';

type Message = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
};

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: `msg-init`,
            role: 'assistant',
            content: 'Hello! I am your AI study assistant. Ask me anything about Web Development or Machine Learning!'
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [model, setModel] = useState('Qwen/Qwen3-0.6B');

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const idCounter = useRef(0);
    const nextId = () => {
        idCounter.current += 1;
        return `msg-${idCounter.current}`;
    };

    const normalizeResponse = (out: any): string => {
        if (!out) return '';

        let text = '';

        if (typeof out === 'string') text = out;
        else if (typeof out === 'object') text = out.content || out.message || JSON.stringify(out);
        else text = String(out);

        // 🚀 REMOVE <think> INTERNAL REASONING
        text = text.replace(/<think>[\s\S]*?<\/think>/gi, '');

        return text.trim();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg: Message = { id: nextId(), role: 'user', content: input };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: newMessages, model }),
            });

            const data = await res.json();

            if (res.ok) {
                const responseText = normalizeResponse(data?.response);
                setMessages(prev => [...prev, { id: nextId(), role: 'assistant', content: responseText }]);
            } else {
                setMessages(prev => [...prev, { id: nextId(), role: 'assistant', content: `Error: ${data.error}` }]);
            }
        } catch (err: any) {
            setMessages(prev => [...prev, { id: nextId(), role: 'assistant', content: `Error: ${err.message}` }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
            <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 p-4 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="p-2 bg-linear-to-r from-indigo-500 to-purple-500 rounded-lg">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-lg font-bold text-gray-900 dark:text-white">AI Assistant</h1>
                    </div>

                    <select
                        value={model}
                        onChange={e => setModel(e.target.value)}
                        className="rounded-md border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-1"
                    >
                        <option value="Qwen/Qwen3-0.6B">Qwen 3 0.6B</option>
                        <option value="meta-llama/Meta-Llama-3-8B-Instruct">Llama 3 8B</option>
                        <option value="Qwen/Qwen2.5-7B-Instruct">Qwen 2.5 7B</option>
                        <option value="google/gemma-2-9b-it">Gemma 2 9B</option>
                        <option value="microsoft/Phi-3-mini-4k-instruct">Phi 3 Mini</option>
                    </select>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <div className="max-w-4xl mx-auto space-y-6">
                    <AnimatePresence initial={false}>
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className={`flex items-start space-x-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
                            >
                                {msg.role === 'assistant' && (
                                    <div className="shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center border border-indigo-200 dark:border-indigo-800">
                                        <Bot className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                )}
                                <div
                                    className={`max-w-[70%] p-4 rounded-2xl shadow-sm ${msg.role === 'user'
                                        ? 'bg-indigo-600 text-white rounded-tr-none'
                                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-tl-none'}`}
                                >
                                    <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                </div>
                                {msg.role === 'user' && (
                                    <div className="shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                        <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {loading && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start space-x-3">
                            <div className="shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center border border-indigo-200 dark:border-indigo-800">
                                <Bot className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-none px-5 py-4 border border-gray-100 dark:border-gray-700 shadow-sm">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                <div className="max-w-4xl mx-auto">
                    <form onSubmit={handleSubmit} className="relative flex items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Ask a question..."
                            className="w-full pl-6 pr-14 py-4 bg-gray-100 dark:bg-gray-800 border-transparent focus:bg-white dark:focus:bg-gray-800 border focus:border-indigo-500 rounded-full focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none text-gray-900 dark:text-white"
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || loading}
                            className="absolute right-2 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-md"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
