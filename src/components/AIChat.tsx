
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Send, MessageCircle, Bot, User, Lightbulb, TrendingUp, DollarSign, Target } from 'lucide-react';

interface AIChatProps {
  userProfile: any;
  onClose: () => void;
}

export const AIChat = ({ userProfile, onClose }: AIChatProps) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: `Hi ${userProfile?.name}! I'm your personal finance AI assistant. I've analyzed your profile and I'm here to help you optimize your finances. What would you like to discuss today?`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickQuestions = [
    { text: "How can I save more money?", icon: DollarSign },
    { text: "Should I invest more?", icon: TrendingUp },
    { text: "Help me budget better", icon: Target },
    { text: "Optimize my goals", icon: Lightbulb }
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage);
      const aiMessage = {
        id: messages.length + 2,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (question: string) => {
    const responses = {
      save: "Based on your spending analysis, I've identified 3 key areas where you can save more:\n\n1. **Subscriptions**: You have unused subscriptions costing $45/month\n2. **Dining**: Cooking 2 more meals at home weekly could save $120/month\n3. **Shopping**: Setting a monthly shopping budget could reduce overspending by $80/month\n\nTotal potential savings: **$245/month**! Would you like me to create a detailed action plan?",
      invest: "Your current investment strategy looks solid! Here are my recommendations:\n\n• **Increase 401k contribution** to 15% to maximize employer match\n• **Add $200/month** to your index funds for better diversification\n• **Consider REITs** (5% allocation) for portfolio balance\n\nWith your moderate risk tolerance and 20+ year timeline, this could boost your returns by 2-3% annually. Shall I show you the projected growth?",
      budget: "I've analyzed your spending patterns and created a personalized budget framework:\n\n**50/30/20 Rule Optimized for You:**\n• 50% Needs: Housing, utilities, groceries ($2,400)\n• 30% Wants: Entertainment, dining out ($1,440)\n• 20% Savings/Debt: Goals and investments ($960)\n\nYou're currently at 52/33/15 - let's adjust to hit your targets! Would you like specific strategies for each category?",
      goals: "Great question! I've reviewed your goals and here's my optimization plan:\n\n**Priority Order:**\n1. **Emergency Fund** (77% complete) - finish this first for security\n2. **House Down Payment** - on track, maintain current pace\n3. **European Vacation** - needs $240 more monthly to stay on track\n\n**Smart Move**: Redirect $200 from shopping budget to vacation fund. This keeps all goals on track while improving your financial security!"
    };

    const lowerQuestion = question.toLowerCase();
    if (lowerQuestion.includes('save') || lowerQuestion.includes('money')) return responses.save;
    if (lowerQuestion.includes('invest')) return responses.invest;
    if (lowerQuestion.includes('budget')) return responses.budget;
    if (lowerQuestion.includes('goal')) return responses.goals;

    return "I understand you want personalized financial advice. Based on your profile, I can help you with budgeting, investment strategies, goal optimization, and finding ways to save money. What specific area would you like to focus on first?";
  };

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
    handleSendMessage();
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <div>
            <h3 className="font-semibold">AI Assistant</h3>
            <p className="text-xs text-blue-100">Always here to help</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.type === 'ai' && (
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-blue-600" />
              </div>
            )}
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <div className="text-sm whitespace-pre-wrap">{message.content}</div>
              <div className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            {message.type === 'user' && (
              <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="h-4 w-4 text-purple-600" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Bot className="h-4 w-4 text-blue-600" />
            </div>
            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      {messages.length === 1 && (
        <div className="p-4 border-t bg-gray-50">
          <p className="text-sm text-gray-600 mb-3">Quick questions to get started:</p>
          <div className="grid grid-cols-2 gap-2">
            {quickQuestions.map((question, index) => {
              const IconComponent = question.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickQuestion(question.text)}
                  className="text-xs h-auto p-2 justify-start"
                >
                  <IconComponent className="h-3 w-3 mr-1" />
                  {question.text}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask me anything about your finances..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Your conversations are private and secure 🔒
        </p>
      </div>
    </div>
  );
};
