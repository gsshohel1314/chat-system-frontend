import React, { useState } from 'react';
import axiosClient from '../../api/axiosClient';

const SearchUser = ({ setSelectedUser }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === '') {
      setResults([]);
      return;
    }

    try {
      const res = await axiosClient.get(`/search-users?q=${value}`);
      setResults(res.data.data);
    } catch (error) {
      console.error('Search failed', error);
    }
  };

  const handleSelect = (user) => {
    setSelectedUser(user);
    setQuery('');
    setResults([]);
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={handleSearch}
        className="w-full p-2 border rounded"
      />
      {results.length > 0 && (
        <ul className="bg-white border mt-2 rounded shadow">
          {results.map((user) => (
            <li
              key={user.id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(user)}
            >
              {user.name} ({user.email})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchUser;
