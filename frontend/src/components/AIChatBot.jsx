// ============================================================
//  AIChatBot Component – Simple UI for AI Chat
// ============================================================
import React, { useState, useEffect, useRef } from 'react';

export default function AIChatBot({ onClose }) {
  const [messages, setMessages] = useState([
    { text: "Hi! I'm Synaptix, your AI Mentor. How can I help you today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const newMessages = [...messages, { text: input, sender: 'user' }];
    setMessages(newMessages);
    setInput('');

    // Simulate bot response
    setTimeout(() => {
      const lowerInput = input.toLowerCase();
      let response = "Synaptix here! I'm your AI demo mentor. I can help you find courses, clear doubts, or build a learning path.";
      
      if (lowerInput.includes("react") || lowerInput.includes("frontend")) {
        response = "We have an excellent React 19 track spanning over 40 hours. You'll learn hooks, server components, and Next.js!";
      } else if (lowerInput.includes("python") || lowerInput.includes("data") || lowerInput.includes("ai")) {
        response = "For AI and Data Science, we highly recommend our Generative AI & ML Bootcamp! It covers Python, LangChain, and RAG.";
      } else if (lowerInput.includes("cost") || lowerInput.includes("price") || lowerInput.includes("free")) {
        response = "We offer both free courses (like SQL Basics) and premium bootcamps starting around ₹3,000. Check the All Courses page!";
      } else if (lowerInput.includes("certificate")) {
        response = "Yes! Every premium course comes with a verified LearnFlow certificate that you can add directly to LinkedIn.";
      } else if (lowerInput.includes("doubt") || lowerInput.includes("help") || lowerInput.includes("question")) {
        response = "Feel free to ask any technical doubts here! If it's a 1-on-1 requirement, our live sessions provide great interactivity.";
      } else if (lowerInput.includes("course") || lowerInput.includes("learn")) {
        response = "Use the Search bar at the top or visit 'All Courses' to explore. We have 1,200+ courses across UI/UX, Web Dev, DevOps, and more!";
      }

      setMessages(prev => [
        ...prev, 
        { text: response, sender: 'bot' }
      ]);
    }, 1000);
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '350px',
      height: '500px',
      background: 'var(--bg-card, #1a1a2e)',
      borderRadius: '16px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 9999,
      overflow: 'hidden',
      border: '1px solid var(--border-subtle, rgba(255,255,255,0.1))',
      animation: 'slideUp 0.3s ease'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        background: 'var(--bg-surface, #12122a)',
        borderBottom: '1px solid var(--border-subtle, rgba(255,255,255,0.1))',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1, #3b82f6)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v4" /><path d="m4.93 4.93 2.83 2.83" /><path d="M22 12h-4" /><path d="m19.07 19.07-2.83-2.83" /><path d="M12 22v-4" /><path d="m4.93 19.07 2.83-2.83" /><path d="M2 12h4" /><path d="m7.76 7.76-2.83-2.83" />
              <path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
            </svg>
          </span>
          <div>
            <div style={{ fontWeight: 700, color: '#fff', fontSize: '1rem', letterSpacing: '0.02em' }}>Synaptix AI</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary, #aaa)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }}></span>
              Ready to help
            </div>
          </div>
        </div>
        <button 
          onClick={onClose}
          style={{
            background: 'transparent', border: 'none', color: '#aaa', fontSize: '1.2rem', cursor: 'pointer'
          }}
        >✕</button>
      </div>

      {/* Messages area */}
      <div style={{
        flex: 1,
        padding: '16px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            background: msg.sender === 'user' ? 'var(--accent-1, #3b82f6)' : 'var(--bg-surface, #12122a)',
            color: '#fff',
            padding: '10px 14px',
            borderRadius: msg.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
            maxWidth: '85%',
            fontSize: '0.9rem',
            lineHeight: 1.4,
            border: msg.sender === 'bot' ? '1px solid var(--border-subtle, rgba(255,255,255,0.1))' : 'none'
          }}>
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <form onSubmit={handleSend} style={{
        padding: '16px',
        borderTop: '1px solid var(--border-subtle, rgba(255,255,255,0.1))',
        display: 'flex',
        gap: '8px',
        background: 'var(--bg-card, #1a1a2e)'
      }}>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: '20px',
            border: '1px solid var(--border-subtle, rgba(255,255,255,0.2))',
            background: 'var(--bg-surface, #12122a)',
            color: '#fff',
            outline: 'none'
          }}
        />
        <button type="submit" style={{
          background: 'var(--accent-1, #3b82f6)',
          border: 'none',
          borderRadius: '50%',
          width: '38px',
          height: '38px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#fff'
        }}>
          ↑
        </button>
      </form>
      <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
      `}</style>
    </div>
  );
}
