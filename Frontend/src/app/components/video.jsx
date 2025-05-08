'use client';
import { useState, useEffect, useRef } from 'react';
import socket from '../../socket';
import { createPeerConnection, initiateCall, handleIncomingCall, handleAnswer, handleIceCandidate,  
  setupIceCandidateHandler,
  setupTrackHandler
} from '../../peer';
import { Mic, MicOff, Video, VideoOff } from 'lucide-react';

// Main Video Manager Component
export default function VideoManager() {
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [users, setUsers] = useState([]);
  const [connections, setConnections] = useState(new Map());
  
  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerConnectionsRef = useRef(new Map());
  const remoteStreamsRef = useRef(new Map());
  
  const roomId = localStorage.getItem('roomId');
  const userName = localStorage.getItem('userName');

  // Initialize media and socket listeners
  useEffect(() => {
    if (!roomId || !userName) {
      console.error("Missing roomId or userName");
      return;
    }
    
    // Connect to socket if not connected
    if (!socket.connected) {
      socket.connect();
    }

    // Set up media and join room
    setupLocalMedia()
      .then(() => {
        socket.emit('join-room', { Name: userName, roomId });
        setupSocketListeners();
      })
      .catch(err => console.error("Error setting up media:", err));
    
    // Cleanup on unmount
    return () => cleanupResources();
  }, [roomId, userName]);

  // Set up local webcam and microphone
  const setupLocalMedia = async () => {
    try {
      if (localStreamRef.current) return localStreamRef.current;
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      localStreamRef.current = stream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.play().catch(e => 
          console.error('Error playing local video:', e)
        );
      }
      
      return stream;
    } catch (error) {
      console.error("Error accessing media devices:", error);
      throw error;
    }
  };

  // Set up socket event listeners
  const setupSocketListeners = () => {
    // When a new user joins the room
    socket.on('user-joined', ({ Name, socketId }) => {
      console.log(`${Name} joined with socket ID: ${socketId}`);
      
      setUsers(prev => {
        if (prev.some(user => user.socketId === socketId)) return prev;
        return [...prev, { name: Name, socketId }];
      });
    });
    
    // When receiving a call
    socket.on('incoming-call', async ({ from, offer, callerId }) => {
      console.log(`Incoming call from ${from}`);
      
      // Create peer connection if it doesn't exist
      if (!peerConnectionsRef.current.has(callerId)) {
        const peerConnection = createPeerConnection(localStreamRef.current);
        peerConnectionsRef.current.set(callerId, peerConnection);
        
        setupTrackHandler(peerConnection, (remoteStream) => {
          remoteStreamsRef.current.set(callerId, remoteStream);
          setConnections(new Map(remoteStreamsRef.current));
        });
        
        setupIceCandidateHandler(peerConnection, callerId);
      }
      
      // Handle the incoming call
      const pc = peerConnectionsRef.current.get(callerId);
      await handleIncomingCall(pc, offer, callerId);
    });
    
    // When a call is answered
    socket.on('answer-made', async ({ answer, answererId }) => {
      if (peerConnectionsRef.current.has(answererId)) {
        const pc = peerConnectionsRef.current.get(answererId);
        await handleAnswer(pc, answer);
      }
    });
    
    // When receiving ICE candidates
    socket.on('ice-candidate', async ({ from, candidate }) => {
      if (peerConnectionsRef.current.has(from)) {
        const pc = peerConnectionsRef.current.get(from);
        await handleIceCandidate(pc, candidate);
      }
    });
    
    // When a user disconnects
    socket.on('user-disconnected', ({ socketId }) => {
      setUsers(prev => prev.filter(user => user.socketId !== socketId));
      
      // Clean up connections
      if (peerConnectionsRef.current.has(socketId)) {
        const pc = peerConnectionsRef.current.get(socketId);
        pc.close();
        peerConnectionsRef.current.delete(socketId);
        remoteStreamsRef.current.delete(socketId);
        setConnections(new Map(remoteStreamsRef.current));
      }
    });
    
    // When joining a room
    socket.on('joined-room', ({ roomId, users: roomUsers }) => {
      console.log(`Successfully joined room: ${roomId}`);
      if (roomUsers && Array.isArray(roomUsers)) {
        setUsers(roomUsers);
      }
    });
  };

  // Call another user
  const callUser = async (socketId) => {
    try {
      // Create peer connection if it doesn't exist
      if (!peerConnectionsRef.current.has(socketId)) {
        const peerConnection = createPeerConnection(localStreamRef.current);
        peerConnectionsRef.current.set(socketId, peerConnection);
        
        setupTrackHandler(peerConnection, (remoteStream) => {
          remoteStreamsRef.current.set(socketId, remoteStream);
          setConnections(new Map(remoteStreamsRef.current));
        });
        
        setupIceCandidateHandler(peerConnection, socketId);
      }
      
      // Initiate the call
      await initiateCall(socketId, peerConnectionsRef.current.get(socketId));
    } catch (error) {
      console.error("Error calling user:", error);
    }
  };

  // Clean up resources on unmount
  const cleanupResources = () => {
    // Stop local media tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    // Close all peer connections
    peerConnectionsRef.current.forEach(pc => pc.close());
    peerConnectionsRef.current.clear();
    remoteStreamsRef.current.clear();
  };

  // Toggle microphone
  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      if (audioTracks.length > 0) {
        audioTracks[0].enabled = !audioTracks[0].enabled;
        setIsAudioMuted(!audioTracks[0].enabled);
      }
    }
  };

  // Toggle camera
  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      if (videoTracks.length > 0) {
        videoTracks[0].enabled = !videoTracks[0].enabled;
        setIsVideoOff(!videoTracks[0].enabled);
      }
    }
  };

  return (
    <div className="space-y-3">
      {/* Local Video */}
      <div className="relative bg-gray-900 rounded-md overflow-hidden aspect-video">
        <video 
          ref={localVideoRef} 
          autoPlay 
          muted 
          playsInline 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-0.5 rounded text-white text-xs">
          {userName} (You)
        </div>
      </div>
      
      {/* Remote Videos */}
      {Array.from(connections.entries()).map(([socketId, stream]) => (
        <RemoteVideo 
          key={socketId}
          socketId={socketId}
          stream={stream}
          userName={users.find(u => u.socketId === socketId)?.name || 'Remote User'}
        />
      ))}
      
      {/* Users who haven't connected yet */}
      {users.filter(user => !connections.has(user.socketId)).map(user => (
        <div 
          key={user.socketId} 
          className="bg-gray-200 rounded-md overflow-hidden aspect-video flex items-center justify-center relative"
        >
          <div className="text-center">
            <div className="text-gray-600 mb-2">{user.name}</div>
            <button
              onClick={() => callUser(user.socketId)}
              className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
            >
              Call
            </button>
          </div>
        </div>
      ))}
      
      {/* No other users message */}
      {users.length === 0 && (
        <div className="bg-gray-200 rounded-md overflow-hidden aspect-video flex items-center justify-center">
          <div className="text-gray-600">Waiting for others to join...</div>
        </div>
      )}
      
      {/* Controls */}
      <div className="flex justify-center space-x-2 mt-2">
        <button
          onClick={toggleMute}
          className={`p-2 rounded-full ${isAudioMuted ? 'bg-red-100 text-red-600' : 'bg-gray-200 text-gray-700'}`}
          title={isAudioMuted ? "Unmute" : "Mute"}
        >
          {isAudioMuted ? <MicOff size={18} /> : <Mic size={18} />}
        </button>
        <button
          onClick={toggleVideo}
          className={`p-2 rounded-full ${isVideoOff ? 'bg-red-100 text-red-600' : 'bg-gray-200 text-gray-700'}`}
          title={isVideoOff ? "Turn on camera" : "Turn off camera"}
        >
          {isVideoOff ? <VideoOff size={18} /> : <Video size={18} />}
        </button>
      </div>
    </div>
  );
}

// Remote Video Component
function RemoteVideo({ socketId, stream, userName }) {
  const videoRef = useRef(null);
  
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(e => 
        console.error('Error playing remote video:', e)
      );
    }
    
    return () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [stream]);
  
  return (
    <div className="relative bg-gray-900 rounded-md overflow-hidden aspect-video">
      <video 
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-0.5 rounded text-white text-xs">
        {userName}
      </div>
    </div>
  );
}