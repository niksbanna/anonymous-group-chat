'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [company, setCompany] = useState('');
  const [groups, setGroups] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch(`${process.env.SERVER_URL}/groups`)
      .then((response) => response.json())
      .then((data) => setGroups(data));
  }, []);

  const handleJoin = () => {
    if (company.trim() !== '') {
      router.push(`/chat/${encodeURIComponent(company)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleJoin();
    }
  };

  return (
    <div className="container max-w-md mx-auto p-6 bg-white shadow-md rounded-lg font-sans">
      <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">Join Your Group Chat</h1>
      <input
        type="text"
        placeholder="Enter Group Name to Join or Create"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        onKeyDown={handleKeyDown} 
        className="border p-3 w-full mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleJoin}
        className="bg-blue-600 text-white p-3 rounded-lg w-full hover:bg-blue-700 transition duration-300"
      >
        Join
      </button>
      <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-700">Active Groups: {groups.length}</h2>
      <ul className="space-y-2">
        {groups.map((group, index) => (
          <li key={index} className="bg-gray-50 p-2 rounded hover:bg-gray-100 transition duration-300">
            <a
              href={`/chat/${encodeURIComponent(group)}`}
              className="text-blue-600 hover:underline font-mono"
            >
              {group}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
