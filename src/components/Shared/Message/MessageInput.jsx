import { Input, Button } from "antd";
import { SendOutlined } from "@ant-design/icons";

const MessageInput = ({
  userMessage,
  setUserMessage,
  sendMessage,
  loading,
  selectedConversation,
  messagesByConversation,
  setMessagesByConversation,
  currentUserRole,
}) => {
  return (
    <>
      {currentUserRole === "user" ? (
        <div className="p-4 border-t flex items-center space-x-2">
          <Input
            placeholder="Type a message..."
            value={userMessage}
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
          <Input
            placeholder="Type a message..."
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
    </>
  );
};

export default MessageInput;
