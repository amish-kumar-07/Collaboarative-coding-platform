'use client';

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { AceEditor } from "../../components/aceeditor";
import { QuestionDisplay } from "../../components/quesdisplay";
import { OutputConsole } from "../../components/console";
import { selectRandomQuestion } from "../../utils/selectquestion";
import { handlerun } from "../../../../api/handlerun";
import Video from "../../components/video";
import socket from "../../../socket";
import { Code, Users, PlayCircle, Share2, MessageSquare, Settings, ChevronLeft, ChevronRight, Lightbulb, Info, Clock, Zap } from "lucide-react";

export default function RoomPage() {
  const params = useParams();
  const roomId = params.roomId;
  const [userName, setUserName] = useState("");
  
  const [question, setQuestion] = useState(selectRandomQuestion());
  const [status, setStatus] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [showHint, setShowHint] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'System', text: `Welcome to room ${roomId}`, time: new Date() }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isSocketConnected, setIsSocketConnected] = useState(socket.connected);
  const [code, setCode] = useState("// Start coding here...");
  
  // Load user data from localStorage
  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    } else {
      // Redirect to home if no name is found
      window.location.href = '/';
    }
    
    // Check socket connection status
    setIsSocketConnected(socket.connected);
    
    // Set up socket connection listeners
    const handleConnect = () => setIsSocketConnected(true);
    const handleDisconnect = () => setIsSocketConnected(false);
    
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    
    // Add system message when socket events occur
    socket.on('user-joined', ({ Name }) => {
      addSystemMessage(`${Name} has joined the room`);
    });
    
    socket.on('user-disconnected', ({ name }) => {
      addSystemMessage(`${name} has left the room`);
    });
    
    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('user-joined');
      socket.off('user-disconnected');
    };
  }, [roomId]);
  
  // Helper to add system messages
  const addSystemMessage = (text) => {
    setMessages(prev => [
      ...prev,
      { sender: 'System', text, time: new Date() }
    ]);
  };

  // Handle sending chat messages
  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Create message object
    const message = {
      sender: userName,
      text: newMessage.trim(),
      time: new Date()
    };
    
    // Add to local messages
    setMessages(prev => [...prev, message]);
    
    // Clear input
    setNewMessage('');
    
    // TODO: Implement chat message socket event
  };

  // Handle running code
  const handleRunClick = async () => {
    try {
      setStatus({ description: "Processing" });
      
      const result = await handlerun(question.id, code);
      setStatus(result);
    } catch (error) {
      console.error("Error running code:", error);
      setStatus({
        description: "Error",
        message: error.message || "Failed to run code"
      });
    }
  };
  
  // Format time for messages
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-3 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center">
          <Code className="text-indigo-600 mr-2" size={24} />
          <div className="text-xl font-bold text-gray-800">CodeCollab</div>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center bg-indigo-50 rounded-full px-4 py-1.5 text-sm">
            <Users className="text-indigo-600 mr-2" size={16} />
            <div className="text-gray-700">Room: <span className="text-indigo-600 font-medium">{roomId}</span></div>
          </div>
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${isSocketConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <div className="flex items-center bg-blue-50 rounded-full px-3 py-1 text-sm">
              <div className="text-blue-700">
                <span className="font-medium">{userName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Left Panel - Problem Statement */}
        <div className={`bg-white border-r border-gray-200 flex flex-col ${isSidebarCollapsed ? 'w-12' : 'w-1/3'} transition-all duration-300`}>
          {isSidebarCollapsed ? (
            <div className="p-3 flex justify-center border-b border-gray-200">
              <button 
                onClick={() => setSidebarCollapsed(false)}
                className="p-1 rounded hover:bg-gray-100"
              >
                <ChevronRight size={20} className="text-gray-600" />
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex space-x-1">
                  <button 
                    onClick={() => setActiveTab('description')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium ${activeTab === 'description' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    Description
                  </button>
                  <button 
                    onClick={() => setActiveTab('discussion')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium ${activeTab === 'discussion' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    Discussion
                  </button>
                  <button 
                    onClick={() => setActiveTab('chat')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium ${activeTab === 'chat' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    Chat
                  </button>
                </div>
                <button 
                  onClick={() => setSidebarCollapsed(true)}
                  className="p-1 rounded hover:bg-gray-100"
                >
                  <ChevronLeft size={20} className="text-gray-600" />
                </button>
              </div>
              <div className="flex-1 overflow-auto p-5">
                {activeTab === 'description' ? (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h1 className="text-xl font-bold text-gray-800">Problem #{question.id}</h1>
                      <div className="flex items-center">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">Easy</span>
                        <button 
                          onClick={() => setShowHint(!showHint)} 
                          className="p-1 rounded hover:bg-gray-100"
                        >
                          <Lightbulb size={18} className="text-yellow-500" />
                        </button>
                      </div>
                    </div>
                    <div className="prose prose-indigo max-w-none">
                      <QuestionDisplay id={question.id} />
                      
                      {showHint && (
                        <div className="mt-6 p-3 bg-blue-50 rounded-md border border-blue-100">
                          <div className="flex items-start">
                            <Lightbulb size={20} className="text-blue-500 mr-2 mt-0.5" />
                            <div>
                              <h3 className="text-sm font-medium text-blue-800">Hint:</h3>
                              <p className="text-sm text-blue-700">Try using a hash map to store the values and their indices as you iterate through the array.</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : activeTab === 'discussion' ? (
                  <div className="text-gray-500 text-center mt-10">
                    <MessageSquare size={40} className="mx-auto text-gray-300 mb-2" />
                    <p>Discussion will be available soon</p>
                  </div>
                ) : (
                  <div className="h-full flex flex-col">
                    <div className="flex-1 overflow-y-auto">
                      {messages.map((msg, idx) => (
                        <div key={idx} className="mb-3">
                          <div className="flex items-start">
                            {msg.sender === 'System' ? (
                              <div className="rounded-full bg-gray-200 w-8 h-8 flex items-center justify-center mr-2">
                                <Info size={14} className="text-gray-600" />
                              </div>
                            ) : (
                              <div className="rounded-full bg-indigo-100 w-8 h-8 flex items-center justify-center text-xs font-medium text-indigo-800 mr-2">
                                {msg.sender[0]?.toUpperCase()}
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-sm text-gray-800">{msg.sender}</span>
                                <span className="text-xs text-gray-500">{formatTime(msg.time)}</span>
                              </div>
                              <p className="text-sm text-gray-700">{msg.text}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex">
                        <input
                          type="text"
                          placeholder="Type a message..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        />
                        <button 
                          onClick={sendMessage}
                          className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700"
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Middle Panel - Code Editor */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 border-b border-gray-200">
            <div className="h-full flex flex-col">
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700">Solution.js</span>
                  <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded">JavaScript</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="px-2 py-0.5 text-xs text-blue-700 bg-blue-50 rounded-full flex items-center">
                    <Clock size={12} className="mr-1" />
                    Session: 25:10
                  </div>
                  <button className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-200 rounded">
                    Format
                  </button>
                </div>
              </div>
              <div className="flex-1">
                <AceEditor
                  defaultValue={code}
                  onCodeChange={(newCode) => setCode(newCode)}
                />
              </div>
            </div>
          </div>

          <div className="h-1/3 flex flex-col">
            <div className="flex items-center px-4 py-2 bg-gray-50 border-b border-gray-200">
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-700">Console Output</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleRunClick}
                  className="flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md shadow-sm"
                >
                  <PlayCircle size={16} className="mr-1" />
                  Run
                </button>
                <button 
                  className="flex items-center px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-md shadow-sm"
                >
                  <Share2 size={16} className="mr-1" />
                  Pass Control
                </button>
              </div>
            </div>
            <div className="flex-1 bg-gray-900 p-3 overflow-y-auto font-mono text-sm">
              <OutputConsole status={status} />
            </div>
          </div>
        </div>

        {/* Right Panel - Video & Participants */}
        <div className="w-80 border-l border-gray-200 bg-white flex flex-col">
          <div className="p-3 border-b border-gray-200">
            <h2 className="text-sm font-medium text-gray-700">Video Conference</h2>
          </div>
          
          <div className="p-3 flex-1 overflow-y-auto">
            {/* The VideoManager component handles all video functionality */}
            <Video/>
          </div>
        </div>
      </div>
    </div>
  );
}