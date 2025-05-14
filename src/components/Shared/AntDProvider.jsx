"use client";

import { useEffect, useState } from "react";
import { ConfigProvider } from "antd";
import { Provider, useDispatch, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "@/redux/store";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import { getColors, setColors } from "@/redux/services/theme/themeSlice";
import { logout, useCurrentToken } from "@/redux/services/auth/authSlice";
import { jwtDecode } from "jwt-decode";
import { Toaster } from "sonner";
import { usePathname } from "next/navigation";
import { useGetAllSlidersQuery } from "@/redux/services/slider/sliderApi";
import { useGetAllCategoriesQuery } from "../../redux/services/category/categoryApi";

const AntDProvider = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <WrappedAntDConfig>{children}</WrappedAntDConfig>
      </PersistGate>
    </Provider>
  );
};

const WrappedAntDConfig = ({ children }) => {
  const router = usePathname();
  const dispatch = useDispatch();
  const token = useSelector(useCurrentToken);
  const { data } = useGetAllGlobalSettingQuery();
  const { primaryColor } = useSelector(getColors);
  const [loading, setLoading] = useState(true);

  const { data: slider, isFetching } = useGetAllSlidersQuery();
  const { data: category, isFetching: isCategoryFetching } =
    useGetAllCategoriesQuery();

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      const tokenExpirationTime = decodedToken.exp * 1000;
      const currentTime = Date.now();

      if (currentTime > tokenExpirationTime) {
        dispatch(logout());
      }
    }
    setLoading(true);

    if (data?.results) {
      const websiteName = data?.results?.name || "Viscart";

      document.title = websiteName;

      const { primaryColor, secondaryColor, favicon } = data.results;

      dispatch(setColors({ primaryColor, secondaryColor }));

      if (favicon) {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
          link = document.createElement("link");
          link.rel = "icon";
          document.head.appendChild(link);
        }
        link.href = favicon;
      }

      document.documentElement.style.setProperty(
        "--primaryColor",
        primaryColor
      );
      document.documentElement.style.setProperty(
        "--secondaryColor",
        secondaryColor
      );
    }
    setLoading(false);
  }, [data, dispatch, token]);

  useEffect(() => {
    const websiteName = data?.results?.name || "Viscart";
    const favicon = data?.results?.favicon;
    document.title = websiteName;

    let link = document.querySelector("link[rel~='icon']");
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
    link.href = favicon;
  }, [data, router]);

  if (
    loading ||
    isFetching ||
    slider?.results?.length === 0 ||
    isCategoryFetching ||
    category?.results?.length === 0
  ) {
    return (
      <section className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </section>
    );
  }

  return (
    <ConfigProvider
      theme={{
        components: {
          Tabs: {
            itemSelectedColor: primaryColor,
            itemActiveBg: primaryColor,
            itemHoverBg: primaryColor,
            itemHoverColor: primaryColor,
            inkBarColor: primaryColor,
          },
          Table: {
            scroll: { x: 1000 },
          },
          Menu: {
            itemSelectedBg: primaryColor,
            itemSelectedColor: "#fff",
            itemActiveBg: primaryColor,
            itemActiveColor: "#fff",
            itemHoverBg: primaryColor,
            itemHoverColor: "#fff",
          },
          Input: {
            activeBorderColor: primaryColor,
            hoverBorderColor: primaryColor,
          },
          Upload: {
            colorPrimaryHover: primaryColor,
            colorPrimary: primaryColor,
          },
          Progress: {
            defaultColor: primaryColor,
          },
        },
        token: {
          colorPrimary: primaryColor,
          colorBorder: "#ebe7e8",
          colorPrimaryBorder: primaryColor,
        },
      }}
    >
      <Toaster closeButton duration={2000} richColors position="top-center" />
      {children}
    </ConfigProvider>
  );
};

export default AntDProvider;
