'use client';

import Ace from 'react-ace';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/ext-language_tools';
import { useState, useEffect } from 'react';
import { Code, ChevronDown, Clock, Play } from 'lucide-react';

export const AceEditor = ({ onCodeChange, defaultValue }) => {
  const [code, setCode] = useState(defaultValue || '');
  const [lang, setLang] = useState('python');
  const [theme, setTheme] = useState('monokai');
  const [fontSize, setFontSize] = useState(14);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFontSizeOpen, setIsFontSizeOpen] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  // Ensure the code only runs in the browser
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCode = sessionStorage.getItem('editor-code') || defaultValue || '';
      const savedLang = sessionStorage.getItem('editor-lang');
      const savedTheme = sessionStorage.getItem('editor-theme');
      const savedFontSize = sessionStorage.getItem('editor-font-size');

      if (savedCode) setCode(savedCode);
      if (savedLang) setLang(savedLang);
      if (savedTheme) setTheme(savedTheme);
      if (savedFontSize) setFontSize(parseInt(savedFontSize, 10));
    }
  }, [defaultValue]);

  // Update sessionStorage when code or lang changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('editor-code', code);
      sessionStorage.setItem('editor-lang', lang);
      sessionStorage.setItem('editor-theme', theme);
      sessionStorage.setItem('editor-font-size', fontSize.toString());
      
      // Update last saved time
      const now = new Date();
      setLastSaved(now);
      
      if (onCodeChange) {
        onCodeChange(code);
      }
    }
  }, [code, lang, theme, fontSize, onCodeChange]);

  const handleLang = (value) => {
    if (value !== lang) {
      setLang(value);
      setIsDropdownOpen(false);
    }
  };

  const handleTheme = (value) => {
    if (value !== theme) {
      setTheme(value);
    }
  };

  const handleFontSize = (size) => {
    setFontSize(size);
    setIsFontSizeOpen(false);
  };

  const formatTimestamp = (date) => {
    if (!date) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Generate sample code based on language
  const getSampleCode = (language) => {
    if (language === 'javascript') {
      return `// Two Sum Solution in JavaScript
function twoSum(nums, target) {
  const map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    
    map.set(nums[i], i);
  }
  
  return null;
}

// Example usage
const nums = [2, 7, 11, 15];
const target = 9;
console.log(twoSum(nums, target)); // Output: [0, 1]`;
    } else {
      return `# Two Sum Solution in Python
def two_sum(nums, target):
    hash_map = {}
    
    for i, num in enumerate(nums):
        complement = target - num
        
        if complement in hash_map:
            return [hash_map[complement], i]
        
        hash_map[num] = i
    
    return None

# Example usage
nums = [2, 7, 11, 15]
target = 9
print(two_sum(nums, target))  # Output: [0, 1]`;
    }
  };

  const resetToSample = () => {
    setCode(getSampleCode(lang));
  };

  return (
    <div className="relative w-full h-[400px] rounded-md overflow-hidden border border-gray-200 shadow-sm">
      {/* Editor toolbar */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Code size={16} className="text-indigo-600" />
          <span className="text-sm font-medium text-gray-700">
            {lang === 'javascript' ? 'solution.js' : 'solution.py'}
          </span>
          
          {/* Language selector */}
          <div className="relative ml-2">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center px-2 py-1 text-xs font-medium bg-indigo-50 text-indigo-700 rounded hover:bg-indigo-100"
            >
              {lang === 'javascript' ? 'JavaScript' : 'Python'}
              <ChevronDown size={12} className="ml-1" />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <div className="py-1">
                  <button
                    onClick={() => handleLang('javascript')}
                    className={`block px-4 py-1 text-sm w-full text-left ${lang === 'javascript' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    JavaScript
                  </button>
                  <button
                    onClick={() => handleLang('python')}
                    className={`block px-4 py-1 text-sm w-full text-left ${lang === 'python' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    Python
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Last saved indicator */}
          {lastSaved && (
            <div className="flex items-center text-xs text-gray-500">
              <Clock size={12} className="mr-1" />
              <span>Saved {formatTimestamp(lastSaved)}</span>
            </div>
          )}
          
          {/* Font size selector */}
          <div className="relative">
            <button
              onClick={() => setIsFontSizeOpen(!isFontSizeOpen)}
              className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-200 rounded"
            >
              Font: {fontSize}px
            </button>
            
            {isFontSizeOpen && (
              <div className="absolute top-full right-0 mt-1 w-24 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <div className="py-1">
                  {[12, 14, 16, 18, 20].map((size) => (
                    <button
                      key={size}
                      onClick={() => handleFontSize(size)}
                      className={`block px-4 py-1 text-sm w-full text-left ${fontSize === size ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      {size}px
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Theme toggle */}
          <button
            onClick={() => handleTheme(theme === 'monokai' ? 'github' : 'monokai')}
            className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-200 rounded"
          >
            {theme === 'monokai' ? 'Light Mode' : 'Dark Mode'}
          </button>
          
          {/* Reset button */}
          <button
            onClick={resetToSample}
            className="px-2 py-1 text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 rounded"
          >
            Sample Code
          </button>
        </div>
      </div>

      {/* Editor component */}
      <Ace
        value={code}
        onChange={setCode}
        mode={lang}
        theme={theme}
        name="code-editor"
        width="100%"
        height="calc(100% - 36px)" // Subtract toolbar height
        fontSize={fontSize}
        editorProps={{ $blockScrolling: true }}
        setOptions={{
          showLineNumbers: true,
          tabSize: 2,
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          showPrintMargin: false,
        }}
      />
    </div>
  );
};