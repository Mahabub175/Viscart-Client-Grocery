/* eslint-disable no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import Image from "next/image";
import Link from "next/link";
import { GiCancel } from "react-icons/gi";
import {
  closePopup,
  selectLastPopupClosed,
} from "@/redux/services/device/deviceSlice";
import { useDispatch, useSelector } from "react-redux";
import { useDeviceId } from "@/redux/services/device/deviceSlice";

const PopupBanner = () => {
  const { data: globalData } = useGetAllGlobalSettingQuery();
  const dispatch = useDispatch();
  const deviceId = useDeviceId();
  const lastPopupClosed = useSelector((state) =>
    selectLastPopupClosed(state, deviceId)
  );

  const [isVisible, setIsVisible] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    if (!globalData) return;

    const now = Date.now();
    const duration = parseInt(globalData?.results?.popUpDuration, 10);

    if (lastPopupClosed && now - lastPopupClosed < 24 * 60 * 60 * 1000) {
      setIsVisible(false);
    } else {
      setRemainingTime(duration);
      setIsVisible(true);
    }

    let timer;
    if (isVisible) {
      timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setIsVisible(false);
            dispatch(closePopup(deviceId));
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [globalData, lastPopupClosed, dispatch, deviceId, isVisible]);

  const handleClosePopup = () => {
    setIsVisible(false);
    dispatch(closePopup(deviceId));
  };

  return (
    isVisible &&
    globalData?.results?.popUpImage && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="relative">
          <Link
            href={globalData?.results?.popUpLink ?? "/"}
            className="rounded-lg text-center"
          >
            <Image
              width={500}
              height={500}
              src={globalData?.results?.popUpImage}
              alt="Popup Image"
              className="w-full h-auto mb-4 rounded-lg"
            />
          </Link>
          <button
            className="mt-1 bg-gray-200 hover:scale-110 duration-500 absolute top-2 right-2 rounded-full p-1"
            onClick={handleClosePopup}
          >
            <GiCancel className="text-xl text-red-500" />
          </button>
        </div>
      </div>
    )
  );
};

export default PopupBanner;
