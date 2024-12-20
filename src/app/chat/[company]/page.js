'use client';

import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const socketClient = () => {
    return io(process.env.SERVER_URL);
};

let socket;

const ChatRoom = ({ params }) => {
    const company = React.use(params).company;
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const emojis = ['😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '😈', '👿', '👹', '👺', '💩', '👻', '💀', '👽', '👾', '🤖', '🎃', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '🍆', '🍑', '🍔', '🍮', '🏋️‍♀️', '❤️', '💯', '💔', '💢', '🔔', '📢', '🗯', '🏳️', '🦧', '🐶', '🐕', '🦮', '🐕‍🦺', '🐩', '🐺', '🦊', '🦝', '🐱', '🐈', '🐈‍⬛', '🦁', '🐯', '🐅', '🐆', '🐴', '🫎', '🫏', '🐎', '🦄', '🦓', '🦌', '🦬', '🐮', '🤦', '🤦‍♂️', '🤦‍♀️', '🤷', '🤷‍♂️', '🤷‍♀️', '🧑‍⚕️', '👨‍⚕️', '👩‍⚕️', '🧑‍🎓', '👨‍🎓', '👩‍🎓', '🧑‍🏫', '👨‍🏫', '👩‍🏫', '🧑‍⚖️', '👨‍⚖️', '👩‍⚖️', '🧑‍🌾', '👨‍🌾', '👩‍🌾', '🧑‍🍳', '👨‍🍳', '👩‍🍳', '🧑‍🔧', '👨‍🔧', '👩‍🔧', '🧑‍🏭', '👨‍🏭', '👩‍🏭', '🧑‍💼', '👨‍💼', '👩‍💼', '🧑‍🔬', '👨‍🔬', '👩‍🔬', '🧑‍💻', '👨‍💻', '👩‍💻', '🧑‍🎤', '👨‍🎤', '👩‍🎤', '🧑‍🎨', '👨‍🎨', '👩‍🎨', '🧑‍✈️', '👨‍✈️', '👩‍✈️', '🧑‍🚀', '👨‍🚀', '👩‍🚀', '🧑‍🚒', '👨‍🚒', '👩‍🚒', '👮', '👮‍♂️', '👮‍♀️', '🕵️', '🕵️‍♂️', '🕵️‍♀️', '💂', '💂‍♂️', '💂‍♀️', '🥷', '👷', '👷‍♂️', '👷‍♀️', '🫅', '🤴', '👸', '👳', '👳‍♂️', '👳‍♀️', '👲', '🧕', '🤵', '🤵‍♂️', '🤵‍♀️', '👰', '👰‍♂️', '👰‍♀️', '🤰', '🫃', '🫄', '🤱', '👩‍🍼', '👨‍🍼', '🧑‍🍼', '👼', '🎅', '🤶', '🧑‍🎄', '🦸', '🦸‍♂️', '🦸‍♀️', '🦹', '🦹‍♂️', '🦹‍♀️', '🧙', '🧙‍♂️', '🧙‍♀️', '🧚', '🧚‍♂️', '🧚‍♀️', '🧛', '🧛‍♂️', '🧛‍♀️', '🧜', '🧜‍♂️', '🧜‍♀️', '🧝', '🧝‍♂️', '🧝‍♀️', '🧞', '🧞‍♂️', '🧞‍♀️', '🧟', '🧟‍♂️', '🧟‍♀️', '🧌'];
    const [username] = useState(emojis[Math.floor(Math.random() * emojis.length)]);
    const [typingUsers, setTypingUsers] = useState([]);
    const [activeUsersCount, setActiveUsersCount] = useState(0);
    const messagesContainerRef = useRef(null);

    useEffect(() => {
        if (company) {
            socket = socketClient();
            socket.emit('join', { company, username });

            socket.on('message', (msg) => {
                setMessages((prevMessages) => [...prevMessages, msg]);
                if (messagesContainerRef.current) {
                    messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
                }
            });

            socket.on('olderMessages', (olderMessages) => {
                setMessages((prevMessages) => [...olderMessages, ...prevMessages]);
                if (messagesContainerRef.current) {
                    messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
                }
            });


            socket.on('typing', ({ username }) => {
                setTypingUsers((prevUsers) => [...prevUsers, username]);
            });

            socket.on('stopTyping', ({ username }) => {
                setTypingUsers((prevUsers) => prevUsers.filter((user) => user !== username));
            });

            socket.on('activeUsers', ({ count }) => {
                setActiveUsersCount(count);
            });

            window.addEventListener('beforeunload', () => {
                socket.emit('disconnect', { company, username });
            });

            return () => {
                window.removeEventListener('beforeunload', () => {
                    socket.emit('disconnect', { company, username });
                });
                socket.disconnect();
            };
        }
    }, [company]);

    const handleSendMessage = () => {
        if (message.trim()) {
            socket.emit('sendMessage', { company, message, username });
            setMessage('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSendMessage();
        } else if (message.trim().length > 0) {
            socket.emit('typing', { company, username });
        }
    };

    const handleKeyUp = (e) => {
        socket.emit('stopTyping', { company, username });
    };

    return (
        <div className="chat-room w-4/6 m-auto h-screen p-6 bg-white">
            <h1 className="text-4xl font-sans text-center text-gray-800 mb-6">{company} - Chat Room</h1>
            <div className="messages font-mono bg-gray-50 p-6 rounded-t-lg h-4/6 overflow-y-auto" ref={messagesContainerRef}>
                {typingUsers.map((user, index) => (
                    <div key={index} className="text-sm text-gray-500 mb-2">
                        <strong>{user} is typing...</strong>
                    </div>
                ))}
                {messages.map((msg, index) => (
                    <div key={index} className="mb-2 text-lg text-gray-700">
                        <strong className="text-blue-600">{msg.username}: </strong>{msg.message}
                    </div>
                ))}
            </div>
            <div className="text-center font-serif text-gray-600 mb-4">
                Active Users: {activeUsersCount}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                onKeyUp={handleKeyUp}
                placeholder="Type a message..."
                className="border p-3 w-full mb-4 font-mono rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                onClick={handleSendMessage}
                className="bg-blue-600 text-white p-3 rounded-lg w-full hover:bg-blue-700 transition duration-300"
            >
                Send
            </button>
        </div>
    );



};

export default ChatRoom;
