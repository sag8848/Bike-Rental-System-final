import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Send, MessageCircle } from 'lucide-react';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

const Chat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [adminId, setAdminId] = useState(null);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user) {
      socket.emit('join', user.id);
      fetchAdminAndMessages();
    }
    socket.on('receiveMessage', (msg) => {
      setMessages(prev => [...prev, msg]);
    });
    return () => socket.off('receiveMessage');
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchAdminAndMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      // Get admin ID via public endpoint
      const res = await axios.get('http://localhost:5000/api/chat/admin-id', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const id = res.data.adminId;
      setAdminId(id);
      const chatRes = await axios.get(`http://localhost:5000/api/chat/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(chatRes.data.messages || []);
    } catch (error) {
      setError('Could not connect to support. Please try again.');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !adminId) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/chat/send', {
        receiver_id: adminId,
        message: newMessage,
      }, { headers: { Authorization: `Bearer ${token}` } });

      socket.emit('sendMessage', {
        receiver_id: adminId,
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
    } catch (error) {
      setError('Failed to send message.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-orange-500 text-white px-6 py-4 flex items-center gap-3">
          <MessageCircle size={24} />
          <div>
            <h2 className="font-bold text-lg">Chat with Support</h2>
            <p className="text-orange-100 text-sm">We typically reply within minutes</p>
          </div>
        </div>
        {error && <div className="bg-red-50 text-red-600 px-4 py-2 text-sm">{error}</div>}
        <div className="h-96 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-3">
          {messages.length === 0 && (
            <div className="text-center text-gray-400 mt-20">
              <MessageCircle size={40} className="mx-auto mb-2 opacity-30" />
              <p>No messages yet. Say hello! 👋</p>
            </div>
          )}
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
        <div className="px-4 py-3 border-t flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
          <button onClick={sendMessage} className="bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-600 transition-colors">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
