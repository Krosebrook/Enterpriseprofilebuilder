import React, { useRef, useEffect } from 'react';
import { useAgentStore } from '../hooks/useAgentStore';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Send, Trash2, Bot, User, Terminal, Loader2 } from 'lucide-react';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { Badge } from '../../../components/ui/badge';
import { integrations } from '../../../data/integrations';

export function TestPlayground() {
  const { 
    messages, addMessage, isThinking, clearChat, 
    name, role, selectedToolIds, updateConfig 
  } = useAgentStore();
  
  const [input, setInput] = React.useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isThinking]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    addMessage({ role: 'user', content: userMsg });
    updateConfig({ isThinking: true });

    // Simulate Agent Delay and Thought Process
    setTimeout(() => {
      // 1. Generate "Thought" (Simulated)
      const activeTools = integrations.filter(i => selectedToolIds.includes(i.id));
      const hasTools = activeTools.length > 0;
      
      let thoughtProcess = `Analyzing request: "${userMsg}"\n`;
      thoughtProcess += `Context: Acting as ${role}\n`;
      
      if (hasTools) {
        thoughtProcess += `Available Tools: ${activeTools.map(t => t.name).join(', ')}\n`;
        thoughtProcess += `Decision: Checking if any tool matches the intent...`;
      } else {
        thoughtProcess += `No tools available. Relying on internal knowledge.`;
      }

      // 2. Generate "Response" (Simulated)
      let response = '';
      if (userMsg.toLowerCase().includes('hello') || userMsg.toLowerCase().includes('hi')) {
        response = `Hello! I am **${name}**, your ${role}. How can I assist you today?`;
      } else if (hasTools && (userMsg.toLowerCase().includes('slack') || userMsg.toLowerCase().includes('message'))) {
        if (selectedToolIds.includes('slack')) {
          response = `I can help with that. I'll use the **Slack** tool to draft a message. What channel should I send it to?`;
        } else {
          response = `I notice you mentioned Slack, but I don't have access to the Slack tool. Please enable it in the Tools tab.`;
        }
      } else if (hasTools && (userMsg.toLowerCase().includes('jira') || userMsg.toLowerCase().includes('ticket'))) {
         if (selectedToolIds.includes('jira')) {
          response = `I'll check **Jira** for you. Are you looking for a specific ticket or creating a new one?`;
        } else {
          response = `I see you're asking about Jira tickets. Please enable the Jira tool so I can access the project board.`;
        }
      } else {
        response = `I understand. As a **${role}**, I can help you plan that out. Here is a preliminary approach based on my training...`;
      }

      updateConfig({ isThinking: false });
      addMessage({ role: 'assistant', content: response });

    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50/50">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-gray-500" />
          <span className="font-medium text-sm text-gray-700">Test Console</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={clearChat}
          className="text-gray-400 hover:text-red-500"
          title="Clear Chat"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4 bg-gray-50/30">
        <div className="space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-10 text-gray-400">
              <Bot className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="text-sm">
                Playground ready. <br/>
                Start chatting to test <strong>{name}</strong>.
              </p>
            </div>
          )}
          
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              )}
              
              <div className={`
                max-w-[80%] rounded-lg p-3 text-sm
                ${msg.role === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-white border shadow-sm text-gray-800'}
              `}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
                {msg.role === 'assistant' && selectedToolIds.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-100 flex gap-1 flex-wrap">
                    <span className="text-[10px] text-gray-400 mr-1">Active Tools:</span>
                    {integrations
                      .filter(i => selectedToolIds.includes(i.id))
                      .map(t => (
                        <Badge key={t.id} variant="secondary" className="text-[9px] px-1 h-4">
                          {t.name}
                        </Badge>
                      ))
                    }
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-gray-500" />
                </div>
              )}
            </div>
          ))}

          {isThinking && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
              </div>
              <div className="bg-white border shadow-sm rounded-lg p-3">
                <div className="flex space-x-1 h-5 items-center">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 bg-white border-t">
        <div className="flex gap-2">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${name}...`}
            className="flex-1"
            disabled={isThinking}
          />
          <Button 
            onClick={handleSend} 
            disabled={!input.trim() || isThinking}
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
