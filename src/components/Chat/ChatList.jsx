import React from 'react';

const ChatList = ({ conversations, setSelectedConversation }) => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Your Conversations</h2>
      {conversations.length === 0 ? (
        <p className="text-gray-500">No conversations yet.</p>
      ) : (
        <ul className="space-y-2">
          {conversations.map((con) => {
            const otherUser = con.user_one?.id === con.auth_user_id ? con.user_two : con.user_one;
            return (
              <li
                key={con.id}
                onClick={() => setSelectedConversation(con)}
                className="cursor-pointer p-2 border rounded hover:bg-gray-100"
              >
                <div className="font-medium">{otherUser?.name}</div>
                <div className="text-sm text-gray-500">
                  Last message: {con.messages[0]?.message?.slice(0, 30) || 'No message yet'}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ChatList;
