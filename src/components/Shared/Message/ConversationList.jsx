import { Avatar, Empty, Spin } from "antd";
import { UserOutlined, DeleteOutlined } from "@ant-design/icons";
import { formatImagePath } from "@/utilities/lib/formatImagePath";
import Image from "next/image";
import dayjs from "dayjs";

const ConversationList = ({
  conversations,
  selectedConversation,
  setSelectedConversation,
  loading,
}) => {
  return (
    <div className="w-1/3 border-r bg-gray-100 p-2 overflow-y-auto">
      <h3 className="text-lg font-semibold mb-2">Conversations</h3>
      {loading ? (
        <Spin />
      ) : conversations.length > 0 ? (
        conversations.map((conversation) => (
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
                    src={formatImagePath(conversation?.userId?.profile_image)}
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
                        conversation.userId?.name ?? conversation.userId?._id
                      ).slice(0, 10)}${
                        conversation.userId?.name?.length > 10 ? "..." : ""
                      } (User)`
                    : `${conversation.deviceId.slice(0, 10)}${
                        conversation.deviceId.length > 10 ? "..." : ""
                      } (Device)`}
                </h4>
                <p className="text-xs text-gray-600 mb-2">
                  {conversation.lastMessage?.text || "No message"}
                </p>
                <small className="text-xs text-gray-500">
                  {dayjs(conversation.lastMessage?.timestamp).format("hh:mm A")}
                </small>
              </div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <DeleteOutlined className="text-red-500" />
              </div>
            </div>
          </div>
        ))
      ) : (
        <Empty description="No conversations yet" />
      )}
    </div>
  );
};

export default ConversationList;
