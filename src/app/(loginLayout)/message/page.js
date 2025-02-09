"use client";

import { useState, useEffect, useRef } from "react";
import { Input, Button, Spin, Avatar, Empty, List } from "antd";
import { SendOutlined, UserOutlined } from "@ant-design/icons";
import {
  useAddMessageMutation,
  useReplyMessageMutation,
  useGetSingleMessageByUserQuery,
  useGetAllMessagesQuery,
} from "@/redux/services/message/messageApi";
import dayjs from "dayjs";
import { useDeviceId } from "@/redux/services/device/deviceSlice";
import { useSelector } from "react-redux";
import { useCurrentUser } from "@/redux/services/auth/authSlice";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const ChatBox = () => {
  const deviceId = useSelector(useDeviceId);
  const user = useSelector(useCurrentUser);
  const currentUserRole = user?.role === "admin" ? "admin" : "user";
  const currentUserId = user?._id || null;

  const chatEndRef = useRef(null);
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversations, setConversations] = useState([]);

  const { data: userData } = useGetSingleMessageByUserQuery(
    currentUserId ?? deviceId,
    { skip: currentUserRole === "admin" }
  );
  const { data: allMessagesData, isLoading: messagesLoading } =
    useGetAllMessagesQuery(undefined, { skip: currentUserRole !== "admin" });

  const [addMessage] = useAddMessageMutation();
  const [replyMessage] = useReplyMessageMutation();

  useEffect(() => {
    if (currentUserRole === "user" && userData?.messages) {
      setMessages(
        userData.messages.sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        )
      );
    }
  }, [userData, currentUserRole]);

  useEffect(() => {
    if (currentUserRole === "admin" && allMessagesData?.results) {
      setConversations(allMessagesData.results);
    }
  }, [allMessagesData, currentUserRole]);

  useEffect(() => {
    socket.emit("joinRoom", { userId: user?._id, deviceId });

    socket.on("messageUpdate", ({ conversationId, message }) => {
      if (currentUserRole === "user") {
        setMessages((prev) =>
          [...prev, message].sort(
            (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
          )
        );
      } else {
        setConversations((prev) =>
          prev.map((conv) =>
            conv._id === conversationId
              ? { ...conv, messages: [...conv.messages, message] }
              : conv
          )
        );
      }
    });

    return () => {
      socket.off("messageUpdate");
    };
  }, [user, deviceId, currentUserRole]);

  const sendMessage = async (conversationId) => {
    const messageText = userMessage.trim();
    if (!messageText) return;

    const newMessage = {
      senderRole: currentUserRole,
      text: messageText,
      attachment: null,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setUserMessage("");

    if (currentUserRole === "user") {
      await addMessage({
        ...(user?._id ? { userId: user._id } : { deviceId }),
        messages: [newMessage],
      });
    } else if (conversationId) {
      await replyMessage({ conversationId, messages: [newMessage] });
    }
  };

  return (
    <div className="flex h-[500px] w-full max-w-4xl mx-auto bg-white border rounded-lg shadow-lg">
      {currentUserRole === "admin" && (
        <div className="w-1/3 border-r bg-gray-100 p-2 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-2">Conversations</h3>
          {messagesLoading ? (
            <Spin />
          ) : conversations.length > 0 ? (
            <List
              itemLayout="horizontal"
              dataSource={conversations}
              renderItem={(conversation) => (
                <List.Item
                  className={`cursor-pointer p-2 rounded-lg ${
                    selectedConversation?._id === conversation._id
                      ? "bg-gray-300"
                      : "hover:bg-gray-200"
                  }`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={`Device: ${conversation.deviceId}`}
                    description={conversation.lastMessage?.text || "No message"}
                  />
                  <small className="text-xs opacity-60">
                    {dayjs(conversation.lastMessage?.timestamp).format(
                      "hh:mm A"
                    )}
                  </small>
                </List.Item>
              )}
            />
          ) : (
            <Empty description="No conversations yet" />
          )}
        </div>
      )}

      <div className="flex-1 flex flex-col">
        <div className="flex items-center p-4 border-b bg-gray-100">
          <Avatar icon={<UserOutlined />} />
          <span className="ml-2 font-semibold">
            {selectedConversation
              ? `Chat with ${selectedConversation.deviceId}`
              : "Chat"}
          </span>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.senderRole === "admin" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg text-white ${
                  msg.senderRole === "user" ? "bg-blue-500" : "bg-gray-600"
                }`}
              >
                <p>{msg.text}</p>
                <small className="block text-xs opacity-70 mt-1">
                  {dayjs(msg.timestamp).format("hh:mm A")}
                </small>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 border-t flex items-center space-x-2">
          <Input
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            className="flex-1"
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={() => sendMessage(selectedConversation?._id)}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
