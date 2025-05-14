import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { logout, useCurrentToken } from "@/redux/services/auth/authSlice";
import { useRouter } from "next/navigation";
import { useGetSingleUserQuery } from "@/redux/services/auth/authApi";

const PrivateRoute = ({ children }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const token = useSelector(useCurrentToken);

  let decodedToken;
  if (token) {
    decodedToken = jwtDecode(token);
  }

  const { data, isLoading } = useGetSingleUserQuery(decodedToken?.userId, {
    skip: !token,
  });

  useEffect(() => {
    if (!token) {
      dispatch(logout());
      router.push("/sign-in");
      return;
    }

    if (isLoading) return;

    const decodedToken = jwtDecode(token);
    const tokenExpirationTime = decodedToken.exp * 1000;
    const currentTime = Date.now();

    if (tokenExpirationTime <= currentTime) {
      toast.error("Your session has expired! Please log in again.");
      dispatch(logout());
      router.push("/sign-in");
      return;
    }

    if (data && decodedToken.role !== data.role) {
      toast.error("You don't have permission to access this page!");
      dispatch(logout());
      router.push("/sign-in");
    }
  }, [token, data, isLoading, dispatch, router]);

  if (!token || isLoading) return null;

  return children;
};

export default PrivateRoute;
