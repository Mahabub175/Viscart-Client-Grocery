"use client";

import { motion } from "framer-motion";

const CustomMarquee = ({ data }) => {
  return (
    <div className="overflow-hidden whitespace-nowrap w-full flex items-center justify-center">
      <motion.div
        className="inline-block"
        animate={{ x: ["100%", "-100%"] }}
        transition={{
          repeat: Infinity,
          duration: 30,
          ease: "linear",
        }}
      >
        <span className="mx-8 text-2xl font-bold">{data}</span>
      </motion.div>
    </div>
  );
};

export default CustomMarquee;
