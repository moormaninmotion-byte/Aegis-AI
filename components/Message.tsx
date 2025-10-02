
import React from 'react';
import { Message as MessageType, Role } from '../types';
import CodeBlock from './CodeBlock';

interface MessageProps {
  message: MessageType;
}

const parseMessage = (text: string) => {
    const parts = [];
    let lastIndex = 0;
    const regex = /```powershell([\s\S]*?)```/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push({ type: 'text', content: text.substring(lastIndex, match.index) });
        }
        parts.push({ type: 'code', content: match[1].trim() });
        lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
        parts.push({ type: 'text', content: text.substring(lastIndex) });
    }

    return parts;
};


const Message: React.FC<MessageProps> = ({ message }) => {
  const isAI = message.role === Role.AI;
  const parsedParts = isAI ? parseMessage(message.text) : [{ type: 'text', content: message.text }];

  const agentAvatar = (
    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-3 flex-shrink-0">
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
    </div>
  );

  const userAvatar = (
    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center ml-3 flex-shrink-0">
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
    </div>
  );

  return (
    <div className={`flex items-start my-4 ${!isAI ? 'justify-end' : ''}`}>
      {isAI && agentAvatar}
      <div
        className={`max-w-2xl px-4 py-3 rounded-lg shadow-md ${
          isAI
            ? 'bg-gray-700 text-gray-200 rounded-tl-none'
            : 'bg-indigo-600 text-white rounded-br-none'
        }`}
      >
        <div className="prose prose-invert prose-sm max-w-none">
            {parsedParts.map((part, index) => {
                if (part.type === 'code') {
                    return <CodeBlock key={index} code={part.content} />;
                }
                // Naive link detection
                const textWithLinks = part.content.split(/(\s+)/).map((word, i) => {
                    if (word.startsWith('http://') || word.startsWith('https://')) {
                        return <a href={word} key={i} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{word}</a>;
                    }
                    return word;
                });
                return <p key={index} className="whitespace-pre-wrap">{textWithLinks}</p>;
            })}
        </div>
      </div>
      {!isAI && userAvatar}
    </div>
  );
};

export default Message;
