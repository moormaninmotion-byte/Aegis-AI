
import { useState, useCallback, useEffect } from 'react';
import { Message, Role } from '../types';
import { sendMessageToAI } from '../services/geminiService';

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Send initial message from AI on component mount
    const fetchInitialMessage = async () => {
        setIsLoading(true);
        try {
            const aiResponse = await sendMessageToAI("Hello, introduce yourself.");
            setMessages([
                {
                    id: 'init-1',
                    role: Role.AI,
                    text: aiResponse,
                },
            ]);
        } catch (error) {
            setMessages([
                {
                    id: 'init-error',
                    role: Role.AI,
                    text: "I am Aegis, your personal AI security agent. I seem to be having trouble connecting to my core systems. Please check your API key and refresh.",
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };
    
    fetchInitialMessage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      text,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);

    try {
      const aiResponse = await sendMessageToAI(text);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: Role.AI,
        text: aiResponse,
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: Role.AI,
        text: "I'm sorry, but I've encountered an error. Please try again later.",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { messages, isLoading, sendMessage };
};
