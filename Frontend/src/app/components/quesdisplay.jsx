'use client';

import { BookOpen, Code, Check, ArrowRight, Clock, Lightbulb } from 'lucide-react';
import { useState } from 'react';

export const QuestionDisplay = ({ id }) => {
  const [activeTab, setActiveTab] = useState('description');
  
  const questions = [
    { 
      id: 1, 
      title: "Sum of Two Numbers", 
      description: "Given two numbers, write a function to return their sum.",
      difficulty: "Easy",
      points: 5,
      timeComplexity: "O(1)",
      spaceComplexity: "O(1)",
      companies: ["Amazon", "Microsoft", "Google"],
      acceptance: "92%",
      examples: [
        { input: "3, 5", output: "8", explanation: "3 + 5 = 8" },
        { input: "-1, 5", output: "4", explanation: "-1 + 5 = 4" },
        { input: "0, 0", output: "0", explanation: "0 + 0 = 0" }
      ],
      hints: [
        "This is a straightforward mathematical operation.",
        "Make sure to handle negative numbers correctly."
      ],
      solution: "Use the addition operator to add the two numbers and return the result."
    },
    { 
      id: 2, 
      title: "Reverse a String", 
      description: "Write a function that reverses a given string. The input string is given as an array of characters.",
      difficulty: "Easy",
      points: 8,
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      companies: ["Apple", "Facebook", "Adobe"],
      acceptance: "85%",
      examples: [
        { input: "\"hello\"", output: "\"olleh\"", explanation: "Reverse the characters in the string." },
        { input: "\"world\"", output: "\"dlrow\"", explanation: "Reverse the characters in the string." },
        { input: "\"Hannah\"", output: "\"hannaH\"", explanation: "Case is preserved but order is reversed." }
      ],
      hints: [
        "Try to solve it in-place without allocating extra space.",
        "You can swap characters from both ends towards the middle."
      ],
      solution: "Iterate from both ends of the string, swapping characters until you reach the middle."
    },
    { 
      id: 3, 
      title: "Find Maximum Number", 
      description: "Write a function that returns the maximum of three numbers. Your function should take three numbers as parameters and return the largest among them.",
      difficulty: "Easy",
      points: 5,
      timeComplexity: "O(1)",
      spaceComplexity: "O(1)",
      companies: ["Amazon", "Apple", "Microsoft"],
      acceptance: "94%",
      examples: [
        { input: "7, 2, 9", output: "9", explanation: "9 is the largest number." },
        { input: "10, 10, 10", output: "10", explanation: "All numbers are equal, so 10 is returned." },
        { input: "-5, -2, -10", output: "-2", explanation: "-2 is the largest of the three negative numbers." }
      ],
      hints: [
        "Compare the first two numbers and then compare the result with the third number.",
        "You can also use built-in Math functions depending on your language."
      ],
      solution: "Use Math.max(a, b, c) or compare the numbers in pairs to find the maximum."
    },
    { 
      id: 4, 
      title: "Check Palindrome", 
      description: "Write a function that checks if a given string is a palindrome. A palindrome is a word, phrase, number, or other sequence that reads the same forward and backward (ignoring spaces, punctuation, and capitalization).",
      difficulty: "Easy",
      points: 10,
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      companies: ["Facebook", "Amazon", "Microsoft"],
      acceptance: "78%",
      examples: [
        { input: "\"madam\"", output: "true", explanation: "\"madam\" reads the same backward as forward." },
        { input: "\"racecar\"", output: "true", explanation: "\"racecar\" reads the same backward as forward." },
        { input: "\"hello\"", output: "false", explanation: "\"hello\" does not read the same backward as forward." }
      ],
      hints: [
        "Compare characters from both ends towards the middle.",
        "Consider using two pointers: one starting from the beginning and one from the end."
      ],
      solution: "Compare characters from both ends of the string, moving towards the center. If at any point the characters don't match, it's not a palindrome."
    },
    { 
      id: 5, 
      title: "Factorial Calculation", 
      description: "Write a function that calculates the factorial of a given non-negative integer n. The factorial of n is the product of all positive integers less than or equal to n.",
      difficulty: "Easy",
      points: 12,
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      companies: ["Google", "Microsoft", "IBM"],
      acceptance: "80%",
      examples: [
        { input: "5", output: "120", explanation: "5! = 5 × 4 × 3 × 2 × 1 = 120" },
        { input: "0", output: "1", explanation: "0! is defined to be 1." },
        { input: "10", output: "3628800", explanation: "10! = 10 × 9 × ... × 1 = 3628800" }
      ],
      hints: [
        "Remember that 0! is defined as 1.",
        "Watch out for potential overflows with large inputs.",
        "You can use recursion or iteration."
      ],
      solution: "Use a loop to multiply each number from 1 to n, or use recursion with the formula n! = n × (n-1)!."
    },
    { 
      id: 6, 
      title: "Count Vowels", 
      description: "Write a function that counts the number of vowels (a, e, i, o, u) in a given string. Consider only lowercase and uppercase vowels.",
      difficulty: "Easy",
      points: 8,
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      companies: ["Amazon", "Facebook", "Twitter"],
      acceptance: "88%",
      examples: [
        { input: "\"Perplexity\"", output: "3", explanation: "The vowels are 'e', 'e', 'i'." },
        { input: "\"Hello World\"", output: "3", explanation: "The vowels are 'e', 'o', 'o'." },
        { input: "\"rhythm\"", output: "0", explanation: "There are no vowels in this word." }
      ],
      hints: [
        "Create a set of vowels to check against each character.",
        "Remember to handle both uppercase and lowercase vowels."
      ],
      solution: "Iterate through each character in the string and check if it's a vowel. Increment a counter for each vowel found."
    },
  ];

  const que = questions.find(q => q.id == id);

  if (!que) return <div className="text-red-500 p-4 rounded border border-red-300 bg-red-50">Invalid Question ID</div>;

  const getDifficultyColor = (difficulty) => {
    switch(difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Question header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">{que.title}</h2>
          <div className="flex items-center space-x-2">
            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getDifficultyColor(que.difficulty)}`}>
              {que.difficulty}
            </span>
            <span className="text-xs text-gray-500 flex items-center">
              <Check size={14} className="text-green-500 mr-1" />
              {que.acceptance}
            </span>
          </div>
        </div>
        
        {/* Company tags */}
        {que.companies && (
          <div className="mt-2 flex flex-wrap gap-1">
            {que.companies.map((company, index) => (
              <span key={index} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs rounded-full">
                {company}
              </span>
            ))}
          </div>
        )}
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 px-4">
        <button 
          onClick={() => setActiveTab('description')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            activeTab === 'description' 
              ? 'border-indigo-600 text-indigo-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center">
            <BookOpen size={16} className="mr-2" />
            Description
          </div>
        </button>
        <button 
          onClick={() => setActiveTab('hints')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            activeTab === 'hints' 
              ? 'border-indigo-600 text-indigo-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center">
            <Lightbulb size={16} className="mr-2" />
            Hints
          </div>
        </button>
        <button 
          onClick={() => setActiveTab('solution')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            activeTab === 'solution' 
              ? 'border-indigo-600 text-indigo-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center">
            <Code size={16} className="mr-2" />
            Solution
          </div>
        </button>
      </div>
      
      {/* Content */}
      <div className="p-4">
        {activeTab === 'description' && (
          <div>
            <p className="text-gray-700 mb-4">{que.description}</p>
            
            {/* Complexity info */}
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center px-3 py-1.5 bg-gray-50 rounded-md text-sm">
                <Clock size={16} className="text-gray-500 mr-2" />
                <div>
                  <span className="text-xs text-gray-500">Time Complexity:</span>
                  <span className="ml-1 font-medium text-gray-700">{que.timeComplexity}</span>
                </div>
              </div>
              
              <div className="flex items-center px-3 py-1.5 bg-gray-50 rounded-md text-sm">
                <Code size={16} className="text-gray-500 mr-2" />
                <div>
                  <span className="text-xs text-gray-500">Space Complexity:</span>
                  <span className="ml-1 font-medium text-gray-700">{que.spaceComplexity}</span>
                </div>
              </div>
              
              <div className="flex items-center px-3 py-1.5 bg-gray-50 rounded-md text-sm">
                <Check size={16} className="text-gray-500 mr-2" />
                <div>
                  <span className="text-xs text-gray-500">Points:</span>
                  <span className="ml-1 font-medium text-gray-700">{que.points}</span>
                </div>
              </div>
            </div>
            
            {/* Examples */}
            <div className="mt-4 space-y-4">
              <h3 className="text-md font-semibold text-gray-800">Examples:</h3>
              {que.examples.map((example, index) => (
                <div key={index} className="bg-gray-50 rounded-md p-3 border border-gray-200">
                  <div className="mb-1">
                    <span className="text-xs font-medium text-gray-500">Example {index + 1}:</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Input:</div>
                      <div className="bg-gray-100 px-3 py-2 rounded font-mono text-sm text-gray-800">{example.input}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Output:</div>
                      <div className="bg-gray-100 px-3 py-2 rounded font-mono text-sm text-gray-800">{example.output}</div>
                    </div>
                  </div>
                  {example.explanation && (
                    <div className="mt-2">
                      <div className="text-xs text-gray-500 mb-1">Explanation:</div>
                      <div className="text-sm text-gray-700">{example.explanation}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'hints' && (
          <div>
            <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-4">
              <div className="flex items-start">
                <Lightbulb className="text-blue-500 mr-2 mt-0.5" size={18} />
                <p className="text-sm text-blue-700">
                  Use these hints if you're stuck. Each hint provides a little more guidance than the previous one.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {que.hints.map((hint, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-md border border-gray-200">
                  <div className="flex items-center">
                    <div className="bg-indigo-100 text-indigo-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mr-2">
                      {index + 1}
                    </div>
                    <p className="text-gray-700">{hint}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'solution' && (
          <div className="bg-yellow-50 border border-yellow-100 rounded-md p-4">
            <p className="text-sm text-yellow-800">
              <strong>Approach:</strong> {que.solution}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};