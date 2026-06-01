import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Chat = () => {
  const messagesEndRef = useRef(null);
  const { targetUserId } = useParams();
  const user = useSelector((store) => store.user);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const userId = user?._id;

  const fetchChatMessages = async () => {
    const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
      withCredentials: true,
    });
    const chatMessages = chat?.data?.messages.map((msg) => {
      const { senderId, text } = msg;
      return {
        firstName: senderId?.firstName,
        lastName: senderId?.lastName,
        text,
      };
    });
    setMessages(chatMessages);
  };

  useEffect(() => {
    fetchChatMessages();
  }, [targetUserId]);

  useEffect(() => {
    if (!userId || !targetUserId) return;
    const socket = createSocketConnection();
    socket.emit("joinChat", {
      firstName: user?.firstName,
      userId,
      targetUserId,
    });

    socket.on("messageReceived", ({ firstName, lastName, text }) => {
      console.log(firstName + ":" + text);
      setMessages((messages) => [...messages, { firstName, lastName, text }]);
    });
    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  const sendMessage = () => {
    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text: newMessage,
    });
    setNewMessage("");
  };

useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);

  return (
    <div className="w-full max-w-4xl mx-auto border border-gray-600 h-[100vh] sm:h-[85vh] md:h-[80vh] my-5 flex flex-col rounded-none sm:rounded">
      <h1 className="p-3 sm:p-5 border-b border-gray-600 text-center sm:text-left">
        Chat
      </h1>

      {/* Messages */}
      <div className="p-3 sm:p-5 flex-1 overflow-y-auto min-h-0">
  {messages.map((msg, index) => (
    <div
      key={index}
      className={
        "chat " +
        (msg.firstName === user?.firstName
          ? "chat-end"
          : "chat-start")
      }
    >
      <div className="chat-header text-xs sm:text-sm mb-1 sm:mb-2">
        {`${msg?.firstName} ${msg?.lastName}`}
      </div>
      <div className="chat-bubble text-sm sm:text-base break-words">
        {msg?.text}
      </div>
    </div>
  ))}

  
  <div ref={messagesEndRef} />
</div>

      {/* Input */}
      <div className="border-t border-gray-600 p-3 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <input
          value={newMessage}
          type="text"
          placeholder="Type a message..."
          className="p-2 border border-gray-500 flex-1 rounded text-sm sm:text-base"
          onChange={(e) => {
            setNewMessage(e.target.value);
          }}
        />

        <button
          onClick={sendMessage}
          className="btn btn-secondary w-full sm:w-auto"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
