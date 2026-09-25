import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Image as ImageIcon, Paperclip, MoreHorizontal, Loader2, FileText, CheckCircle2 } from 'lucide-react';

function Chatbot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Hello! I am your AI Assistant. How can I help you with your projects today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newUserMessage = {
      id: Date.now(),
      type: 'user',
      text: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setInputValue('');
    setIsTyping(true);

    try {
      const openAiMessages = [
        {
          role: 'system',
          content: 'You are a helpful AI assistant. Answer concisely and remember the context. If the user provides a message containing "[Attached File: ...]", the text that follows is the EXACT extracted content of that file. You must treat this text as the file content and use it to answer the user. Do NOT say you cannot open or read files, because the text has already been extracted and provided to you.'
        },
        ...updatedMessages.map(msg => ({
          role: msg.type === 'bot' ? 'assistant' : 'user',
          content: msg.text + (msg.hiddenContext || '')
        }))
      ];

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: openAiMessages
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const botReplyText = data.choices[0].message.content;

      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        text: botReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error fetching OpenAI response:', error);
      const errorResponse = {
        id: Date.now() + 1,
        type: 'bot',
        text: "Sorry, I'm having trouble connecting to my brain right now. Please check the console for details.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsTyping(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8080/api/files/extract-text', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!res.ok) throw new Error('Failed to extract text from file');

      const data = await res.json();
      const extractedText = data.text || '';

      let textContent = extractedText.trim();
      if (!textContent) {
        textContent = "[Lỗi: Không trích xuất được văn bản nào từ file này. File có thể là ảnh, định dạng không được hỗ trợ, hoặc rỗng.]";
      } else {
        textContent = textContent.substring(0, 15000);
      }

      const fileMessage = {
        id: Date.now(),
        type: 'user',
        text: `Đã đính kèm tài liệu:\n${file.name}`,
        hiddenContext: `\n\n[START OF ATTACHED FILE CONTENT]\n${textContent}\n[END OF ATTACHED FILE CONTENT]`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const botAck = {
        id: Date.now() + 1,
        type: 'bot',
        text: `I have successfully read the file '${file.name}'. What would you like me to do with it?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, fileMessage, botAck]);
    } catch (err) {
      console.error(err);
      const errorResponse = {
        id: Date.now() + 1,
        type: 'bot',
        text: "Sorry, I couldn't read that file. Ensure the backend is running and the file is supported.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
      e.target.value = null;
    }
  };

  // Background pattern component (Subtle geometric wireframe)
  const BackgroundPattern = () => (
    <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 overflow-hidden">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hexagons" width="50" height="43.4" patternUnits="userSpaceOnUse">
            <path d="M25 0 L50 14.5 L50 43.4 L25 28.9 Z" fill="none" stroke="#000" strokeWidth="1" />
            <path d="M0 14.5 L25 0 L25 28.9 L0 43.4 Z" fill="none" stroke="#000" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexagons)" />
      </svg>
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] w-full relative -m-6 bg-[#f8fafc]">
      <BackgroundPattern />

      {/* Floating Header */}
      <div className="absolute top-4 left-4 right-4 z-20">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200/60 p-3 flex items-center justify-between">
          <div className="flex items-center gap-3 pl-1">
            <div className="relative">
              <div className="w-10 h-10 bg-[#e0f2fe] rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#0ea5e9]" />
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#22c55e] border-2 border-white rounded-full"></div>
            </div>
            <div className="flex flex-col">
              <h2 className="text-[15px] font-bold text-slate-800 leading-tight">AI Nexus</h2>
              <p className="text-[12px] text-slate-500 font-medium leading-tight">Always online to help you</p>
            </div>
          </div>
          <button className="p-2 mr-1 text-slate-400 hover:text-slate-600 transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 pt-28 pb-32 z-10 scrollbar-hide flex flex-col space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-3 ${msg.type === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in duration-300`}>

            {/* Avatar */}
            <div className={`relative w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.type === 'user'
              ? 'bg-[#38bdf8] border-2 border-white'
              : 'bg-[#f1f5f9] border border-slate-200'
              }`}>
              {msg.type === 'user' ? (
                <User className="w-5 h-5 text-white" />
              ) : (
                <Bot className="w-5 h-5 text-slate-700" />
              )}
            </div>

            {/* Bubble */}
            <div className={`group relative max-w-[80%] rounded-2xl p-4 shadow-sm ${msg.type === 'user'
              ? 'bg-gradient-to-r from-[#4ca1e0] to-[#519ce0] text-white rounded-tr-md'
              : 'bg-white text-slate-800 border border-slate-200 rounded-tl-md'
              }`}>
              {msg.text.includes('Đã đính kèm tài liệu:') ? (
                <div className="flex items-center gap-3 bg-white/10 p-2.5 rounded-xl border border-white/20">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Paperclip className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="text-[11px] text-white/80 font-semibold uppercase tracking-wider mb-0.5">Attached Document</p>
                    <p className="text-[14px] font-medium leading-tight truncate text-white" title={msg.text.replace('📎 Đã đính kèm tài liệu:\n', '').replace('Đã đính kèm tài liệu:\n', '').replace(/\*\*/g, '')}>
                      {msg.text.replace('📎 Đã đính kèm tài liệu:\n', '').replace('Đã đính kèm tài liệu:\n', '').replace(/\*\*/g, '')}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              )}
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-start gap-3 animate-in fade-in duration-300">
            <div className="relative w-10 h-10 rounded-full bg-[#f1f5f9] border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Bot className="w-5 h-5 text-slate-700" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-md px-5 py-4 shadow-sm flex gap-1.5 items-center h-[52px]">
              <div className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Floating Input Area */}
      <div className="absolute bottom-6 left-4 right-4 z-20">
        <form onSubmit={handleSendMessage} className="relative flex items-center bg-[#0f172a] rounded-[1.75rem] p-1.5 shadow-xl border border-slate-800">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".txt,.pdf,.doc,.docx,.xls,.xlsx,.csv"
          />

          <div className="flex items-center gap-1 px-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-slate-800"
              title="Attach Document"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            <button
              type="button"
              className="p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-slate-800"
              title="Upload Image"
            >
              <ImageIcon className="w-5 h-5" />
            </button>
          </div>

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask AI Nexus about your report, summarize it, or ask for analysis..."
            className="flex-1 bg-transparent text-white text-[15px] font-medium p-3 outline-none placeholder-slate-400 min-w-0"
          />

          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="w-12 h-12 ml-2 flex items-center justify-center bg-gradient-to-tr from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 disabled:from-slate-700 disabled:to-slate-700 text-white rounded-full shadow-lg transition-transform transform active:scale-95 disabled:scale-100 flex-shrink-0 border-2 border-[#0f172a]"
          >
            {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 ml-[-2px]" />}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chatbot;
