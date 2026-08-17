import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Sparkles,
  X,
  Send,
  Loader2,
  TrendingUp,
  Truck,
  Stethoscope,
  ChevronRight,
  MessageSquare,
  Radio
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { apiFetch } from '../../api/client';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  groundedData?: any;
  suggestedActions?: string[];
  time: string;
}

export const KrishiSahayakChat: React.FC = () => {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message
  useEffect(() => {
    const welcomeText =
      language === 'mr'
        ? 'नमस्कार! मी **कृषी सहायक** 🌾 — तुमचा स्मार्ट शेती AI साथी. मी थेट मंडी बाजारभाव, वाहतूक खर्च अंदाज, पीक रोग निदान आणि चालू लिलावात मदत करू शकतो. विचारा!'
        : language === 'hi'
        ? 'नमस्ते! मैं हूँ **कृषि सहायक** 🌾 — आपका स्मार्ट डिजिटल खेती साथी। मैं आपको लाइव मंडी भाव, ट्रांसपोर्ट किराया, फसल रोग निदान और लाइव बोलियों में मदद कर सकता हूँ। पूछिए!'
        : 'Hello! I am **Krishi Sahayak** 🌾 — your AI agricultural copilot. I can help you with live mandi rates, transport freight quotes, disease diagnostics, and your live bidding auctions. Ask me anything!';

    setMessages([
      {
        id: 'welcome',
        sender: 'assistant',
        text: welcomeText,
        suggestedActions: [
          t.chatbot.quickPrompts.mandiRate,
          t.chatbot.quickPrompts.transportCost,
          t.chatbot.quickPrompts.diseaseCare,
        ],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [language]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery.trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await apiFetch<{
        answer: string;
        language: string;
        suggested_actions: string[];
        grounded_data: any;
      }>('/chatbot/ask', {
        method: 'POST',
        body: JSON.stringify({
          query,
          language,
        }),
      });

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: res.answer,
        groundedData: res.grounded_data,
        suggestedActions: res.suggested_actions,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: 'Unable to reach knowledge database right now. Please verify server connection.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 px-5 py-3.5 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 text-slate-950 font-black shadow-2xl shadow-emerald-950/80 hover:scale-105 active:scale-95 transition-all glow-agro border border-emerald-300/40"
        >
          <div className="relative">
            <Bot className="w-6 h-6 animate-bounce-subtle" />
            <Sparkles className="w-3.5 h-3.5 text-amber-300 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <span className="text-xs tracking-tight font-black hidden sm:inline">
            {t.chatbot.title}
          </span>
          <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-slate-950/80 text-emerald-300 border border-emerald-400/40">
            AI 2.0
          </span>
        </button>
      )}

      {/* Expanded Chat Drawer */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[430px] h-[560px] max-h-[85vh] rounded-3xl glass-panel shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="p-4 glass-card border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-xs">
                    {t.chatbot.title}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <p className="text-[10px] opacity-75 truncate max-w-[220px]">
                  {t.chatbot.subtitle}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl opacity-60 hover:opacity-100 hover:bg-white/10 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                      isUser
                        ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-br-none shadow-md shadow-emerald-950 font-medium'
                        : 'glass-card rounded-bl-none shadow-sm'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{m.text}</div>

                    {/* Grounded Transport Card */}
                    {m.groundedData?.transport && (
                      <div className="mt-2.5 p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 space-y-1">
                        <div className="font-black flex items-center gap-1.5">
                          <Truck className="w-4 h-4" />
                          <span>
                            {m.groundedData.transport.recommended_vehicle}
                          </span>
                        </div>
                        <div className="text-[11px] opacity-90">
                          Estimated Cost: ₹{m.groundedData.transport.recommended_cost}
                        </div>
                      </div>
                    )}

                    {/* Grounded Mandi Prices Card */}
                    {m.groundedData?.mandi_prices && (
                      <div className="mt-2.5 grid grid-cols-2 gap-2">
                        {m.groundedData.mandi_prices.map((p: any, idx: number) => (
                          <div
                            key={idx}
                            className="p-2 rounded-xl glass-card border-emerald-500/30 text-[10px]"
                          >
                            <span className="font-bold opacity-80 block truncate">
                              {p.mandi}
                            </span>
                            <span className="text-emerald-400 font-black">
                              ₹{p.price}/Qtl
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <span className="text-[9px] opacity-50 mt-1 px-1">
                    {m.time}
                  </span>

                  {/* Suggestion action pills */}
                  {m.suggestedActions && m.suggestedActions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {m.suggestedActions.map((act, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(act)}
                          className="px-3 py-1 rounded-full glass-card hover:border-emerald-500/50 hover:bg-emerald-500/20 text-[10px] text-emerald-300 font-bold transition-all"
                        >
                          {act}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs opacity-75 italic">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                <span>Krishi Sahayak is checking live APMC knowledgebase...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3.5 glass-card border-t border-white/10">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder={t.chatbot.askPlaceholder}
                className="flex-1 px-3.5 py-2.5 rounded-2xl glass-card focus:outline-none focus:border-emerald-500 text-xs placeholder:opacity-50"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || isLoading}
                className="p-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-40 text-slate-950 font-black transition-all shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
