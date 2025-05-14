"use client";

import { Layout } from "antd";
import Sidebar from "@/components/Shared/Sidebar/Sidebar";
import { Content } from "antd/es/layout/layout";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/redux/store";
import PrivateRoute from "@/routes/PrivateRoute";
import BottomNavigation from "@/components/Shared/Navbar/BottomNavigation";
import Profile from "@/components/Shared/Header/Profile";

const DashboardLayout = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <PrivateRoute>
          <Layout className="relative h-full">
            <div className="fixed top-0 z-50 w-full">
              <Profile />
            </div>
            <Layout className="relative h-full">
              <div className="fixed top-14 z-50">
                <Sidebar />
              </div>
              <Content className="p-5 lg:pl-56 xl:pl-60 xxl:pl-56 mt-16">
                {children}
              </Content>
            </Layout>
            <BottomNavigation />
          </Layout>
        </PrivateRoute>
      </PersistGate>
    </Provider>
  );
};

export default DashboardLayout;
