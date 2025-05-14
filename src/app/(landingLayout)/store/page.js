"use client";

import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import { Button } from "antd";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Store = () => {
  const { data: globalData } = useGetAllGlobalSettingQuery();
  return (
    <section className="my-container mt-10 mb-20">
      <div className="bg-white p-5 rounded-xl shadow-xl mb-10 text-center">
        <Image
          src={globalData?.results?.storeImage}
          alt="store"
          className="object-cover rounded-lg mx-auto"
          width={500}
          height={500}
        />
        <div className="mt-5 font-medium space-y-2">
          <div
            dangerouslySetInnerHTML={{
              __html: globalData?.results?.businessAddress,
            }}
          />
          <h3>Business Hours: {globalData?.results?.businessWorkHours}</h3>
          <Link
            href={globalData?.results?.businessLocation || "/"}
            target="_blank"
          >
            <Button className="mt-5" type="primary">
              Show On Map
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Store;
