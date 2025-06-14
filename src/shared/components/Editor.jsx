
import React, { useState, useRef, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';

const Tokens = {
  keywords: [
    "arambha", "systummm", "bihari_sramik", "ghoshit_kar", "nishchit_kar",
    "yadi", "anyatha_yadi", "anyatha", "prati_ghatak", "yatha", "viram",
    "agla_ghaatak", "prakashit_kar"
  ],
  operators: [
    "==", "!=", "<=", ">=", "&&", "ca", "va", "na", "satya", "asatya",
    "chintan", "||", "=", "<", ">", "+", "-", "*", "/", "%", "!"
  ],
  symbols: ["(", ")", "{", "}", ",", ";"],
  comments: ["//", "/*", "*/"]
};

const CodeEditor = ({
  value = "",
  onChange = () => {},
  height = "410px",
  width = "100%",
  borderRadius = "8px",
  fileName = "script.bihari",
  placeholder = "// Write your Bihari code here...",
  showLineNumbers = true,
  className = "",
  showCopyButton = true,
  readOnly = false,
  wordWrap = false
}) => {
  const [code, setCode] = useState(value);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef(null);
  const highlightRef = useRef(null);
  const lineNumbersRef = useRef(null);

  useEffect(() => {
    setCode(value);
  }, [value]);

  useEffect(() => {
    if (textareaRef.current && highlightRef.current && lineNumbersRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, [code]);

  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);
    onChange(newCode);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);
      onChange(newCode);
      
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2;
      }, 0);
    }
  };

  const handleScroll = (e) => {
    if (highlightRef.current) {
      highlightRef.current.scrollTop = e.target.scrollTop;
      highlightRef.current.scrollLeft = e.target.scrollLeft;
    }
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.target.scrollTop;
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const getLineNumbers = () => {
    const lines = code.split('\n');
    return lines.map((_, index) => index + 1);
  };

  const parseCodeWithComments = (code) => {
    const result = [];
    const lines = code.split('\n');
    let inMultiLineComment = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      let processedLine = [];
      let currentPos = 0;
      
      while (currentPos < line.length) {
        // Check if we're starting or ending a multi-line comment
        if (!inMultiLineComment && line.substr(currentPos, 2) === '/*') {
          inMultiLineComment = true;
          const endPos = line.indexOf('*/', currentPos + 2);
          if (endPos !== -1) {
            // Multi-line comment starts and ends on same line
            processedLine.push({
              type: 'comment',
              content: line.substring(currentPos, endPos + 2)
            });
            inMultiLineComment = false;
            currentPos = endPos + 2;
          } else {
            // Multi-line comment continues to next line
            processedLine.push({
              type: 'comment',
              content: line.substring(currentPos)
            });
            currentPos = line.length;
          }
        } else if (inMultiLineComment) {
          const endPos = line.indexOf('*/', currentPos);
          if (endPos !== -1) {
            // Multi-line comment ends on this line
            processedLine.push({
              type: 'comment',
              content: line.substring(currentPos, endPos + 2)
            });
            inMultiLineComment = false;
            currentPos = endPos + 2;
          } else {
            // Multi-line comment continues
            processedLine.push({
              type: 'comment',
              content: line.substring(currentPos)
            });
            currentPos = line.length;
          }
        } else if (line.substr(currentPos, 2) === '//') {
          // Single-line comment
          processedLine.push({
            type: 'comment',
            content: line.substring(currentPos)
          });
          currentPos = line.length;
        } else {
          // Check for strings
          const char = line[currentPos];
          if (char === '"' || char === "'") {
            const quote = char;
            let endPos = currentPos + 1;
            let escaped = false;
            
            while (endPos < line.length) {
              if (line[endPos] === '\\' && !escaped) {
                escaped = true;
              } else if (line[endPos] === quote && !escaped) {
                break;
              } else {
                escaped = false;
              }
              endPos++;
            }
            
            if (endPos < line.length) {
              // Complete string found
              processedLine.push({
                type: 'string',
                content: line.substring(currentPos, endPos + 1)
              });
              currentPos = endPos + 1;
            } else {
              // Incomplete string (no closing quote)
              processedLine.push({
                type: 'string',
                content: line.substring(currentPos)
              });
              currentPos = line.length;
            }
          } else {
            // Regular code - find next special character
            let nextSpecial = line.length;
            const specialChars = ['"', "'", '/', '*'];
            
            for (let j = currentPos + 1; j < line.length; j++) {
              if (specialChars.includes(line[j]) || 
                  (line[j] === '/' && (line[j+1] === '/' || line[j+1] === '*')) ||
                  (line[j] === '*' && line[j+1] === '/')) {
                nextSpecial = j;
                break;
              }
            }
            
            processedLine.push({
              type: 'code',
              content: line.substring(currentPos, nextSpecial)
            });
            currentPos = nextSpecial;
          }
        }
      }
      
      result.push(processedLine);
    }
    
    return result;
  };

  const getHighlightedCode = () => {
    const parsedLines = parseCodeWithComments(code);
    
    return parsedLines.map((line, lineIndex) => {
      const coloredTokens = line.map((segment, segmentIndex) => {
        if (segment.type === 'comment') {
          return (
            <span key={segmentIndex} className="text-green-400">
              {segment.content}
            </span>
          );
        } else if (segment.type === 'string') {
          return (
            <span key={segmentIndex} className="text-green-300">
              {segment.content}
            </span>
          );
        } else {
          // Regular code - tokenize normally
          const tokens = segment.content.split(/(\s+|[(){}[\];,=<>!+\-*/%&|])/);
          
          return tokens.map((token, tokenIndex) => {
            if (!token || token.match(/^\s+$/)) {
              return <span key={`${segmentIndex}-${tokenIndex}`}>{token}</span>;
            }
            
            let className = "text-gray-300";
            const trimmedToken = token.trim();
            
            if (Tokens.keywords.includes(trimmedToken)) {
              className = "text-purple-400 font-bold";
            } else if (Tokens.operators.includes(trimmedToken)) {
              className = "text-yellow-300";
            } else if (Tokens.symbols.includes(trimmedToken)) {
              className = "text-cyan-300";
            } else if (/^\d+(\.\d+)?$/.test(trimmedToken)) {
              className = "text-orange-400";
            } else if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(trimmedToken)) {
              className = "text-blue-300";
            }
            
            return (
              <span key={`${segmentIndex}-${tokenIndex}`} className={className}>
                {token}
              </span>
            );
          });
        }
      });
      
      return (
        <div key={lineIndex} className="leading-6" style={{ minHeight: '1.5rem' }}>
          {coloredTokens.length > 0 ? coloredTokens : <span> </span>}
        </div>
      );
    });
  };

  return (
    <div 
      className={`bg-gray-900 border border-gray-700 flex flex-col  ${className}`}
      style={{ 
        height, 
        width, 
        borderRadius 
      }}
    >
      {/* Header */}
      <div className="bg-gray-800 border-b rounded-tl-[8px] rounded-tr-[8px] border-gray-700 px-4 py-2 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-gray-300 text-sm ml-4">{fileName}</span>
        </div>
        <div className="flex items-center space-x-2">
          {showCopyButton && readOnly && (
            <button
              onClick={copyToClipboard}
              className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-gray-300 flex items-center space-x-1 transition-colors"
              title="Copy to clipboard"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          )}
          {/* {readOnly && (
            <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">Read Only</span>
          )} */}
         {!showCopyButton && <span className="text-xs text-gray-400">Vishwaguru Script</span>}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Line Numbers */}
        {showLineNumbers && (
          <div 
            ref={lineNumbersRef}
            className="bg-gray-850 border-r border-gray-700 px-3 py-4 text-gray-500 text-sm font-mono select-none flex-shrink-0 overflow-hidden"
          >
            {getLineNumbers().map(num => (
              <div key={num} className="leading-6 text-right" style={{ minHeight: '1.5rem' }}>
                {num}
              </div>
            ))}
          </div>
        )}

        {/* Editor Container */}
        <div className="flex-1 relative overflow-hidden">
          {/* Syntax Highlighting Layer */}
         {readOnly  && <div
            ref={highlightRef}
            className="absolute inset-0 p-4 font-mono text-sm overflow-auto "
            style={{ 
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              lineHeight: '1.5rem',
              whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
              wordBreak: wordWrap ? 'break-words' : 'normal'
            }}
          >
            {getHighlightedCode()}
          </div>
}

          {/* Textarea Layer */}
        { !readOnly && <textarea
            ref={textareaRef}
            value={code}
            onChange={handleCodeChange}
            onKeyDown={handleKeyDown}
            onScroll={handleScroll}
            placeholder={placeholder}
            readOnly={readOnly}
            className={`absolute inset-0 w-full h-full p-4  text-[#88C0D0] caret-white font-mono text-sm   resize-none outline-none border-none overflow-auto  ${
              readOnly ? 'cursor-default' : ''
            }`}
            style={{ 
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              lineHeight: '1.5rem',
              whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
              wordBreak: wordWrap ? 'break-words' : 'normal'
            }}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            data-gramm="false"
            data-gramm_editor="false"
            data-enable-grammarly="false"
          />}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 border-t rounded-bl-[8px] rounded-br-[8px] border-gray-700 px-4 py-1 flex items-center justify-between text-xs text-gray-400 flex-shrink-0">
        <div className="flex items-center space-x-4">
          <span>Lines: {code.split('\n').length}</span>
          <span>Chars: {code.length}</span>
          <span className="text-purple-400">VGC</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>Live Editor</span>
          <span>UTF-8</span>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;