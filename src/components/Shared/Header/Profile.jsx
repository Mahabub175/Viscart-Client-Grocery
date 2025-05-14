import Image from "next/image";
import Link from "next/link";
import { Avatar, Button, Popover } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { logout, useCurrentUser } from "@/redux/services/auth/authSlice";
import { toast } from "sonner";
import { useGetSingleUserQuery } from "@/redux/services/auth/authApi";

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector(useCurrentUser);
  const { data } = useGetSingleUserQuery(user?._id);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully!");
  };

  const content = (
    <div>
      <div className="rounded-md px-16 py-3">
        <div className="flex flex-col items-center gap-4 text-lg">
          {data?.profile_image ? (
            <Image
              src={data?.profile_image}
              alt="profile"
              height={40}
              width={40}
              className="rounded-full w-[60px] h-[60px] border-2 !border-primary"
            />
          ) : (
            <Avatar size={40} icon={<UserOutlined />} />
          )}
          <div className="flex flex-col text-center font-normal">
            <div className="text-xl font-bold">
              <span className="mr-1">{data?.name ?? "User"}</span>
            </div>
            <span className={`text-base`}>{data?.number}</span>
          </div>
        </div>
      </div>

      <Link
        href={`/${data?.role}/account-setting`}
        className="flex justify-center font-semibold hover:text-primary border rounded-xl py-2"
      >
        Account Setting
      </Link>

      <div className="flex w-full justify-end pt-3">
        <Button
          onClick={handleLogout}
          className={`w-full`}
          size="large"
          type="default"
        >
          Log Out
        </Button>
      </div>
    </div>
  );
  return (
    <div className="flex justify-between items-center pt-2 pb-2 bg-white px-10 border-b">
      <div className="flex items-center -ml-8 lg:-ml-5">
        <Link
          href={"/"}
          className="text-black hover:text-white hover:bg-primary border border-primary font-semibold text-sm transition-all duration-300 ease-in-out bg-transparent rounded p-2"
        >
          <span className="mr-2">🏠</span>
          Return Home
        </Link>
      </div>

      <Popover
        placement="bottomLeft"
        content={content}
        className="cursor-pointer bg-primary -mr-9 lg:-mr-6"
      >
        {data?.profile_image ? (
          <Image
            src={data?.profile_image}
            alt="profile"
            height={40}
            width={40}
            className="rounded-full w-[40px] h-[40px]"
          />
        ) : (
          <Avatar
            className="!-mr-6 lg:mr-0"
            size={40}
            icon={<UserOutlined />}
          />
        )}
      </Popover>
    </div>
  );
};

export default Profile;
