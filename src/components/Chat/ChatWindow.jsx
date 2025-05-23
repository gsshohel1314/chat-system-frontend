import React, { useEffect, useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import MessageInput from './MessageInput';
import axiosClient from '../../api/axiosClient';
import echo from '../../echo';

const MessageBubble = ({ msg, isSender, initial }) => {
  const time = new Date(msg.created_at).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`flex items-end mb-3 ${isSender ? 'justify-end' : 'justify-start'}`}>
      {isSender ? (
        <>
          <div className="mr-2 p-3 rounded-lg max-w-xs bg-blue-500 text-white">
            <p>{msg.message}</p>
            <span className="text-xs block text-right mt-1 text-white/70">{time}</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
            {initial}
          </div>
        </>
      ) : (
        <>
          <div className="w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center text-sm font-semibold mr-2">
            {initial}
          </div>
          <div className="p-3 rounded-lg max-w-xs bg-gray-300 text-gray-900">
            <p>{msg.message}</p>
            <span className="text-xs block text-right mt-1 text-gray-600">{time}</span>
          </div>
        </>
      )}
    </div>
  );
};

const ChatWindow = ({ conversation, user, refreshConversations, authUser }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const getReceiverId = useCallback(() => {
    if (conversation) {
      return conversation.user_one.id === conversation.auth_user_id
        ? conversation.user_two.id
        : conversation.user_one.id;
    }
    return user?.id;
  }, [conversation, user]);

  const fetchMessages = useCallback(async (conversationId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosClient.get(`/messages/${conversationId}`);
      setMessages(res.data.data);
    } catch (err) {
      setError('Failed to fetch messages.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSend = async (text) => {
    if (!text.trim()) return;

    try {
      const res = await axiosClient.post('/messages', {
        receiver_id: user?.id ?? getReceiverId(),
        message: text,
        conversation_id: conversation?.id || null,
      });

      if (conversation) {
        fetchMessages(conversation.id);
      } else {
        refreshConversations();
      }

      setMessages((prev) => {
        const exists = prev.some((m) => m.id === res.data.data.id);
        return exists ? prev : [...prev, res.data.data];
      });
    } catch (err) {
      setError('Failed to send message.');
      console.error(err);
    }
  };

  useEffect(() => {
    if (conversation) {
      fetchMessages(conversation.id);
    } else if (user) {
      setMessages([]);
    }
  }, [conversation, user, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const channel = echo.channel('chat-channel');

    channel.listen('.ChatEvent', (e) => {
      console.log('RealTime Message:', e);
      setMessages((prev) => {
        const exists = prev.some((m) => m.id === e.id);
        return exists ? prev : [...prev, e];
      });
    });

    return () => {
      echo.leave('chat-channel');
    };
  }, []);

  if (!conversation && !user) {
    return <div className="p-4 text-gray-600">Select a user or conversation to start chatting.</div>;
  }

  const chattingWith = conversation
    ? conversation.user_one.id === authUser?.id
      ? conversation.user_two.name
      : conversation.user_one.name
    : user?.name;

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white p-4 shadow-sm border-b text-lg font-semibold">
        Chatting with: {chattingWith}
      </div>

      <div className="flex-grow overflow-y-auto p-4 bg-gray-50 rounded">
        {error && <p className="text-red-500 mb-2">{error}</p>}

        {loading ? (
          <p>Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-gray-500">No messages yet. Say hello!</p>
        ) : (
          messages.map((msg) => {
            const isSender = msg.sender_id === authUser?.id;
            const initial = msg.sender?.name?.charAt(0).toUpperCase() || 'U';
            return (
              <MessageBubble
                key={`msg-${msg.id}`}
                msg={msg}
                isSender={isSender}
                initial={initial}
              />
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput onSend={handleSend} />
    </div>
  );
};

ChatWindow.propTypes = {
  conversation: PropTypes.object,
  user: PropTypes.object,
  refreshConversations: PropTypes.func.isRequired,
  authUser: PropTypes.object.isRequired,
};

export default ChatWindow;