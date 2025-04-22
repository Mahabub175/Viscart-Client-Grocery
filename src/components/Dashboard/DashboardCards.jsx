import Image from "next/image";
import Link from "next/link";
import React from "react";

const DashboardCards = ({ icon, image, title, data, href, size }) => {
  return (
    <Link
      href={href}
      className="bg-white p-5 rounded-xl shadow-xl text-base font-semibold text-end flex flex-col justify-center lg:justify-around items-center gap-2 hover:text-primary"
    >
      {icon &&
        React.createElement(icon, {
          className: "text-[40px] lg:text-[50px] text-primary",
        })}
      {image && (
        <Image src={image} alt={title} height={40} width={size ?? 40} />
      )}
      {data >= 0 && (
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-sm lg:text-xl">{title}</p>
          <p className="text-2xl lg:text-4xl">{data}</p>
        </div>
      )}
      {!data && data !== 0 && (
        <p className="text-center text-sm lg:text-xl">{title}</p>
      )}
    </Link>
  );
};

export default DashboardCards;
