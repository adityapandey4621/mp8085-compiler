'use client';

import { useState, useRef, useEffect } from 'react';
import { useAIAssistant } from '@/hooks/use-ai-assistant';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Send, RefreshCw, Zap, MessageCircle, LogIn, Lock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSession, signIn } from 'next-auth/react';

interface AIAssistantPanelProps {
  code?: string
  registers?: any
  flags?: any
}

export function AIAssistantPanel({ code, registers, flags }: AIAssistantPanelProps) {
  const { data: session } = useSession()
  // @ts-ignore
  const isGuest = session?.user?.id === "guest-user"
  const {
    tokens,
    messagesUsed,
    maxMessagesPerSession,
    conversation,
    loading,
    error,
    startSession,
    addTokens,
    resetSession,
    canUseAssistant,
  } = useAIAssistant();

  const [inputValue, setInputValue] = useState('');
  const [assistantType, setAssistantType] = useState<'guided' | 'review' | 'debug'>('guided');
  const [showTokenShop, setShowTokenShop] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    if (!canUseAssistant()) {
      return;
    }

    const message = inputValue;
    setInputValue('');
    await startSession(message, assistantType, {
      code: code || '',
      registers: registers || {},
      flags: flags || {}
    });
  };

  const remainingFreeMessages = maxMessagesPerSession - messagesUsed;
  const usagePercentage = (messagesUsed / maxMessagesPerSession) * 100;

  return (
    <div className="w-full space-y-4">
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 relative overflow-hidden">
        {isGuest && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-6 text-center">
            <Lock className="w-12 h-12 text-purple-600 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">AI Features Locked</h3>
            <p className="text-gray-600 mb-6 max-w-xs">
              Guest users cannot access the AI Assist features. Please sign in with Google to continue learning.
            </p>
            <Button
              onClick={() => signIn("google")}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In with Google
            </Button>
          </div>
        )}
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-purple-600" />
              <CardTitle>AI Assembly Tutor</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 rounded bg-purple-100 px-2 py-1">
                <Zap className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-semibold text-purple-700">{tokens}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTokenShop(!showTokenShop)}
              >
                Buy Tokens
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Token Shop */}
          {showTokenShop && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Purchase Tokens</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="border-yellow-300"
                    onClick={() => {
                      addTokens(5);
                      setShowTokenShop(false);
                    }}
                  >
                    5 Tokens - $1.99
                  </Button>
                  <Button
                    variant="outline"
                    className="border-yellow-300"
                    onClick={() => {
                      addTokens(20);
                      setShowTokenShop(false);
                    }}
                  >
                    20 Tokens - $5.99
                  </Button>
                </div>
                <p className="text-xs text-gray-600">
                  Each message uses 1 token. Your first message is free!
                </p>
              </CardContent>
            </Card>
          )}

          {/* Usage Status */}
          {remainingFreeMessages > 0 && tokens === 0 && (
            <Alert className="border-green-200 bg-green-50">
              <AlertCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Free trial: {remainingFreeMessages} message(s) remaining before tokens required
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          {/* Assistant Type Selection */}
          <Tabs value={assistantType} onValueChange={(val) => setAssistantType(val as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="guided">Guided Help</TabsTrigger>
              <TabsTrigger value="review">Code Review</TabsTrigger>
              <TabsTrigger value="debug">Debugging</TabsTrigger>
            </TabsList>

            <TabsContent value="guided" className="text-sm text-gray-600">
              Step-by-step guidance on learning 8085 assembly programming
            </TabsContent>
            <TabsContent value="review" className="text-sm text-gray-600">
              Get feedback on your assembly code quality and correctness
            </TabsContent>
            <TabsContent value="debug" className="text-sm text-gray-600">
              Debug your programs with step-by-step analysis
            </TabsContent>
          </Tabs>

          {/* Conversation Display */}
          <div className="max-h-[400px] space-y-3 overflow-y-auto rounded-lg bg-white p-3">
            {conversation.length === 0 && (
              <div className="flex h-[200px] flex-col items-center justify-center gap-2 text-gray-400">
                <MessageCircle className="h-8 w-8 opacity-30" />
                <p className="text-sm">Start a conversation with the AI tutor</p>
              </div>
            )}

            {conversation.map((msg, idx) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${msg.role === 'user'
                    ? 'bg-purple-100 text-purple-900'
                    : 'bg-gray-100 text-gray-900'
                    }`}
                >
                  <p className="break-words">{msg.content}</p>
                  <span className="text-xs opacity-60">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2">
                <div className="rounded-lg bg-gray-100 px-3 py-2">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500" />
                    <div className="animation-delay-100 h-2 w-2 animate-bounce rounded-full bg-gray-500" />
                    <div className="animation-delay-200 h-2 w-2 animate-bounce rounded-full bg-gray-500" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex gap-2">
            <Input
              placeholder="Ask about 8085 assembly..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={!canUseAssistant() || loading}
              className="text-sm"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!canUseAssistant() || loading || !inputValue.trim()}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* Reset Button */}
          {conversation.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={resetSession}
              className="w-full"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Start New Conversation
            </Button>
          )}

          {/* Info Text */}
          <p className="text-xs text-gray-500">
            {tokens > 0
              ? `${tokens} tokens available`
              : remainingFreeMessages > 0
                ? `${remainingFreeMessages} free message(s) left before tokens required`
                : 'Purchase tokens to continue using the AI assistant'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default AIAssistantPanel;
