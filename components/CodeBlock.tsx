
import React, { useState } from 'react';
import ClipboardIcon from './icons/ClipboardIcon';
import CheckIcon from './icons/CheckIcon';

interface CodeBlockProps {
  code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-800 rounded-lg my-4 overflow-hidden border border-blue-500/30">
      <div className="flex justify-between items-center px-4 py-2 bg-gray-900/50">
        <span className="text-xs font-sans text-blue-300">PowerShell Script</span>
        <button
          onClick={handleCopy}
          className="flex items-center text-xs text-gray-300 hover:text-white transition-colors duration-200"
        >
          {copied ? (
            <>
              <CheckIcon className="w-4 h-4 mr-1 text-green-400" />
              Copied!
            </>
          ) : (
            <>
              <ClipboardIcon className="w-4 h-4 mr-1" />
              Copy Code
            </>
          )}
        </button>
      </div>
      <pre className="p-4 text-sm text-gray-200 overflow-x-auto">
        <code className="font-mono">{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
