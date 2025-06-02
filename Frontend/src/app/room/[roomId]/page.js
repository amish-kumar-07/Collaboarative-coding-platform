'use client';

<<<<<<< HEAD
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { AceEditor } from '../../components/aceeditor';
import { QuestionDisplay } from '../../components/quesdisplay';
import { OutputConsole } from '../../components/console';
import VideoChat from '../../components/VideoChat'
import { selectRandomQuestion } from '../../utils/selectquestion';
import { handlerun } from '../../../../api/handlerun';
import {
  ChevronLeft, ChevronRight, Lightbulb, Info, MessageSquare, Video, Mic, MicOff, VideoOff
} from 'lucide-react';

// Room question storage - in a real app, this would be in a database
const roomQuestions = new Map();

// Function to get or create room question
const getRoomQuestion = (roomId) => {
  if (!roomQuestions.has(roomId)) {
    roomQuestions.set(roomId, selectRandomQuestion());
  }
  return roomQuestions.get(roomId);
};
=======
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
>>>>>>> upstream/main

export default function RoomPage() {
  const params = useParams();
  const roomId = params.roomId;
<<<<<<< HEAD

  const [userName, setUserName] = useState('');
  const [question, setQuestion] = useState(() => getRoomQuestion(roomId));
  const [code, setCode] = useState('// Start coding here...');
=======
  const [userName, setUserName] = useState("");
  
  const [question, setQuestion] = useState(selectRandomQuestion());
>>>>>>> upstream/main
  const [status, setStatus] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [showHint, setShowHint] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
<<<<<<< HEAD

  // Video chat controls
  const [showVideoChat, setShowVideoChat] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoDisabled, setIsVideoDisabled] = useState(false);

=======
>>>>>>> upstream/main
  const [messages, setMessages] = useState([
    { sender: 'System', text: `Welcome to room ${roomId}`, time: new Date() }
  ]);
  const [newMessage, setNewMessage] = useState('');
