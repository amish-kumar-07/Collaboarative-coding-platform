'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import socket from '../socket';
import { Code, Users, ArrowRight, Hash, User, RefreshCw, Server } from 'lucide-react';

export default function Page() {
  const [userName, setUserName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isGeneratingRoom, setIsGeneratingRoom] = useState(false);
  const [socketStatus, setSocketStatus] = useState('disconnected'); // 'disconnected', 'connecting', 'connected'
  const [error, setError] = useState('');
  const router = useRouter();

  // Check for stored credentials
  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    const storedRoomId = localStorage.getItem('roomId');
    
    if (storedName) setUserName(storedName);
    if (storedRoomId) setRoomId(storedRoomId);
  }, []);

  // Socket connection setup
  useEffect(() => {
    const handleConnect = () => {
      console.log('Socket connected:', socket.id);
      setSocketStatus('connected');
    };

    const handleConnectError = (err) => {
      console.error('Connection error:', err);
      setError('Failed to connect to server. Please try again.');
      setSocketStatus('disconnected');
    };

    const handleDisconnect = (reason) => {
      console.log('Socket disconnected:', reason);
      setSocketStatus('disconnected');
    };

    // Handle successful room join
    const handleJoinedRoom = ({ roomId, users }) => {
      console.log('Successfully joined room:', roomId);
      
      // Store current session info
      localStorage.setItem('userName', userName);
      localStorage.setItem('roomId', roomId);
      
      // Navigate to room
      router.push(`/room/${roomId}`);
    };

    // Set up socket event listeners
    socket.on('connect', handleConnect);
    socket.on('connect_error', handleConnectError);
    socket.on('disconnect', handleDisconnect);
    socket.on('joined-room', handleJoinedRoom);

    // Clean up listeners on unmount
    return () => {
      socket.off('connect', handleConnect);
      socket.off('connect_error', handleConnectError);
      socket.off('disconnect', handleDisconnect);
      socket.off('joined-room', handleJoinedRoom);
    };
  }, [router, userName]);

  // Generate a random room ID
  const generateRandomRoomId = () => {
    setIsGeneratingRoom(true);
    
    // Create a random alphanumeric string
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const length = 6;
    
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    setRoomId(result);
    setIsGeneratingRoom(false);
  };

  // Handle joining a room
  const handleJoinRoom = () => {
    // Reset error state
    setError('');
    
    // Validate inputs
    if (!userName.trim()) {
      setError('Please enter your name');
      return;
    }
    
    if (!roomId.trim()) {
      setError('Please enter a room ID or generate one');
      return;
    }
    
    // Connect socket if not connected
    if (!socket.connected) {
      setSocketStatus('connecting');
      socket.connect();
    }
    
    // Join room
    socket.emit('join-room', { 
      Name: userName.trim(), 
      roomId: roomId.trim() 
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      {/* Logo and Header */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center mb-2">
          <Code size={32} className="text-blue-400 mr-2" />
          <h1 className="text-3xl font-bold text-white">CodeCollab</h1>
        </div>
        <p className="text-gray-400">Collaborative coding and video interviews</p>
      </div>
      
      {/* Join Form */}
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-700 px-6 py-4 border-b border-gray-600">
          <h2 className="text-xl font-medium text-white flex items-center">
            <Users size={20} className="mr-2 text-blue-400" />
            Join a Coding Room
          </h2>
        </div>
        
        <div className="p-6 space-y-4">
          {/* Server Status */}
          <div className={`flex items-center text-sm ${
            socketStatus === 'connected' 
              ? 'text-green-400' 
              : socketStatus === 'connecting' 
                ? 'text-yellow-400' 
                : 'text-red-400'
          }`}>
            <Server size={16} className="mr-2" />
            {socketStatus === 'connected' 
              ? 'Connected to server' 
              : socketStatus === 'connecting' 
                ? 'Connecting to server...' 
                : 'Not connected to server'}
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-800 text-red-300 px-4 py-2 rounded text-sm">
              {error}
            </div>
          )}
          
          {/* Name Input */}
          <div className="space-y-2">
            <label htmlFor="userName" className="block text-sm font-medium text-gray-300">
              Your Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={16} className="text-gray-500" />
              </div>
              <input
                type="text"
                id="userName"
                className="bg-gray-700 text-white pl-10 w-full py-2 px-4 rounded border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleJoinRoom()}
              />
            </div>
          </div>
          
          {/* Room ID Input */}
          <div className="space-y-2">
            <label htmlFor="roomId" className="block text-sm font-medium text-gray-300">
              Room ID
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Hash size={16} className="text-gray-500" />
                </div>
                <input
                  type="text"
                  id="roomId"
                  className="bg-gray-700 text-white pl-10 w-full py-2 px-4 rounded border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter room ID"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleJoinRoom()}
                />
              </div>
              <button
                type="button"
                onClick={generateRandomRoomId}
                className="bg-gray-700 hover:bg-gray-600 text-gray-300 p-2 rounded border border-gray-600 transition-colors"
                title="Generate random room ID"
              >
                <RefreshCw size={16} className={isGeneratingRoom ? 'animate-spin' : ''} />
              </button>
            </div>
            <p className="text-gray-500 text-xs">
              Enter an existing room ID or generate a new one to create a room
            </p>
          </div>
          
          {/* Join Button */}
          <button
            onClick={handleJoinRoom}
            disabled={socketStatus === 'connecting'}
            className={`w-full flex items-center justify-center ${
              socketStatus === 'connecting'
                ? 'bg-blue-700 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white py-2 px-4 rounded transition-colors font-medium`}
          >
            {socketStatus === 'connecting' ? (
              <>
                <RefreshCw size={16} className="animate-spin mr-2" />
                Connecting...
              </>
            ) : (
              <>
                Join Room
                <ArrowRight size={16} className="ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Feature Showcase */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl text-center">
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="bg-blue-900/30 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
            <Code size={24} className="text-blue-400" />
          </div>
          <h3 className="text-white font-medium mb-1">Collaborative Coding</h3>
          <p className="text-gray-400 text-sm">Real-time code editor with syntax highlighting and error detection</p>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="bg-blue-900/30 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
            <Users size={24} className="text-blue-400" />
          </div>
          <h3 className="text-white font-medium mb-1">Video Conferencing</h3>
          <p className="text-gray-400 text-sm">HD video and audio communication with multiple participants</p>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="bg-blue-900/30 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-white font-medium mb-1">LeetCode-Style Problems</h3>
          <p className="text-gray-400 text-sm">Practice with coding challenges similar to technical interviews</p>
        </div>
      </div>
    </div>
  );
}