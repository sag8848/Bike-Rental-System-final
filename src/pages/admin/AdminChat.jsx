import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Send, MessageCircle, Users } from 'lucide-react';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

const AdminChat = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user) {
      socket.emit('join', user.id);
      fetchConversations();
    }

    socket.on('receiveMessage', (msg) => {
      setMessages(prev => [...prev, msg]);
      fetchConversations();
    });

    return () => socket.off('receiveMessage');
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/chat/conversations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConversations(res.data.conversations || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/chat/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data.messages || []);
    } catch (error) {
      console.error(error);
    }
  };

  const selectUser = (conv) => {
    setSelectedUser(conv.user);
    fetchMessages(conv.user.id);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/chat/send', {
        receiver_id: selectedUser.id,
        message: newMessage,
      }, { headers: { Authorization: `Bearer ${token}` } });

      socket.emit('sendMessage', {
        receiver_id: selectedUser.id,
        message: newMessage,
        sender: { id: user.id, name: user.name, role: user.role },
      });

      setMessages(prev => [...prev, {
        sender_id: user.id,
        sender: { id: user.id, name: user.name },
        message: newMessage,
        created_at: new Date(),
      }]);
      setNewMessage('');
      fetchConversations();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Customer Chat</h1>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex h-[600px]">
        {/* Left - Conversations */}
        <div className="w-72 border-r bg-gray-50 flex flex-col">
          <div className="p-4 border-b bg-white">
            <div className="flex items-center gap-2 text-gray-600">
              <Users size={18} />
              <span className="font-semibold">Conversations</span>
            </div>
          </div>
          <div className="overflow-y-auto flex-1">
            {conversations.length === 0 && (
              <p className="text-center text-gray-400 text-sm mt-10">No conversations yet</p>
            )}
            {conversations.map((conv, i) => (
              <div
                key={i}
                onClick={() => selectUser(conv)}
                className={`p-4 border-b cursor-pointer hover:bg-orange-50 transition-colors ${
                  selectedUser?.id === conv.user.id ? 'bg-orange-50 border-l-4 border-l-orange-500' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {conv.user.name[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-800">{conv.user.name}</p>
                      <p className="text-xs text-gray-400 truncate w-32">{conv.lastMessage}</p>
                    </div>
                  </div>
                  {conv.unread > 0 && (
                    <span className="bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {conv.unread}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Messages */}
        <div className="flex-1 flex flex-col">
          {selectedUser ? (
            <>
              <div className="p-4 border-b bg-white flex items-center gap-3">
                <div className="w-9 h-9 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                  {selectedUser.name[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-gray-800">{selectedUser.name}</p>
                  <p className="text-xs text-gray-400 capitalize">{selectedUser.role}</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-3">
                {messages.map((msg, i) => {
                  const isMe = msg.sender_id === user?.id;
                  return (
                    <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                        isMe ? 'bg-orange-500 text-white rounded-br-none' : 'bg-white text-gray-800 shadow rounded-bl-none'
                      }`}>
                        <p>{msg.message}</p>
                        <p className={`text-xs mt-1 ${isMe ? 'text-orange-100' : 'text-gray-400'}`}>
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <div className="px-4 py-3 border-t flex gap-2 bg-white">
                <input
                  type="text"
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
                <button
                  onClick={sendMessage}
                  className="bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-600 transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <MessageCircle size={48} className="mx-auto mb-3 opacity-30" />
                <p>Select a conversation to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminChat;
