"use client";

import { useState, useEffect, useRef } from "react";
import { Input, Button, Spin, Avatar, Empty } from "antd";
import { SendOutlined, UserOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  useAddMessageMutation,
  useReplyMessageMutation,
  useGetSingleMessageByUserQuery,
  useGetAllMessagesQuery,
  useDeleteConversationMutation,
} from "@/redux/services/message/messageApi";
import dayjs from "dayjs";
import { useDeviceId } from "@/redux/services/device/deviceSlice";
import { useSelector } from "react-redux";
import { useCurrentUser } from "@/redux/services/auth/authSlice";
import Image from "next/image";
import { formatImagePath } from "@/utilities/lib/formatImagePath";
import { RxCross1 } from "react-icons/rx";
import { toast } from "sonner";

const Messages = ({ setOpen }) => {
  const deviceId = useSelector(useDeviceId);
  const user = useSelector(useCurrentUser);
  const currentUserRole = user?.role === "admin" ? "admin" : "user";
  const currentUserId = user?._id || null;

  const chatEndRefs = useRef(null);
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
      pollingInterval: 5000,
    }
  );

  const { data: messageData } = useGetSingleMessageByUserQuery(
    selectedConversation?.deviceId
      ? selectedConversation?.deviceId
      : selectedConversation?.userId?._id,
    {
      skip: selectedConversation?.length < 0,
      pollingInterval: 5000,
    }
  );

  const { data: allMessagesData, isLoading: messagesLoading } =
    useGetAllMessagesQuery(undefined, {
      skip: currentUserRole !== "admin",
      pollingInterval: 5000,
    });

  const [addMessage] = useAddMessageMutation();
  const [replyMessage] = useReplyMessageMutation();

  const [deleteConversation] = useDeleteConversationMutation();

  useEffect(() => {
    if (currentUserRole === "user" && userData) {
      setLocalUserMessages(userData);
    }
    if (currentUserRole === "admin" && allMessagesData?.results) {
      setLocalConversations(allMessagesData?.results);
    }
  }, [userData, allMessagesData, currentUserRole]);

  useEffect(() => {
    if (selectedConversation && currentUserRole === "admin") {
      const selectedConv = localConversations.find(
        (conv) => conv._id === selectedConversation._id
      );
      if (selectedConv) {
        setMessagesByConversation(selectedConv.messages);
      }
    }
  }, [selectedConversation, localConversations, currentUserRole]);

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

  const handleDeleteConversation = async (conversationId) => {
    try {
      const res = await deleteConversation(conversationId);
      if (res.data.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("An error occurred while deleting the item.");
    }
  };

  return (
    <div className="flex h-[500px] w-full mx-auto bg-white border rounded-lg shadow-lg z-50">
      {currentUserRole === "admin" && (
        <div className="w-1/3 border-r bg-gray-100 p-2 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-2">Conversations</h3>
          {messagesLoading ? (
            <Spin />
          ) : localConversations.length > 0 ? (
            localConversations.map((conversation) => (
              <div
                key={conversation._id}
                className={`cursor-pointer p-2 rounded-lg border mt-2 group relative ${
                  selectedConversation?._id === conversation._id
                    ? "bg-gray-300"
                    : "hover:bg-gray-200 duration-300"
                }`}
                onClick={() => setSelectedConversation(conversation)}
              >
                <div className="flex flex-col lg:flex-row items-start gap-2">
                  <div>
                    {conversation?.userId?.profile_image ? (
                      <Image
                        src={formatImagePath(
                          conversation?.userId?.profile_image
                        )}
                        alt="profile"
                        height={35}
                        width={35}
                        className="rounded-full border-2 border-primary mr-2"
                      />
                    ) : (
                      <Avatar className="" size={35} icon={<UserOutlined />} />
                    )}
                  </div>
                  <div className="w-full">
                    <h4 className="font-normal text-xs mb-1">
                      {conversation?.userId
                        ? `${(
                            conversation?.userId?.name ??
                            conversation?.userId?._id
                          )
                            ?.slice(0, 10)
                            .concat(
                              conversation.userId?.name?.length > 10
                                ? "..."
                                : ""
                            )} (User)`
                        : `${conversation?.deviceId
                            ?.slice(0, 10)
                            .concat(
                              conversation?.deviceId.length > 10 ? "..." : ""
                            )} (Device)`}
                    </h4>

                    <p className="text-xs text-gray-600 mb-2">
                      {conversation.lastMessage?.text || "No message"}
                    </p>
                    <small className="text-xs text-gray-500">
                      {dayjs(conversation.lastMessage?.timestamp).format(
                        "hh:mm A"
                      )}
                    </small>
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DeleteOutlined
                      className="text-red-500 hover:scale-110 duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteConversation(conversation?._id);
                      }}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <Empty description="No conversations yet" />
          )}
        </div>
      )}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center p-4 border-b bg-gray-100 justify-between">
          <div className="flex items-center">
            <Avatar icon={<UserOutlined />} />
            <span className="ml-2 font-semibold">
              {selectedConversation
                ? `Chat with ${
                    selectedConversation?.userId?.name ??
                    selectedConversation?.userId?._id ??
                    selectedConversation?.deviceId
                  }`
                : currentUserRole === "admin"
                ? "Select a conversation"
                : "Chat"}
            </span>
          </div>
          <div
            className="hover:text-red-500 duration-300 hover:scale-105"
            onClick={() => setOpen(false)}
          >
            <RxCross1 />
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-2">
          {isLoading || messagesLoading ? (
            <div className="flex justify-center">
              <Spin />
            </div>
          ) : selectedConversation ? (
            messageData?.length > 0 ? (
              messageData?.map((msg) => (
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
          ) : currentUserRole === "user" && localUserMessages?.length > 0 ? (
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
          <div ref={chatEndRefs} />
        </div>

        {currentUserRole === "user" ? (
          <div className="p-4 border-t flex items-center space-x-2">
            <Input.TextArea
              placeholder="Type a message..."
              value={userMessage}
              type="textarea"
              onChange={(e) => setUserMessage(e.target.value)}
              onPressEnter={() => sendMessage(null)}
              className="flex-1"
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={() => sendMessage(null)}
              disabled={loading}
            />
          </div>
        ) : currentUserRole === "admin" && selectedConversation ? (
          <div className="p-4 border-t flex items-center space-x-2">
            <Input.TextArea
              placeholder="Type a message..."
              type="textarea"
              value={messagesByConversation[selectedConversation?._id] || ""}
              onChange={(e) =>
                setMessagesByConversation((prev) => ({
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
        ) : null}
      </div>
    </div>
  );
};

export default Messages;
