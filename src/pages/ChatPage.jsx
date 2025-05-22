import React, { useEffect, useState, useCallback } from 'react';
import SearchUser from '../components/Chat/SearchUser';
import ChatList from '../components/Chat/ChatList';
import ChatWindow from '../components/Chat/ChatWindow';
import axiosClient from '../api/axiosClient';

const ChatPage = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchUser, setSearchUser] = useState(null);
  const [authUser, setAuthUser] = useState(null);

  // Fetch Authenticated User
  const fetchAuthUser = async () => {
    try {
      const res = await axiosClient.get('/user');
      setAuthUser(res.data);
    } catch (err) {
      console.error('Failed to fetch user', err);
    }
  };

  useEffect(() => {
    fetchAuthUser();
  }, []);

  // Fetch Conversations after authUser is loaded
  const fetchConversations = useCallback(async () => {
    try {
      const res = await axiosClient.get('/conversations');
      const updated = res.data.map(conv => ({
        ...conv,
        auth_user_id: authUser?.id,
      }));
      setConversations(updated);
    } catch (err) {
      console.error('Failed to fetch conversations', err);
    }
  }, [authUser]);

  useEffect(() => {
    if (authUser) {
      fetchConversations();
    }
  }, [authUser, fetchConversations]);
  
  const handleUserSelect = (user) => {
    setSearchUser(user);
    setSelectedConversation(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 h-screen">
      {/* Sidebar */}
      <div className="border-r p-4 overflow-y-auto bg-white">
        <SearchUser setSelectedUser={handleUserSelect} />

        <div className="mt-6">
          <ChatList
            conversations={conversations}
            setSelectedConversation={setSelectedConversation}
          />
        </div>
      </div>

      {/* Chat Window */}
      <div className="col-span-2 px-4 flex flex-col h-screen bg-gray-100">
        <ChatWindow
          conversation={selectedConversation}
          user={searchUser}
          refreshConversations={fetchConversations}
          authUser={authUser}
        />
      </div>
    </div>
  );
};

export default ChatPage;