<<<<<<< HEAD

  useEffect(() => {
    // Replace localStorage with session state
    if (!userName) {
      const name = prompt('Enter your name:');
      if (name) {
        setUserName(name);
      } else {
        window.location.href = '/';
      }
    }
    
    // Ensure the question is consistent for this room
    setQuestion(getRoomQuestion(roomId));
  }, [roomId, userName]);

  const handleRunClick = async () => {
    try {
      setStatus({ description: 'Processing' });
      const result = await handlerun(question.id, code);
      setStatus(result);
    } catch (error) {
      setStatus({ description: 'Error', message: error.message || 'Failed to run code' });
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // In a real implementation, you would call the video chat component's mute function
  };

  const toggleVideo = () => {
    setIsVideoDisabled(!isVideoDisabled);
    // In a real implementation, you would call the video chat component's disable video function
  };

  const formatTime = (date) => {
    const d = new Date(date);
    return d.toLocaleTimeString();
  };

  const renderDescriptionTab = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-800">Problem #{question.id}</h1>
        <div className="flex items-center">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">Easy</span>
          <button onClick={() => setShowHint(!showHint)} className="p-1 rounded hover:bg-gray-100">
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
                <p className="text-sm text-blue-700">
                  Try using a hash map to store the values and their indices as you iterate through the array.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderDiscussionTab = () => (
    <div className="text-gray-500 text-center mt-10">
      <MessageSquare size={40} className="mx-auto text-gray-300 mb-2" />
      <p>Discussion will be available soon</p>
    </div>
  );

  const renderChatTab = () => (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-3 flex items-start">
            <div className={`rounded-full w-8 h-8 flex items-center justify-center mr-2 ${
              msg.sender === 'System' ? 'bg-gray-200' : 'bg-indigo-100 text-xs font-medium text-indigo-800'
            }`}>
              {msg.sender === 'System' ? <Info size={14} className="text-gray-600" /> : msg.sender[0]?.toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="font-medium text-sm text-gray-800">{msg.sender}</span>
                <span className="text-xs text-gray-500">{formatTime(msg.time)}</span>
              </div>
              <p className="text-sm text-gray-700">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        {/* Chat input UI could go here */}
      </div>
    </div>
  );

  const renderVideoTab = () => (
    <div className="h-full flex flex-col">
      <VideoChat
        roomId={roomId}
        userName={userName}
        onLeave={() => {
          setShowVideoChat(false);
          setActiveTab('description');
        }}
        compact={true}
        isMuted={isMuted}
        isVideoDisabled={isVideoDisabled}
      />
      
      {/* Video Controls */}
      <div className="flex justify-center space-x-2 p-3 border-t border-gray-200 bg-gray-50">
        <button
          onClick={toggleMute}
          className={`p-2 rounded-full ${
            isMuted 
              ? 'bg-red-100 text-red-600 hover:bg-red-200' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
        </button>
        
        <button
          onClick={toggleVideo}
          className={`p-2 rounded-full ${
            isVideoDisabled 
              ? 'bg-red-100 text-red-600 hover:bg-red-200' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          title={isVideoDisabled ? 'Enable Video' : 'Disable Video'}
        >
          {isVideoDisabled ? <VideoOff size={18} /> : <Video size={18} />}
        </button>
      </div>
    </div>
  );

  const renderSidebarTabs = () => {
    switch (activeTab) {
      case 'description': return renderDescriptionTab();
      case 'discussion': return renderDiscussionTab();
      case 'chat': return renderChatTab();
      case 'video': return renderVideoTab();
      default: return null;
    }
  };

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <div
        className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
          isSidebarCollapsed ? 'w-12' : 'w-1/3'
        }`}
      >
        {/* Top Tab Nav */}
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
                {['description', 'discussion', 'chat', showVideoChat && 'video']
                  .filter(Boolean)
                  .map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                        activeTab === tab
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
              </div>
              <button
                onClick={() => setSidebarCollapsed(true)}
                className="p-1 rounded hover:bg-gray-100"
              >
                <ChevronLeft size={20} className="text-gray-600" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-5">{renderSidebarTabs()}</div>
          </>
        )}
      </div>

      {/* Main Area */}
      <div className="flex flex-col flex-1">
        <div
          className={`flex flex-1 transition-all duration-300 ${
            showVideoChat ? 'flex-col md:flex-row' : 'flex-col'
          }`}
        >
          {/* Editor Area */}
          <div className={`${showVideoChat ? 'md:w-2/3 w-full' : 'w-full'}`}>
            <AceEditor code={code} onChange={setCode} />
          </div>

          {/* Video Chat Area */}
          {showVideoChat && (
            <div className="md:w-1/3 w-full border-l border-gray-200 bg-white flex flex-col">
              <div className="flex-1 p-2">
                <VideoChat
                  roomId={roomId}
                  userName={userName}
                  onLeave={() => {
                    setShowVideoChat(false);
                    setActiveTab('description');
                  }}
                  compact={true}
                  isMuted={isMuted}
                  isVideoDisabled={isVideoDisabled}
                />
              </div>
              
              {/* Video Controls for main area */}
              <div className="flex justify-center space-x-2 p-3 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={toggleMute}
                  className={`p-2 rounded-full ${
                    isMuted 
                      ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
                </button>
                
                <button
                  onClick={toggleVideo}
                  className={`p-2 rounded-full ${
                    isVideoDisabled 
                      ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title={isVideoDisabled ? 'Enable Video' : 'Disable Video'}
                >
                  {isVideoDisabled ? <VideoOff size={18} /> : <Video size={18} />}
                </button>

                <button
                  onClick={() => setShowVideoChat(false)}
                  className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                  title="Close Video"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center p-4 border-t bg-gray-50">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRunClick}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Run Code
            </button>
            
            <span className="text-sm text-gray-600">
              Room: <span className="font-medium">{roomId}</span> | 
              Question: <span className="font-medium">#{question.id}</span>
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {showVideoChat && (
              <>
                <button
                  onClick={toggleMute}
                  className={`p-2 rounded ${
                    isMuted 
                      ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
                </button>
                
                <button
                  onClick={toggleVideo}
                  className={`p-2 rounded ${
                    isVideoDisabled 
                      ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title={isVideoDisabled ? 'Enable Video' : 'Disable Video'}
                >
                  {isVideoDisabled ? <VideoOff size={16} /> : <Video size={16} />}
                </button>
              </>
            )}
            
            <button
              onClick={() => setShowVideoChat(!showVideoChat)}
              className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              <Video size={16} className="mr-2" />
              {showVideoChat ? 'Hide Video' : 'Show Video'}
            </button>
          </div>
        </div>

        <OutputConsole status={status} />
=======
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
>>>>>>> upstream/main
      </div>
    </div>
  );
}