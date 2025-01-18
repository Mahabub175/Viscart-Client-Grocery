import { FaLocationDot, FaPhone, FaClock } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

const ContactInfo = ({ globalData }) => {
  return (
    <div className="">
      <h3 className="text-2xl font-bold mb-6">Contact</h3>
      <div className="flex items-center gap-2 -mt-2">
        <FaLocationDot className="text-primary" />
        <p className="text-grey-400">
          <span className="font-semibold">Address: </span>
          {globalData?.results?.businessAddress}
        </p>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <FaPhone className="text-primary" />
        <p className="text-grey-400">
          <span className="font-semibold">Phone:</span>{" "}
          {globalData?.results?.businessNumber}
        </p>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <MdEmail className="text-primary" />
        <p className="text-grey-400">
          <span className="font-semibold">Email:</span>{" "}
          {globalData?.results?.businessEmail}
        </p>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <FaClock className="text-primary" />
        <p className="text-grey-400">
          <span className="font-semibold">Work hours:</span>{" "}
          {globalData?.results?.businessWorkHours}
        </p>
      </div>
    </div>
  );
};

export default ContactInfo;
