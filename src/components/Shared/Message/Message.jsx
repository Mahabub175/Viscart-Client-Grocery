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

  const chatEndRefs = useRef({});
  const [messagesByConversation, setMessagesByConversation] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [userMessage, setUserMessage] = useState("");
  const [localUserMessages, setLocalUserMessages] = useState([]);
  const [localConversations, setLocalConversations] = useState([]);

  const { data: userData, isLoading } = useGetSingleMessageByUserQuery(
    currentUserId ?? deviceId,
    {
      skip: currentUserRole === "admin",
    }
  );

  const { data: allMessagesData, isLoading: messagesLoading } =
    useGetAllMessagesQuery(undefined, { skip: currentUserRole !== "admin" });

  const [addMessage] = useAddMessageMutation();
  const [replyMessage] = useReplyMessageMutation();

  // useEffect(() => {
  //   if (selectedConversation && chatEndRefs.current[selectedConversation?._id]) {
  //     chatEndRefs.current[selectedConversation._id].scrollIntoView({ behavior: "smooth" });
  //   } else {
  //     chatEndRefs.current["single"]?.scrollIntoView({ behavior: "smooth" });
  //   }
  // }, [selectedConversation, localUserMessages, localConversations]);

  // Connect to WebSocket and listen for messages
  useEffect(() => {
    if (currentUserRole === "user") {
      socket.emit("joinRoom", { userId: user?._id, deviceId });
    }

    socket.on("messageUpdated", (updatedConversation) => {
      if (
        updatedConversation.deviceId === deviceId ||
        updatedConversation.userId === user?._id
      ) {
        setLocalUserMessages(updatedConversation.messages);
      }
    });

    return () => {
      socket.off("messageUpdated");
    };
  }, [user, deviceId, currentUserRole]);

  useEffect(() => {
    if (currentUserRole === "user" && userData) {
      setLocalUserMessages(userData);
    }
    if (currentUserRole === "admin" && allMessagesData?.results) {
      setLocalConversations(allMessagesData.results);
    }
  }, [userData, allMessagesData, currentUserRole]);

  const sendMessage = async (conversationId) => {
    const messageText = conversationId
      ? messagesByConversation[conversationId]
      : userMessage;
    if (!messageText?.trim()) return;
    setLoading(true);

    const newMessage = {
      senderRole: currentUserRole,
      text: messageText,
      timestamp: new Date().toISOString(),
      _id: Math.random().toString(36).substr(2, 9),
    };

    if (currentUserRole === "user") {
      setLocalUserMessages((prev) => [...prev, newMessage]);
    } else if (conversationId) {
      setLocalConversations((prev) =>
        prev.map((conv) =>
          conv._id === conversationId
            ? { ...conv, messages: [...conv.messages, newMessage] }
            : conv
        )
      );
    }

    try {
      if (currentUserRole === "user") {
        await addMessage({
          ...(user?._id ? { userId: user._id } : { deviceId }),
          messages: [newMessage],
        });
        setUserMessage("");
      } else if (conversationId) {
        await replyMessage({ conversationId, messages: [newMessage] });
        setMessagesByConversation((prev) => ({
          ...prev,
          [conversationId]: "",
        }));
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[500px] w-full max-w-4xl mx-auto bg-white border rounded-lg shadow-lg mt-56">
      {currentUserRole === "admin" && (
        <div className="w-1/3 border-r bg-gray-100 p-2 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-2">Conversations</h3>
          {messagesLoading ? (
            <Spin />
          ) : localConversations.length > 0 ? (
            <List
              itemLayout="horizontal"
              dataSource={localConversations}
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
              : currentUserRole === "admin"
              ? "Select a conversation"
              : "Chat"}
          </span>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-2">
          {isLoading || messagesLoading ? (
            <div className="flex justify-center">
              <Spin />
            </div>
          ) : selectedConversation ? (
            selectedConversation.messages.length > 0 ? (
              selectedConversation.messages.map((msg) => (
                <div
                  key={msg._id}
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
              ))
            ) : (
              <Empty description="No messages yet" />
            )
          ) : currentUserRole === "user" && localUserMessages.length > 0 ? (
            localUserMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.senderRole === currentUserRole
                    ? "justify-end"
                    : "justify-start"
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
            ))
          ) : (
            <Empty description="Select a conversation to view messages" />
          )}
          <div ref={(el) => (chatEndRefs.current["single"] = el)} />
        </div>

        <div className="p-4 border-t flex items-center space-x-2">
          <Input
            placeholder="Type a message..."
            value={
              currentUserRole === "user"
                ? userMessage
                : messagesByConversation[selectedConversation?._id] || ""
            }
            onChange={(e) =>
              currentUserRole === "user"
                ? setUserMessage(e.target.value)
                : setMessagesByConversation((prev) => ({
                    ...prev,
                    [selectedConversation?._id]: e.target.value,
                  }))
            }
            onPressEnter={() => sendMessage(selectedConversation?._id)}
            className="flex-1"
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={() => sendMessage(selectedConversation?._id)}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
