"use client";

import { useState } from "react";
import { IoMdChatboxes } from "react-icons/io";
import Messages from "./Message/Messages";

const Chat = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-[10%] right-2 lg:right-7 z-50">
      <button
        onClick={() => setOpen(!open)}
        className="bg-primary text-white rounded-full w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center text-2xl cursor-pointer z-50"
      >
        <IoMdChatboxes />
      </button>
      {open && (
        <div className="lg:mr-10 -mt-32 z-40">
          <Messages setOpen={setOpen} />
        </div>
      )}
    </div>
  );
};

export default Chat;
