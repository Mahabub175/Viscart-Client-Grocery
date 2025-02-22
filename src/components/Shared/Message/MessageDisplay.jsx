import { Empty, Spin } from "antd";
import dayjs from "dayjs";

const MessageDisplay = ({ messages, loading, selectedConversation }) => {
  return (
    <div className="flex-1 p-4 overflow-y-auto space-y-2">
      {loading ? (
        <div className="flex justify-center">
          <Spin />
        </div>
      ) : selectedConversation ? (
        messages.length > 0 ? (
          messages.map((msg) => (
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
      ) : (
        <Empty description="Select a conversation to view messages" />
      )}
    </div>
  );
};

export default MessageDisplay;
