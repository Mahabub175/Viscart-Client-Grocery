import { logout } from "@/redux/services/auth/authSlice";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import logoutImage from "@/assets/images/logout.png";
import Image from "next/image";

const LogOutButton = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    toast.success("Logged out successfully!");
    dispatch(logout());
  };

  return (
    <div
      className="bg-white p-5 rounded-xl shadow-xl text-base font-bold text-end flex flex-col justify-center lg:justify-around items-center gap-2 hover:text-primary cursor-pointer"
      onClick={handleLogout}
    >
      <Image src={logoutImage} alt={"logout"} height={40} width={40} />
      <p className="text-center text-sm lg:text-xl">Log Out</p>
    </div>
  );
};

export default LogOutButton;
