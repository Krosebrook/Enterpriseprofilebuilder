import React, { useRef, useEffect, useState } from 'react';
import { useAgentStore } from '../hooks/useAgentStore';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Send, Trash2, Bot, User, Terminal, Loader2, ChevronDown, ChevronRight, Activity, Database, CheckCircle2 } from 'lucide-react';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { Badge } from '../../../components/ui/badge';
import { integrations } from '../../../data/integrations';
import { AgentExecutor, ExecutionStep } from '../../../lib/agents/executor';

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

    try {
      // Instantiate Executor
      const executor = new AgentExecutor(name, role, selectedToolIds);
      const result = await executor.execute(userMsg);

      // Add "Thinking" steps as a special system message or attach to the assistant message
      // For now, we'll format them into the response or create a structured message
      // But the store expects string content. 
      // Let's format the thought process as a blockquote or similar in the content
      // OR better yet, we can modify the store to accept 'steps' but I don't want to break the store contract.
      // So I will append the thought process as a formatted string.
      
      // Actually, let's keep it simple: Just render the final response. 
      // But wait, the user wants "Context Engineered Prompts" (from previous turn) or "Next 3 features" (this turn).
      // The "Next 3 features" implies better functionality. 
      // I will render the thoughts in the UI by parsing them or adding them to the message object if I could.
      // Since I can't change the store type easily without breaking other files, I'll store the steps in a local state 
      // map keyed by message ID? No, that's complex.
      // I'll just append them to the content with a special delimiter or just show them.
      
      // Let's construct a rich response:
      let richResponse = "";
      
      // Thoughts
      const thoughts = result.steps.filter(s => s.type === 'thought' || s.type === 'action');
      if (thoughts.length > 0) {
        richResponse += `:::thoughts\n${JSON.stringify(thoughts)}\n:::\n`;
      }
      
      richResponse += result.finalResponse;

      addMessage({ role: 'assistant', content: richResponse });

    } catch (error) {
      addMessage({ role: 'assistant', content: "Error executing agent: " + error });
    } finally {
      updateConfig({ isThinking: false });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Helper to parse content for thoughts
  const parseContent = (content: string) => {
    const thoughtMatch = content.match(/:::thoughts\n([\s\S]*?)\n:::/);
    if (thoughtMatch) {
      const steps = JSON.parse(thoughtMatch[1]) as ExecutionStep[];
      const cleanContent = content.replace(thoughtMatch[0], '').trim();
      return { steps, cleanContent };
    }
    return { steps: [], cleanContent: content };
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
          
          {messages.map((msg) => {
            const { steps, cleanContent } = parseContent(msg.content);
            
            return (
              <div 
                key={msg.id} 
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                )}
                
                <div className={`max-w-[90%] space-y-2`}>
                  {/* Render Thoughts if any */}
                  {steps.length > 0 && (
                    <div className="bg-white border rounded-md p-2 text-xs text-gray-500 space-y-2 mb-2">
                       <div className="flex items-center gap-1 font-semibold text-gray-400 uppercase tracking-wider text-[10px]">
                         <Activity className="w-3 h-3" /> Agent Reasoning
                       </div>
                       {steps.map((step, idx) => (
                         <div key={idx} className="pl-2 border-l-2 border-gray-200">
                           <div className="font-medium text-[10px] text-gray-400 mb-0.5 uppercase">{step.type}</div>
                           <div className="whitespace-pre-wrap">{step.content}</div>
                           {step.metadata && (
                             <pre className="mt-1 bg-gray-50 p-1 rounded text-[10px] overflow-x-auto">
                               {JSON.stringify(step.metadata, null, 2)}
                             </pre>
                           )}
                         </div>
                       ))}
                    </div>
                  )}

                  <div className={`
                    rounded-lg p-3 text-sm shadow-sm
                    ${msg.role === 'user' 
                      ? 'bg-primary text-primary-foreground ml-auto w-fit' 
                      : 'bg-white border text-gray-800'}
                  `}>
                    <p className="whitespace-pre-wrap">{cleanContent}</p>
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
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-gray-500" />
                  </div>
                )}
              </div>
            );
          })}

          {isThinking && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
              </div>
              <div className="bg-white border shadow-sm rounded-lg p-3">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="animate-pulse">Thinking</span>
                  <div className="flex space-x-1 h-2 items-center">
                    <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                  </div>
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
